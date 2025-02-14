"use client";
import Link from "next/link";
import FileCards from "@/components/fileCards";
import { useAuth } from "@/context/authContext";
import { useTime } from "@/hooks/useTime";
import React from "react";
import { ShapesIcon } from "lucide-react";

const Dashboard = () => {
  const time = useTime();
  const { user } = useAuth();
  const dummyFiles = [
    {
      id: "1",
      name: "File 1",
      content: "<h1 class='text-5xl font-black'>Hello World</h1>",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "File 1",
      content: "<h1 class='text-5xl font-black'>Hello World</h1>",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      name: "File 1",
      content: "<h1 class='text-5xl font-black'>Hello World</h1>",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  return (
    <main className="w-full min-h-screen dark:bg-zinc-900 bg-zinc-100">
      <section className="container mx-auto p-8 ">
        <h1 className="text-4xl font-bold dark:text-zinc-100 text-zinc-900 text-center tracking-tight">
          {time},{" "}
          <span className="font-black font-gray-900 text-5xl">
            {(user.identities && user?.identities[0]?.identity_data?.name) ||
              "User"}
          </span>
        </h1>
        <section className="mt-8">
          {/* recent files in the workspace*/}
          <div className="grid sm:grid-cols-4 grid-cols-2 gap-4">
            {dummyFiles.map((file) => (
              <Link key={file.id} href={`/dashboard/workspaceId/${file.id}`}>
                <div className="cursor-pointer">
                  <FileCards file={file} />
                </div>
              </Link>
            ))}
          </div>

          {/* Browse Templates */}
          <div className="sm:w-96 w-full p-4 mt-8 bg-white/10 border-none text-white backdrop-blur-xl rounded-xl flex items-center justify-start gap-4 cursor-pointer">
            <ShapesIcon className="w-8 h-8" />
            <h2>Browse Template</h2>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
