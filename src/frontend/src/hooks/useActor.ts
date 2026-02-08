import { useInternetIdentity } from "./useInternetIdentity";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { type backendInterface } from "../backend";
import { createActorWithConfig } from "../config";
import { getSecretParameter } from "../utils/urlParams";

interface ExtendedBackendInterface extends backendInterface {
  initializeAccessControl: () => Promise<void>;
}

interface ExtendedBackendInterfaceWithSecret extends backendInterface {
  _initializeAccessControlWithSecret: (userSecret: string) => Promise<void>;
}

const ACTOR_QUERY_KEY = "actor";
export function useActor() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery<backendInterface>({
    queryKey: [ACTOR_QUERY_KEY, identity?.getPrincipal().toString()],
    queryFn: async () => {
      const isAuthenticated = !!identity;

      if (!isAuthenticated) {
        // Return anonymous actor if not authenticated
        return await createActorWithConfig();
      }

      const actorOptions = {
        agentOptions: {
          identity,
        },
      };

      const actor = await createActorWithConfig(actorOptions);

      // Check if initializeAccessControl exists and call it (some backends may not have this method)
      if (
        "initializeAccessControl" in actor &&
        typeof (actor as ExtendedBackendInterface).initializeAccessControl ===
          "function"
      ) {
        await (actor as ExtendedBackendInterface).initializeAccessControl();
      } else if (
        "_initializeAccessControlWithSecret" in actor &&
        typeof (actor as ExtendedBackendInterfaceWithSecret)
          ._initializeAccessControlWithSecret === "function"
      ) {
        const adminToken = getSecretParameter("caffeineAdminToken") || "";
        await (
          actor as ExtendedBackendInterfaceWithSecret
        )._initializeAccessControlWithSecret(adminToken);
      }

      return actor;
    },
    // Only refetch when identity changes
    staleTime: Infinity,
    // This will cause the actor to be recreated when the identity changes
    enabled: true,
  });

  // Track the last principal we invalidated for to prevent infinite loops
  const lastInvalidatedPrincipal = useRef<string | null>(null);

  // When the identity changes, invalidate dependent queries once
  useEffect(() => {
    const currentPrincipal = identity?.getPrincipal().toString() || "anonymous";

    // Only invalidate if the principal actually changed
    if (
      actorQuery.data &&
      lastInvalidatedPrincipal.current !== currentPrincipal
    ) {
      lastInvalidatedPrincipal.current = currentPrincipal;

      // Invalidate all queries except the actor query itself
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        },
      });
    }
  }, [identity, actorQuery.data, queryClient]);

  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching,
  };
}
