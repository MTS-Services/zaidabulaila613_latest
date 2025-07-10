// hooks/useSubscriptionFeatures.ts
import { useMemo } from "react";
import type { SubscriptionFeature } from "@/types/subscription";
import { useAuth } from "@/contexts/auth-context";

export function useUserSubscription(): SubscriptionFeature {
  const { user } = useAuth();
  const plan = user?.subscription?.plan
  return useMemo<SubscriptionFeature>(() => {
    switch (plan) {
      case "BASIC":
        return {
          canAddDress: true,
          maxDresses: 5,
          maxMediaPerDress: 5,
          allowedDressTypes: ["used", "rental"],
          canContactSeller: false,
          canBuy: true,
          bulkUpload: false,
          visibility: "basic",
        };
      case "PLATINUM":
        return {
          canAddDress: true,
          maxDresses: 10,
          maxMediaPerDress: 10,
          allowedDressTypes: ["used", "rental"],
          canContactSeller: true,
          canBuy: true,
          bulkUpload: false,
          visibility: "premium",
        };
      case "VENDOR":
        return {
          canAddDress: true,
          maxDresses: 99,
          maxMediaPerDress: "unlimited",
          allowedDressTypes: ["used", "rental", "new"],
          canContactSeller: true,
          canBuy: true,
          bulkUpload: true,
          visibility: "premium",
        };
      default:
        // fallback for type safety
        return {
          canAddDress: false,
          maxDresses: 0,
          maxMediaPerDress: 0,
          allowedDressTypes: [],
          canContactSeller: false,
          canBuy: false,
          bulkUpload: false,
          visibility: "basic",
        };
    }
  }, [plan]);
}
