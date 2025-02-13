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
      className="w-full bg-white/10 shadow-xl border-none text-white backdrop-blur-xl relative"
    >
      <CardHeader>
        <CardTitle>{file.name}</CardTitle>
      </CardHeader>
      <CardContent className="prose p-4">{parse(file.content)}</CardContent>
      <Separator />
      <FileText className="absolute top-2 right-2" />
      <CardFooter className="p-2">
        <p className="text-sm ">{file.updatedAt.toDateString()}</p>
      </CardFooter>
    </Card>
  );
};

export default FileCards;
