'use client'
import React from "react";

interface FileStateContext {
  title: string;
  setTitle: (title: string) => void;
}

const FileContext = React.createContext<FileStateContext>({
  title: "",
  setTitle: () => {},
} as FileStateContext);

export const useFileState = () => React.useContext(FileContext);
const FileStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [title, setTitle] = React.useState<string>("");

  return (
    <FileContext.Provider value={{ title, setTitle }}>
      {children}
    </FileContext.Provider>
  );
};

export default FileStateProvider;
