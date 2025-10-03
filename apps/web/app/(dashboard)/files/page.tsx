"use client";

import { Protect } from "@clerk/nextjs";
import { PremiumFeaturesOverlay } from "@/components/premium-features/page";
import { FilesView } from "./_components/files-view";

const Page = () => {
  return (
    <Protect
      condition={(has) => has({ plan: "pro" })}
      fallback={
        <PremiumFeaturesOverlay>
          <FilesView />
        </PremiumFeaturesOverlay>
      }
    >
      <FilesView />
    </Protect>
  );
};

export default Page;
