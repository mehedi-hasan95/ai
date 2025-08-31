"use client";
import { useAtomValue } from "jotai";
import { WidgetAuthForm } from "./widget-auth-form";
import { screenAtom } from "../attom/widget-attom";
import { WidgetErrorScreen } from "./widget-error-screen";
import { WidgetLoadingScreen } from "./widget-loading-screen";

interface Props {
  organizationId: string | null;
}
export const WidgetView = ({ organizationId }: Props) => {
  const screen = useAtomValue(screenAtom);

  const screenComponents = {
    error: <WidgetErrorScreen />,
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    selection: <p>todo:selection</p>,
    voice: <p>todo:voice</p>,
    auth: <WidgetAuthForm />,
    inbox: <p>todo:inbox</p>,
    chat: <p>todo:chat</p>,
    contact: <p>todo:contact</p>,
  };
  return (
    <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden">
      {screenComponents[screen]}
      {organizationId}
    </main>
  );
};
