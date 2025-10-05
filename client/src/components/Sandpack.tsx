import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
          <SandpackConsole
              style={{ height: "50vh" }}
              resetOnPreviewRestart={true}
              showSyntaxError={false}
            />

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

export function CodeEditor({ onFiles }: { onFiles?: (files: Record<string, string>) => void }) {
  const [filesSnapshot, setFilesSnapshot] = useState<Record<string, string>>({});
  // This editor no longer performs direct submission. Submissions are handled by the parent (LearningEnvironment) via the "Mark Complete" button.

  return (
    <div className="flex flex-col h-full">
      <SandpackProvider
        template="react"
        files={useMemo(() => ({
          '/App.js': `export default function App() {\n            return <h1>Interactive Sandpack!</h1>;\n          }`,
          '/Main.js': `export default function Main() {\n            return <h2>hello world</h2>;\n          }`,
        }), [])}
        style ={{ resize: "vertical" }}
      >
        <SandpackLayout style={{ height: "100%", minHeight: "300px" }} className={styles.spLayout}>
          <SandpackCodeEditor showTabs showLineNumbers style={{ height: "100%" }} />
          <SandpackPreview style={{ height: "100%" }} />
        </SandpackLayout>

        <div className="p-2 border-t">
          <div className="h-40 overflow-auto border">
            <SandpackConsole style={{ height: "50vh" }} />
          </div>
        </div>

        <CodeWatcher onFiles={(f) => {
          // avoid setting state if snapshot hasn't changed to prevent repeated re-renders
          try {
            const prev = JSON.stringify(filesSnapshot);
            const next = JSON.stringify(f);
            if (prev !== next) setFilesSnapshot(f);
          } catch (e) {
            setFilesSnapshot(f);
          }
          if (onFiles) onFiles(f);
        }} />
      </SandpackProvider>
    </div>
  );
}

// import {
//   RunIcon,
//   SandpackCodeEditor,
//   SandpackConsole,
//   SandpackFileExplorer,
//   SandpackLayout,
//   SandpackPreview,
//   SandpackProvider,
//   SandpackTests,
//   useSandpack,
//   useSandpackNavigation
// } from "@codesandbox/sandpack-react";
// // import { Spec } from "@codesandbox/sandpack-react/dist/types/components/Tests/Specs";
// // import { nightOwl } from "@codesandbox/sandpack-themes";
// import { useState } from "react";

// const Toggle = () => {
//   const [val, setVal] = useState("test");
//   return (
//     <div>
//       <button
//         onClick={() => setVal("test")}
//         style={{
//           width: "80px",
//           marginRight: "10px",
//           backgroundColor: "green"
//         }}
//       >
//         1
//       </button>
//       <button
//         onClick={() => setVal("console")}
//         style={{
//           width: "80px",
//           marginLeft: "10px",
//           backgroundColor: "green"
//         }}
//       >
//         2
//       </button>
//     </div>
//   );
// };

// export const CodeEditor = () => {
//   const files = {};

//   return (
//     <div>
//       <SandpackProvider
//         files={files}
//         // theme={nightOwl}
//         template="vanilla"
//         options={{ autorun: true, recompileMode: "immediate" }}
//         style={{ height: "100%"}}
//       >
//         <SandpackLayout
//           style={{ display: "grid", gridTemplateColumns: "repeat(1,1fr)" }}
//         >
//           <div style={{ display: "flex", flexDirection: "row" }}>
//             <SandpackCodeEditor
//               style={{ height: "50vh" }}
//               showTabs={false}
//               showRunButton
//             ></SandpackCodeEditor>
//             <SandpackPreview style={{ height: "50vh" }} />
//           </div>

//           {/* <Toggle /> */}

//           <SandpackConsole
//               style={{ height: "50vh" }}
//               resetOnPreviewRestart={true}
//               showSyntaxError={false}
//               showHeader={true}
//             />
//         </SandpackLayout>
//       </SandpackProvider>
//     </div>
//   );
// };
