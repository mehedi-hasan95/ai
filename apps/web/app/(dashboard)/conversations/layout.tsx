import { ConversationLayout } from "./_components/conversation-layout";

const Page = async ({ children }: { children: React.ReactNode }) => {
  return <ConversationLayout>{children}</ConversationLayout>;
};

export default Page;
