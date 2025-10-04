import { useState } from "react";
import { Play, RotateCcw, FileCode } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Editor from "@monaco-editor/react";

export function CodeEditor({
  code,
  language,
  onChange,
  onRun,
  output,
}) {
  const [activeTab, setActiveTab] = useState("code");

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your code?")) {
      onChange("");
    }
  };

  return (
    <div className="h-full bg-card flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode className="size-5 text-primary" />
          <h2>Code Editor</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="size-4 mr-2" />
            Reset
          </Button>
          <Button size="sm" onClick={onRun}>
            <Play className="size-4 mr-2" />
            Run Code
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2 w-fit">
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="flex-1 m-0 p-0">
          <Editor
            height="100%"
            defaultLanguage={language}
            language={language}
            value={code}
            onChange={(value) => onChange(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        </TabsContent>

        <TabsContent value="output" className="flex-1 m-0 p-4 bg-black text-green-400 font-mono overflow-auto">
          {output ? (
            <pre className="text-sm whitespace-pre-wrap">{output}</pre>
          ) : (
            <p className="text-muted-foreground">
              Click "Run Code" to see the output here.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
