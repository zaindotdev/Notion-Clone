"use client";
import Editor from "@/components/Editor/Editor";
import React from "react";

const FilePage = () => {
  return (
    <main className="w-full min-h-screen dark:bg-zinc-900 bg-zinc-100">
      <section className="container max-w-[800px] h-full mx-auto p-8">
        <Editor />
      </section>
    </main>
  );
};

export default FilePage;
