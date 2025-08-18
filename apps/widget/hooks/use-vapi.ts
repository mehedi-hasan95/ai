import Vapi from "@vapi-ai/web";
import { useState, useEffect } from "react";

interface transcriptMessage {
  role: "user" | "assistant";
  text: string;
}

export const useVapi = () => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<transcriptMessage[]>([]);

  useEffect(() => {
    const vapiInstance = new Vapi("d3f2a3bb-160b-4665-bbdf-bd6d24ceacf8");
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
      (setIsConnecting(false), setIsConnected(true), setTranscript([]));
    });
    vapiInstance.on("call-end", () => {
      (setIsConnected(false), setIsConnecting(false), setIsSpeaking(false));
    });
    vapiInstance.on("speech-start", () => {
      setIsSpeaking(true);
    });
    vapiInstance.on("speech-end", () => {
      setIsSpeaking(false);
    });
    vapiInstance.on("error", (error) => {
      console.log(error, "VAPI_ERROR");
      setIsConnecting(false);
    });
    vapiInstance.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscript((prev) => [
          ...prev,
          {
            role: message.role === "user" ? "user" : "assistant",
            text: message.transcript,
          },
        ]);
      }
    });
    return () => {
      vapiInstance?.stop();
    };
  }, []);
  const startCall = () => {
    setIsConnecting(true);
    if (vapi) {
      vapi.start("897baa88-2670-48f1-ab1f-7eaaa9d3f8ee");
    }
  };
  const endCall = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startCall,
    endCall,
  };
};
