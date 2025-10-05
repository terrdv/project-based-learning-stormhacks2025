import { Code2, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export function Header() {
  const [isDark, setIsDark] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        if (!mounted || !user) return
        const meta: any = user.user_metadata ?? {}
        setUserName(meta.full_name || user.email || '')
      } catch (e) {
        // ignore
      }
  })()
    return () => { mounted = false }
  }, [])

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between p-4">
      <Button variant={"ghost"} className="flex items-center gap-3" onClick={() => navigate('/')}>
        <Code2 className="size-6 text-primary" />
        <h1 className="text-lg">AI Code Tutor</h1>
      </Button>
      
      <div className="flex items-center gap-2">
        {userName ? (
          <span className="text-sm text-muted-foreground mr-2">
            Welcome, {userName}
          </span>
        ) : (
            <Button variant="ghost" onClick={() => navigate('/signin')}>Sign In</Button>
        )}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>
    </header>
  );
}
