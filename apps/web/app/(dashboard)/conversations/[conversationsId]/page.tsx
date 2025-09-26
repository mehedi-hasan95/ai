import { Id } from "@workspace/backend/_generated/dataModel";
import { ConversationsIdViews } from "../_components/conversations-id-view";

interface Props {
  params: Promise<{ conversationsId: string }>;
}
const Page = async ({ params }: Props) => {
  const { conversationsId } = await params;
  return (
    <ConversationsIdViews
      conversationsId={conversationsId as Id<"conversation">}
    />
  );
};

export default Page;
