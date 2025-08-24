"use client";
import { useAtomValue } from "jotai";
import { WidgetHeader } from "./widget-header";
import { widgetAtom } from "../attom/widget-attom";

export const WidgetView = () => {
  const screen = useAtomValue(widgetAtom);
  const screenComponents = {
    error: <p>todo:error</p>,
    loading: <p>todo:loading</p>,
    selection: <p>todo:selection</p>,
    voice: <p>todo:voice</p>,
    auth: <WidgetHeader />,
    inbox: <p>todo:inbox</p>,
    chat: <p>todo:chat</p>,
    contact: <p>todo:contact</p>,
  };
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      {screenComponents[screen]}
    </main>
  );
};
