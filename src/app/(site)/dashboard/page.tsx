"use client";
import Link from "next/link";
import FileCards from "@/components/fileCards";
import { useAuth } from "@/context/authContext";
import { useTime } from "@/hooks/useTime";
import React, { useCallback, useEffect, useState } from "react";
import { Loader2, ShapesIcon } from "lucide-react";
import { Pages } from "@/lib/types/types";
import { useToast } from "@/hooks/use-toast";
import { getPages, getPagesByWorkspaceId } from "@/lib/query";

const Dashboard = () => {
  const time = useTime();
  const { toast } = useToast();
  const { user } = useAuth();

  const [pages, setPages] = useState<Pages[] | null>(null);

  const fetchAllPages = useCallback(async () => {
    try {
      const page = await getPages();
      if (page) {
        console.log(page);
        setPages(page as unknown as Pages[]);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Got some issues while fetching pages",
          description: error.message && "",
          variant: "destructive",
        });
      }
    }
  }, []);

  useEffect(() => {
    fetchAllPages();
  }, [fetchAllPages]);
  return (
    <main className="w-full min-h-screen dark:bg-zinc-900 bg-zinc-100">
      <section className="container mx-auto p-8 ">
        <h1 className="text-4xl font-bold dark:text-zinc-100 text-zinc-900 text-center tracking-tight">
          {time},{" "}
          <span className="font-black font-gray-900 text-5xl">
            {(user?.identities && user?.identities[0]?.identity_data?.name) ??
              "User"}
          </span>
        </h1>
        <section className="mt-8">
          {/* recent files in the workspace*/}
          <div className="grid grid-cols-2">
            {pages ? (
              pages?.map((file) => (
                <Link
                  key={file.id}
                  href={`/dashboard/${file.workspace_id}/${file.id}`}
                >
                  <div className="cursor-pointer">
                    <FileCards file={file} />
                  </div>
                </Link>
              ))
            ) : (
              <div className="w-full flex items-center justify-center">
                <Loader2 className="animate-spin w-[1.2rem] h-[1.2rem]" />
              </div>
            )}
          </div>

          {/* Browse Templates */}
          <div className="sm:w-96 w-full p-4 mt-8 dark:bg-white/10 bg-black/10 border-none dark:text-white text-black backdrop-blur-xl rounded-xl flex items-center justify-start gap-4 cursor-pointer">
            <ShapesIcon className="w-8 h-8" />
            <h2>Browse Template</h2>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
