import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { useState, useEffect, useMemo } from "react";
import { postFeedback } from "../services/geminiAPI";
import styles from './Sandpack.module.css'
import { supabase } from "@/supabase";


type Feedback = any;

function CodeWatcher({ onFiles }: { onFiles: (files: Record<string, string>) => void }) {
  const { sandpack } = useSandpack();

  useEffect(() => {
    if (!sandpack) return;
    const files: Record<string, string> = {};
    Object.entries(sandpack.files).forEach(([path, file]) => {
      // sandpack file object may vary; grab .code if available
      // @ts-ignore
      files[path] = (file as any).code ?? "";
    });
    onFiles(files);
  }, [sandpack.files]);

  return null;
}

export function CodeEditor({ project, files }: { project: any; files: any }) {
  // This editor no longer performs direct submission. Submissions are handled by the parent (LearningEnvironment) via the "Mark Complete" button.

  const realFiles: Record<string, string> = {};
  files.forEach(({filename, content}: {filename: string; content: string}) => {
    realFiles["/" + filename] = content;
  });

  console.log(files);
  return (
    <div className="flex flex-col h-full">
      <SandpackProvider
        template="static"
        files={realFiles}
        customSetup = {{
            entry: '/templates/index.html',
        }}
        style ={{ resize: "vertical" }}
      >
        <SandpackLayout style={{ height: "100%", minHeight: "350px" }} className={styles.spLayout}>
          <SandpackCodeEditor showTabs showLineNumbers style={{ height: "100%" }} />
          <SandpackPreview style={{ height: "100%" }} />
        </SandpackLayout>

        <div className="p-2 border-t">
          <div className="h-40 overflow-auto border">
            <SandpackConsole style={{ height: "50vh" }} />
          </div>
        </div>

        <CodeWatcher onFiles={async (f) => {
          // avoid setting state if snapshot hasn't changed to prevent repeated re-renders
          try {
            const prev = JSON.stringify(realFiles);
            const next = JSON.stringify(f);
            if (prev !== next) {
                console.log(project.id);
                const newFiles: any = [];
                Object.entries(f).forEach(([path, content]) => {
                    newFiles.push({
                        filename: path.replace('/', ''),
                        content
                    });
                });
                console.log(newFiles);
                await supabase.from('projects').update({
                    files: newFiles
                }).eq('id', project.id);
            }
          } catch (e) {

          }
        }} />
      </SandpackProvider>
    </div>
  );
}
