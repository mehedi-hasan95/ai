"use client";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { useMutation, useQuery } from "convex/react";

export default function Page() {
  const users = useQuery(api.users.getUsers);
  const crateUser = useMutation(api.users.createUser);
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <OrganizationSwitcher hidePersonal skipInvitationScreen />
        <Button size="sm" onClick={() => crateUser()}>
          Add User
        </Button>
      </div>
      {JSON.stringify(users, null, 2)}
    </div>
  );
}
