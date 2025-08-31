"use client";
import { Loader } from "lucide-react";
import { WidgetChildrenScreen } from "./widget-children-screen";
import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "../attom/widget-attom";
import { useAction, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type InitStep = "org" | "session" | "settings" | "vapi" | "done";
export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const [step, setStep] = useState<InitStep>("org");
  const [sessionValid, setSessionValid] = useState(false);
  console.log(sessionValid);
  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const setScreen = useSetAtom(screenAtom);
  const contactSessionId = useAtomValue(
    contactSessionAtomFamily(organizationId || "")
  );

  const validateOrganization = useAction(api.public.organizations.validate);

  useEffect(() => {
    if (step !== "org") {
      return;
    }
    setLoadingMessage("Finding organization id...");
    if (!organizationId) {
      setErrorMessage("Organization id is required");
      setScreen("error");
      return;
    }
    setLoadingMessage("Verifing organization id...");

    validateOrganization({ organizationId })
      .then((result) => {
        if (result.valid) {
          setOrganizationId(organizationId);
          setStep("session");
        } else {
          setErrorMessage(result.reason || "Invalid configuration");
          setScreen("error");
        }
      })
      .catch(() => {
        setErrorMessage("Unable to verify organization");
        setScreen("error");
      });
  }, [
    step,
    organizationId,
    setErrorMessage,
    setScreen,
    setOrganizationId,
    setStep,
    validateOrganization,
    setLoadingMessage,
  ]);

  // session step
  const validateConcactSession = useMutation(
    api.public.contactSessions.validate
  );

  useEffect(() => {
    if (step !== "session") {
      return;
    }
    setLoadingMessage("Finding session id...");
    if (!contactSessionId) {
      setSessionValid(false);
      setStep("done");
      return;
    }
    setLoadingMessage("Validating session...");

    validateConcactSession({ contactSessionId })
      .then((result) => {
        setSessionValid(result.valid);
        setStep("done");
      })
      .catch(() => {
        setSessionValid(false);
        setStep("done");
      });
  }, [
    step,
    contactSessionId,
    validateConcactSession,
    setLoadingMessage,
    setSessionValid,
  ]);

  useEffect(() => {
    if (step !== "done") {
      return;
    }
    const hasValidSessionId = contactSessionId && sessionValid;
    setScreen(hasValidSessionId ? "selection" : "auth");
  }, [step, contactSessionId, sessionValid, setScreen]);
  return (
    <WidgetChildrenScreen>
      <Loader className="animate-spin" />
      <p>{loadingMessage || "Loading..."}</p>
      {organizationId}
    </WidgetChildrenScreen>
  );
};
