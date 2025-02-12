import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div>
      <Button>
        <Link href={"/dashboard/workspaceId/fileId"}>File</Link>
      </Button>
    </div>
  );
};

export default Sidebar;
