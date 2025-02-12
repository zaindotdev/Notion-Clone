import Sidebar from "@/components/sidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <main className="min-h-screen w-full grid sm:grid-cols-[1fr,6fr] grid-cols-1">
      <section className="sm:block hidden">
        <Sidebar />
      </section>
      <section>{children}</section>
    </main>
  );
};

export default Layout;
