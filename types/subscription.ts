// types/SubscriptionFeatures.ts
export type DressType = "used" | "rental" | "new";

export interface SubscriptionFeature {
  canAddDress: boolean;
  maxDresses: number;
  maxMediaPerDress: number | "unlimited";
  allowedDressTypes: DressType[];
  canContactSeller: boolean;
  canBuy: boolean;
  bulkUpload: boolean;
  visibility: "basic" | "premium";
}