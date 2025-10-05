import { Bot, User, Send, Sparkles } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState, useRef, useEffect } from "react";
import { postFeedback } from "../services/geminiAPI";

export function AIAssistant({ project, userId }: { project: any; userId: string }) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = project.messages || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * 
   *   const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: `Welcome to your HTML & CSS learning journey, ${
        userName || "there"
      }! 👋`,
    },
  ]);
  // keep a stable id counter for messages so ids don't depend on array length
  const messageIdRef = useRef<number>(2);


   * 
   */

    const handleSendMessage = (userMessage: string) => {
      const userMsg = {
        id: messages.length + 1,
        role: "user",
        content: userMessage,
      };
  
      const aiMsg = {
        id: messages.length + 2,
        role: "assistant",
        content: "",
      };
  
      setMessages([...messages, userMsg, aiMsg]);
    };
  
    // Submit code to Gemini and append response to the assistant chat
  //   const submitCodeToGemini = async () => {
  //     console.log("submit");
  //     const code = Object.entries(editorFiles)
  //       .map(([filename, content]) => `// File: ${filename}\n${content}`)
  //       .join("\n\n");
  //     const interimMsg = {
  //       id: messageIdRef.current++,
  //       role: "assistant",
  //       content: "Checking your code with Gemini...",
  //     };
  //     setMessages((m) => [...m, interimMsg]);
  //     try {
  //       const resp = await postFeedback(
  //         code,
  //         `Feedback for step ${steps[currentStep - 1].instruction}`
  //       );
  //       const content =
  //         typeof resp === "object" ? JSON.stringify(resp, null, 2) : String(resp);
  //       console.log(content);
  //       setMessages((m) => [
  //         ...m.slice(0, -1),
  //         {
  //           id: messageIdRef.current++,
  //           role: "assistant",
  //           content: JSON.parse(content).feedback,
  //         },
  //       ]);
  //       return JSON.parse(content).pass;
  //     } catch (err) {
  //       setMessages((m) => [
  //         ...m.slice(0, -1),
  //         {
  //           id: messageIdRef.current++,
  //           role: "assistant",
  //           content: `Error getting feedback: ${String(err)}`,
  //         },
  //       ]);
  //     }
  //   };

  /**
   *       const successMsg = {
        id: messageIdRef.current++,
        role: "assistant",
        content: `🎉 Excellent work! You've completed Step ${currentStep}: ${
          currentStepData?.title
        }
        

${
  hasNext
    ? `Up next: **Step ${nextStepId}${
        nextStepData?.title ? ` — ${nextStepData.title}` : ""
      }**. Click it when you're ready, and I'll guide you through what to do and why it matters.`
    : "Congratulations! You've completed all the steps in this project. You've learned the fundamentals of HTML and CSS! 🎊"
}`,
      };
      setMessages((m) => [...m, successMsg]);

      const tryAgainMsg = {
        id: messageIdRef.current++,
        role: "assistant",
        content: `🛠️ Not quite there yet on Step ${currentStep}: ${currentStepData?.title}.
No worries — this is part of learning!

Tips to try:**
- Re-read the step instructions and compare carefully with your code.
- Check for small syntax issues (missing closing tags, typos, class names).
- If you changed CSS, ensure the selector matches the HTML.

When you're ready, run your code again and hit **Submit** to re-check.`,
      };
      setMessages((m) => [...m, tryAgainMsg]);
   * 
   */

  return (
    <div className="h-full bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <h2>AI Instructor</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Step-by-step coding guidance
        </p>
      </div>

      <ScrollArea className="flex-1 p-4 max-h-full overflow-scroll" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : ""
              }`}
            >
              {message.role === "assistant" && (
                <div className="size-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="size-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.role === "assistant"
                    ? "bg-secondary"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="size-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <User className="size-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question or request help..."
            className="h-[60px] resize-none"
          />
          <Button onClick={handleSend} size="icon" className="h-[60px] w-[60px]">
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
