"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { resendEmail } from "@/lib/auth";

function VerifyPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const { toast } = useToast();
  const { setToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = new URL(window.location.href).hash
      .split("=")[1]
      ?.split("&")[0];

    if (token) {
      setToken(token);
      setIsVerified(true);
    } else {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        setIsVerified(true);
      }
    }
  }, [setToken]);

  useEffect(() => {
    if (isVerified) {
      router.push(`/dashboard/workspaceId/fileId`);
    }
  }, [isVerified, router]);

  const handleResend = async () => {
    setLoading(true);
    try {
      const response = await resendEmail();
      if (response) {
        toast({
          title: "Success",
          description: "Verification email has been resent successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error while resending email...",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <Card className="sm:max-w-[500px] max-w-[90%] w-full">
        <CardHeader>
          <CardTitle>
            <h1 className="text-center md:text-4xl text-2xl">
              Verify your Email! 😊
            </h1>
          </CardTitle>
        </CardHeader>
        <Separator />
        {isVerified ? (
          <CardContent className="text-center p-4">
            <CardHeader className="text-xl font-semibold">
              <CardTitle>Your email has been verified!</CardTitle>
            </CardHeader>
            <CardDescription className="mt-2">
              Redirecting you to the dashboard
            </CardDescription>
          </CardContent>
        ) : (
          <div>
            <CardContent className="mt-4">
              <CardDescription>
                A verification email has been sent to your inbox. Please click
                the link to verify your email. If you didn&apos;t receive it,
                check your spam folder or resend the email. For further
                assistance, contact support.
              </CardDescription>
            </CardContent>
            <Separator />
            <CardFooter className="mt-4">
              <Button
                disabled={loading}
                onClick={handleResend}
                className="w-full"
              >
                {loading ? (
                  <LoaderCircle className="animate-spin mr-2" />
                ) : null}
                Resend Email
              </Button>
            </CardFooter>
          </div>
        )}
      </Card>
    </main>
  );
}

export default VerifyPage;
