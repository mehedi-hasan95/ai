import { WidgetView } from "@/components/home/widget-view";

interface Props {
  searchParams: Promise<{ organizationId: string | null }>;
}

const Page = async ({ searchParams }: Props) => {
  const { organizationId } = await searchParams;
  return <WidgetView organizationId={organizationId} />;
};

export default Page;
