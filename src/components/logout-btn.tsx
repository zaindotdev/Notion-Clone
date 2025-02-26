import React, { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";
import { Loader2Icon, LogOut } from "lucide-react";

const LogoutBtn = () => {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await signOut();
      if (res) {
        router.push("/sign-in");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      type="button"
      size="icon"
      variant={"default"}
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? (
        <>
          <Loader2Icon className="h-[1.2rem] w-[1.2rem]" />
        </>
      ) : (
        <>
          <LogOut className="h-[1.2rem] w-[1.2rem]" />
        </>
      )}
    </Button>
  );
};

export default LogoutBtn;
