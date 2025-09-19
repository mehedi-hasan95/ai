"use client";
import { useAtomValue } from "jotai";
import { WidgetAuthForm } from "./widget-auth-form";
import { screenAtom } from "../attom/widget-attom";
import { WidgetErrorScreen } from "./widget-error-screen";
import { WidgetLoadingScreen } from "./widget-loading-screen";
import { WidgetSelectionScreen } from "./widget-selection-screen";
import { WidgetChatScreen } from "./widget-chat-screen";
import { WidgetInboxScreen } from "./widget-inbox-screen";

interface Props {
  organizationId: string | null;
}
export const WidgetView = ({ organizationId }: Props) => {
  const screen = useAtomValue(screenAtom);

  const screenComponents = {
    error: <WidgetErrorScreen />,
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    selection: <WidgetSelectionScreen />,
    voice: <p>todo:voice</p>,
    auth: <WidgetAuthForm />,
    inbox: <WidgetInboxScreen />,
    chat: <WidgetChatScreen />,
    contact: <p>todo:contact</p>,
  };
  return (
    <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden">
      {screenComponents[screen]}
    </main>
  );
};
