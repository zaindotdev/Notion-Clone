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

  const [saveStatus, setSaveStatus] = useState("Saving...");
  const [openNode, setOpenNode] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  const debouncedUpdates = useDebounceCallback(
    async ({ editor }: { editor: EditorInstance }) => {
      const json = editor.getJSON();
      setContent(json);
      console.log(json);
      setSaveStatus("Saved");
    },
    500
  );

  const extensions = [...defaultExtensions, slashCommand];

  return (
    <section className="text-white">
      <EditorRoot>
        <EditorContent
          className="h-screen w-full"
          initialContent={content}
          extensions={extensions}
          onUpdate={debouncedUpdates}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px]  w-72 overflow-y-auto rounded-md border border-muted bg-primary px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-primary">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
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
            className="flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-primary shadow-xl"
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
