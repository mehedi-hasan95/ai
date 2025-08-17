"use client";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { AuthLayout } from "./auth-layout";
import { SignInPage } from "./sing-in";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthLoading>
        <AuthLayout>
          <p>Loading...</p>
        </AuthLayout>
      </AuthLoading>
      <Unauthenticated>
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      </Unauthenticated>
      <Authenticated>{children}</Authenticated>
    </>
  );
};
