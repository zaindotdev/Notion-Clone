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
import { Eye, EyeClosed } from "lucide-react";
import { SignInFormType, signInSchema } from "@/zod/schema";
import Link from "next/link";
import { RiGoogleFill, RiGithubFill } from "@remixicon/react";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const form = useForm<SignInFormType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: SignInFormType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <main className="w-full min-h-screen dark:bg-neutral-900 md:flex items-center justify-between">
      <section className="left w-1/2">
        <Image
          src={"/sign-in.jpg"}
          width={window.innerWidth / 2}
          height={window.innerHeight}
          alt={"sign-in"}
        />
      </section>
      <section className="right w-1/2">
        <div className="w-1/2 mx-auto">
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
              <Button type="submit">Sign In</Button>
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
