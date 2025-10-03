import { PricingPlan } from "./_components/pricing-plan";

const Page = async () => {
  return (
    <div className="flex flex-col bg-muted p-8 min-h-screen">
      <div className="mx-auto w-full max-w-screen-md">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl">Plans & Billing</h1>
          <p>Choose the plan that&apos;s fit for you</p>
        </div>
        <div className="mt-8">
          <PricingPlan />
        </div>
      </div>
    </div>
  );
};

export default Page;
