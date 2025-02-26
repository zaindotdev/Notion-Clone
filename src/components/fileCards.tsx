import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import parse from "html-react-parser";
import { FileText } from "lucide-react";
import { Pages } from "@/lib/types/types";

interface FileCardsProps {
  file: Pages;
}

const FileCards: React.FC<FileCardsProps> = ({ file, ...props }) => {
  return (
    <Card {...props} className="w-full max-w-[200px]">
      <CardHeader>
        <CardTitle>{file.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {file.content !== "null" && parse(file.content)}
      </CardContent>
      <CardFooter>
        <p className="text-xs">
          Last Updated At <br /> {new Date(file.updated_at).toDateString()}
        </p>
      </CardFooter>
    </Card>
  );
};

export default FileCards;
