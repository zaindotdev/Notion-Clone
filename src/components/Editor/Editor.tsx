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
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { NodeSelector } from "./node-selector";
import { LinkSelector } from "./link-selector";
import { ColorSelector } from "./color-selector";
import { TextButtons } from "./text-buttons";
import { Badge } from "../ui/badge";

const Editor = () => {
  const [content, setContent] = useState<JSONContent>({
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
  });

  const [saveStatus, setSaveStatus] = useState("Saved");
  const [openNode, setOpenNode] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  const debouncedUpdates = useDebounceCallback(
    async ({ editor }: { editor: EditorInstance }) => {
      const json = editor.getJSON();
      setContent(json);
      console.log(json);
      setSaveStatus("Saving...");
    },
    500
  );

  const extensions = [...defaultExtensions, slashCommand];

  return (
    <section className="relative bg-white dark:bg-zinc-900 p-4 text-black dark:text-white">
      <div className="flex overflow-hidden mb-8">
        {saveStatus && (
          <Badge className="bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white border border-zinc-300 dark:border-zinc-700">
            {saveStatus}
          </Badge>
        )}
      </div>
      <EditorRoot>
        <EditorContent
          className="h-screen w-full bg-white dark:bg-zinc-900 text-black dark:text-white"
          initialContent={content}
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
    </section>
  );
};
export default Editor;
