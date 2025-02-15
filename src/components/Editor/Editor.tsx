"use client";
import { slashCommand, suggestionItems } from "./createSuggestionItems";
import { defaultExtensions } from "./extensions";
import {
  EditorContent,
  EditorRoot,
  EditorInstance,
  EditorCommandEmpty,
  EditorCommand,
  EditorCommandList,
  EditorCommandItem,
  JSONContent,
  EditorBubble,
} from "novel";
import { useCallback, useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { NodeSelector } from "./node-selector";
import { LinkSelector } from "./link-selector";
import { ColorSelector } from "./color-selector";
import { TextButtons } from "./text-buttons";
import { Badge } from "../ui/badge";
import { getPageById, updatePage } from "@/lib/query";
import { useParams } from "next/navigation";
import { Input } from "../ui/input";
import { useFileState } from "@/context/fileStateProvider";
import { Loader2Icon } from "lucide-react";

const Editor = () => {
  const params = useParams();
  const { title, setTitle } = useFileState();
  const [content, setContent] = useState<JSONContent | null>(null);
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [openNode, setOpenNode] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  const debouncedUpdates = useDebounceCallback(
    async ({ editor }: { editor: EditorInstance }) => {
      const json = editor.getJSON();
      if (!json.content || json.content.length === 0) return; // Prevent updating empty content

      setContent(json);
      setSaveStatus("Saving...");
      if (params?.fileId) {
        await updatePage(params.fileId as string, title, JSON.stringify(json));
      }
      setSaveStatus("Saved");
    },
    500
  );

  useEffect(() => {
    const fetchPage = async () => {
      if (!params?.fileId) return;

      try {
        const response = await getPageById(params.fileId as string);

        if (response) {
          const parsedContent = JSON.parse(response.content);
          setContent(parsedContent);
          setTitle(response.title);
        }
      } catch (error) {
        console.error("Error fetching page:", error);
      } finally {
        setLoading(false); // ✅ Stop loading when data is fetched
      }
    };

    fetchPage();
  }, [params.fileId, setTitle]);

  useEffect(() => {
    if (title.trim() !== "" && params?.fileId) {
      setSaveStatus("Saving...");
      updatePage(params?.fileId as string, title, JSON.stringify(content))
        .then(() => setSaveStatus("Saved"))
        .catch((error) => console.error("Failed to update page:", error));
    }
  }, [title, content]);

  const extensions = [...defaultExtensions, slashCommand];

  return (
    <section className="relative bg-white dark:bg-zinc-900 p-4 text-black dark:text-white">
      {/* Show loading message */}
      {loading ? (
        <div className="text-gray-500 dark:text-gray-400 flex items-center justify-center">
          <Loader2Icon className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex overflow-hidden mb-8">
            {saveStatus && (
              <Badge className="bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white border border-zinc-300 dark:border-zinc-700">
                {saveStatus}
              </Badge>
            )}
          </div>
          <div className="mb-4">
            <textarea
              className="border-none outline-none ring-0 text-6xl font-bold bg-inherit resize-none text-zinc-900 dark:text-zinc-100"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
            />
          </div>
          <EditorRoot>
            <EditorContent
              key={content ? JSON.stringify(content) : "default"}
              className="h-screen w-full bg-white dark:bg-zinc-900 text-black dark:text-white"
              initialContent={
                content ?? {
                  type: "doc",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "Type here or use '/' for more commands",
                        },
                      ],
                    },
                  ],
                }
              }
              extensions={extensions}
              onUpdate={debouncedUpdates}
            >
              <EditorCommand className="border p-2 flex flex-col gap-2 items-center rounded-xl overflow-y-auto max-h-80">
                <EditorCommandEmpty className="px-2 text-zinc-500 dark:text-zinc-400">
                  No results
                </EditorCommandEmpty>
                <EditorCommandList>
                  {suggestionItems.map((item) => (
                    <EditorCommandItem
                      value={item.title}
                      onCommand={(val) => item.command?.(val)}
                      className="flex  items-center justify-start gap-2 px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                      key={item.title}
                    >
                      <div className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.1)] ">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-medium text-black dark:text-white">
                          {item.title}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {item.description}
                        </p>
                      </div>
                    </EditorCommandItem>
                  ))}
                </EditorCommandList>
              </EditorCommand>
              <EditorBubble
                tippyOptions={{
                  placement: openAI ? "bottom-start" : "top",
                }}
                className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-xl text-black dark:text-white"
              >
                <NodeSelector open={openNode} onOpenChange={setOpenNode} />
                <LinkSelector open={openLink} onOpenChange={setOpenLink} />
                <TextButtons />
                <ColorSelector open={openColor} onOpenChange={setOpenColor} />
              </EditorBubble>
            </EditorContent>
          </EditorRoot>
        </>
      )}
    </section>
  );
};

export default Editor;
