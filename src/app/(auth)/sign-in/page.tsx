"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, Loader2Icon } from "lucide-react";
import { SignInFormType, signInSchema } from "@/zod/schema";
import Link from "next/link";
import { RiGoogleFill, RiGithubFill } from "@remixicon/react";
import { signIn } from "@/lib/auth";
import { useAuth } from "@/context/authContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<SignInFormType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  // 2. Define a submit handler.
  const onSubmit = async (values: SignInFormType) => {
    setLoading(true);
    try {
      const response = await signIn(values);
      if (response) {
        if ("session" in response) {
          toast({
            title: "Success",
            description: "Signed in successfully",
          });
          if (response.user) {
            router.replace(`/dashboard`);
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to sign in.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="w-full min-h-screen dark:bg-neutral-900 flex items-center justify-between sm:flex-row flex-col p-4">
      <section className="left md:w-1/2 w-full max-w-[200px] sm:max-w-[50%] border-2 border-black rounded-full sm:rounded-none overflow-hidden">
        <Image
          src={"/sign-in.jpg"}
          width={window.innerWidth}
          height={window.innerHeight}
          alt={"sign-in"}
        />
      </section>
      <section className="right md:w-1/2 w-full p-8">
        <div className="md:w-1/2 mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold">Welcome Back! ✨</h1>
            <p>Sign in to your account</p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8  mx-auto"
            >
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="relative w-full">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type={`${showPassword ? "text" : "password"}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[12px] top-1/2 cursor-pointer translate-y-1"
                >
                  {showPassword ? <Eye size={24} /> : <EyeClosed size={24} />}
                </span>
              </div>
              <div className="w-full">
                <Button className="w-full" type="submit">
                  {loading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4">
            <p className="text-sm">
              Don&apos;t have an Account?{" "}
              <span className="hover:underline duration-300">
                <Link href="/sign-up">Sign Up</Link>
              </span>
            </p>
          </div>
          <hr className="border border-black my-4" />
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-semibold">Continue with</h4>
            <div className="flex gap-4">
              <Button className="w-full" variant={"link"}>
                <RiGoogleFill />
                Google
              </Button>
              <Button className="w-full" variant={"outline"}>
                <RiGithubFill /> Github
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignIn;
