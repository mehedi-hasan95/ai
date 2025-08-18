"use client";
import { useVapi } from "@/hooks/use-vapi";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { useMutation, useQuery } from "convex/react";

export default function Page() {
  const {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startCall,
    endCall,
  } = useVapi();
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello from widget</h1>
      </div>
      <div className="flex gap-5">
        <Button onClick={() => startCall()}>Start Call</Button>
        <Button onClick={() => endCall()} variant={"destructive"}>
          End Call
        </Button>
      </div>
      <p>isConnecting: {`${isConnecting}`}</p>
      <p>isConnected: {`${isConnected}`}</p>
      <p>isSpeaking: {`${isSpeaking}`}</p>
      <p>{JSON.stringify(transcript, null, 2)}</p>
    </div>
  );
}
