import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import parse from "html-react-parser";
import { FileText } from "lucide-react";

interface FileCardsProps {
  file: any;
}

const FileCards: React.FC<FileCardsProps> = ({ file, ...props }) => {
  return (
    <Card
      {...props}
      className="w-full bg-white/10 dark:bg-zinc-800/70 shadow-xl border-none backdrop-filter dark:text-zinc-100 text-zinc-900 backdrop-blur-xl relative hover:bg-white/15 dark:hover:bg-zinc-800/50"
    >
      <CardHeader>
        <CardTitle>{file.title}</CardTitle>
      </CardHeader>
      <CardContent className="prose p-4">
        {JSON.parse(file.content)}
      </CardContent>
      <Separator />
      <FileText className="absolute top-2 right-2" />
      <CardFooter className="p-2">
        <p className="text-xs">
          Last Updated: {new Date(file.updated_at).toDateString()}
        </p>
      </CardFooter>
    </Card>
  );
};

export default FileCards;
