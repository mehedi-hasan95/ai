"use client";
import { PricingTable } from "@clerk/nextjs";
export const PricingPlan = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <PricingTable forOrganizations />
    </div>
  );
};
