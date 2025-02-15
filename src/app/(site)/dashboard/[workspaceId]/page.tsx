"use client";
import { Pages } from "@/lib/types/types";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getPagesByWorkspaceId } from "@/lib/query";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import FileCards from "@/components/fileCards";

function Workspace() {
  const [pages, setPages] = useState<Pages[]>([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const pages = await getPagesByWorkspaceId(params?.workspaceId as string);
      setPages(pages as unknown as Pages[]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pages:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages, params?.workspaceId]);

  return (
    <main className="w-full min-h-screen dark:bg-zinc-900 bg-zinc-100">
      <section className="container max-w-[800px] h-full mx-auto p-8">
        <h1 className="text-4xl font-bold dark:text-zinc-100 text-zinc-900 text-center tracking-tight">
          Pages
        </h1>
        {loading ? (
          <div>
            <Loader2Icon className="animate-spin duration-500" />
          </div>
        ) : (
          pages.map((page) => (
            <div
              key={page.id}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8"
            >
              <Link
                href={`/dashboard/${params?.workspaceId}/${page.id}`}
                className="block p-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-md shadow-sm"
              >
                <FileCards file={page} />
              </Link>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

export default Workspace;
