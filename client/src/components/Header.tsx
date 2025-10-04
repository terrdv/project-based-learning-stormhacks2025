import { Code2, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export function Header({ userName, onExit }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Code2 className="size-6 text-primary" />
        <h1 className="text-lg">AI Code Tutor</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {userName && (
          <span className="text-sm text-muted-foreground mr-2">
            Welcome, {userName}
          </span>
        )}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        {onExit && (
          <Button variant="ghost" size="sm" onClick={onExit}>
            <LogOut className="size-4 mr-2" />
            Exit
          </Button>
        )}
      </div>
    </header>
  );
}
