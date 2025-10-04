import { Bot, User, Send, Sparkles } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState, useRef, useEffect } from "react";

export function AIAssistant({ messages, onSendMessage }) {
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

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

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
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
            className="min-h-[60px] resize-none"
          />
          <Button onClick={handleSend} size="icon" className="h-[60px] w-[60px]">
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
