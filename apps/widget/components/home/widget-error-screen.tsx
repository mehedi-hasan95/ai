import { TriangleAlert } from "lucide-react";
import { WidgetChildrenScreen } from "./widget-children-screen";
import { useAtomValue } from "jotai";
import { errorMessageAtom } from "../attom/widget-attom";

export const WidgetErrorScreen = () => {
  const errorMessage = useAtomValue(errorMessageAtom);
  return (
    <WidgetChildrenScreen>
      <>
        <TriangleAlert className="text-red-500" />
        <p>{errorMessage || "Invalid configuration"}</p>
      </>
    </WidgetChildrenScreen>
  );
};
