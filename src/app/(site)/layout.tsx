"use client";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import FileStateProvider from "../../context/fileStateProvider";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <main>
      <FileStateProvider>
        <SidebarProvider>
          <SidebarTrigger />
          <AppSidebar />
          {children}
        </SidebarProvider>
      </FileStateProvider>
    </main>
  );
};

export default Layout;
