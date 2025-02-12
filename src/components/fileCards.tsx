import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

interface FileCardsProps {
  file: any;
}

const FileCards: React.FC<FileCardsProps> = ({ file }) => {
  return (
    <Card>
      <CardContent>{file.content}</CardContent>
      <Separator />
      <CardHeader>
        <CardTitle>{file.name}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default FileCards;
