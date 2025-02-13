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
import { Eye, EyeClosed, LoaderCircle } from "lucide-react";
import { SignUpFormType, signUpSchema } from "@/zod/schema";
import Link from "next/link";
import { RiGoogleFill, RiGithubFill } from "@remixicon/react";
import { signUp } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<SignUpFormType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignUpFormType) => {
    setLoading(true);
    try {
      const response = await signUp(values);

      if (response) {
        toast({
          title: "Success",
          description: "Signed up successfully",
        });
        router.replace(`/verify`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Error while signing up...",
          description: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen dark:bg-neutral-900 flex items-center justify-between sm:flex-row flex-col p-4">
      <section className="left md:w-1/2 w-full max-w-[200px] border-2 border-black rounded-full overflow-hidden">
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
            <h1 className="text-4xl font-bold">New to Notion? 🚀</h1>
            <p>Sign up to your account</p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8  mx-auto"
            >
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? (
                    <LoaderCircle className="animate-spin duration-300" />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4">
            <p className="text-sm">
              Already have an Account?{" "}
              <span className="hover:underline duration-300">
                <Link href="/sign-in">Sign In</Link>
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

export default SignUp;
