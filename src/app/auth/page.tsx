"use client";

import * as React from "react";

import { cn } from "@/app/lib/utils";
import { Icons } from "@/app/components/icons";
import { Button } from "@/app/components/button";
import { Input } from "@/app/components/input";
import { Label } from "@/app/components/label";
import Image from "next/image";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function UserAuthForm({
  className,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-[#2779c3] p-6",
        className
      )}
      {...props}
    >
      <div className="relative flex flex-col items-center w-full max-w-md">
        <Image
          src="/logo-sos.svg"
          width={400}
          height={400}
          alt="Logo SOS"
          className="absolute -top-8 transform -translate-y-1/3 h-auto"
        />
        <div className="w-full rounded-lg bg-white shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            Welcome Back
          </h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            Please sign in to your account
          </p>
          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
              <Button
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In with Email
              </Button>
            </div>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            className="w-full border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-800"
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.gitHub className="mr-2 h-4 w-4" />
            )}{" "}
            GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}
