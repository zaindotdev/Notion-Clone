"use client";
import FileCards from "@/components/fileCards";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { useTime } from "@/hooks/useTime";
import React from "react";

const Dashboard = () => {
  const time = useTime();
  const { user } = useAuth();
  const dummyFiles = [
    {
      id: "1",
      name: "File 1",
      content: "<h1>Hello World</h1>",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "File 1",
      content: "<h1>Hello World</h1>",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      name: "File 1",
      content: "<h1>Hello World</h1>",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  return (
    <main className="h-screen w-full">
      <section className="container mx-auto p-8 bg-gray-700">
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          {time},{" "}
          <span className="font-black font-gray-900">
            {(user.identities && user?.identities[0]?.identity_data?.name) ||
              "User"}
          </span>
        </h1>
        <section className="mt-8">
          {/* recent files in the workspace*/}
          <div className="grid sm:grid-cols-4 grid-cols-2 gap-4">
            {dummyFiles.map((file) => (
              <div key={file.id}>
                <FileCards file={file} />
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
