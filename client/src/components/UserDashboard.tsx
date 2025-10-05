import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Header } from "./Header";
import { 
  BookOpen, 
  Code, 
  CheckCircle,
  
  ChevronDown, 
  ChevronRight, 
  Play,
  Bookmark,
  Star,
  TrendingUp,
  Users,
  Zap,
  Sparkles,
  Plus
} from "lucide-react";
import { supabase } from '../supabase';

export function UserDashboard() {
  const navigate = useNavigate();
  // Local reactive variables replacing props
  const [userName, setUserName] = useState<string>('user');
  // track whether we've finished checking auth so we don't flash the dashboard
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [project, setProject] = useState<any>(null);
  const [savedProjects, setSavedProjects] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        if (!mounted) return;
        if (!user) {
          navigate('/signin');
          setIsCheckingAuth(false);
          return;
        }
        const id = user.id;
        const meta: any = user.user_metadata ?? {};
        setUserName(meta.full_name || 'user');
        setIsCheckingAuth(false);
        const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", id)
        .order("last_saved", { ascending: false });
        if (projects && projects.length > 0) {
          setProject(projects[0]);
          setSavedProjects(projects.slice(1));
        } else {
          setProject(null);
          setSavedProjects([]);
        }
      } catch (e) {
        // ignore
        setIsCheckingAuth(false);
      }
    })();
    return () => { mounted = false };
  }, [navigate]);

  const onContinueLearning = () => {
    // navigate to learning environment
    navigate('/editor');
  };

  const onStartProject = (projectId: string) => {
    // route to learning with project state
    navigate('/editor', { state: { projectId } });
  };
    
  const [savedProjectsOpen, setSavedProjectsOpen] = useState(false);

  // (no local mock project — we'll display DB project or a "No project available" message)

  // savedProjects state will be populated from the database

  // Mock project recommendations
  const recommendations = [
    {
      id: "node-basics",
      title: "Node.js Fundamentals",
      description: "Server-side JavaScript development",
      difficulty: "Intermediate",
      duration: "4-6 hours",
      rating: 4.8,
      students: 12500,
      trending: true
    },
    {
      id: "typescript-intro",
      title: "TypeScript for Beginners",
      description: "Add type safety to your JavaScript",
      difficulty: "Beginner",
      duration: "3-4 hours",
      rating: 4.9,
      students: 8900,
      trending: false
    },
    {
      id: "api-development",
      title: "REST API Development",
      description: "Build and consume REST APIs",
      difficulty: "Advanced",
      duration: "6-8 hours",
      rating: 4.7,
      students: 6700,
      trending: true
    },
    {
      id: "database-design",
      title: "Database Design Principles",
      description: "Learn database modeling and optimization",
      difficulty: "Intermediate",
      duration: "5-7 hours",
      rating: 4.6,
      students: 4200,
      trending: false
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  let onCreateProject = () => {
    // navigate to project creation page
    navigate('/create');
  };

  // don't render the dashboard until we've confirmed auth status
  if (isCheckingAuth) return null;

  const completedSteps = Math.max(0, (project?.progress || 0) - 1);
  const totalSteps = project?.steps?.length || 0;
  const percent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
        <Header />
      <main className="container max-w-[1024px] mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl  font-bold mb-2 flex left">Welcome back, {userName}!</h1>
            <p className="text-muted-foreground">Continue your coding journey and explore new projects.</p>
          </div>
          <Button onClick={onCreateProject} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create New Project
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>

        {/* Current Project - Expanded */}
        <section className="mb-8">
          <h2 className="mb-4 flex left">Current Project</h2>
          {project ? (
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex left mb-3">
                      {/* <BookOpen className="h-5 w-5" /> */}
                      {project.title}
                    </CardTitle>
                    <div className="flex left">
                    <CardDescription className="flex left">{project.description}</CardDescription>
                    </div>
                  </div>
                  <Button onClick={onContinueLearning} className="shrink-0">
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex left mb-2">Overall Progress</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{percent}%</span>
                        <span className="text-xs text-muted-foreground">{completedSteps}/{totalSteps} steps</span>
                      </div>
                      <Progress value={percent} className="h-2" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className={`flex text-left`}>Learning Steps</h4>
                  <div className="space-y-2">
                    {project.steps.map((step: any, idx: number) => {
                      const stepNumber = idx + 1;
                      const isCompleted = (project.progress || 0) > stepNumber;
                      const isCurrent = (project.progress || 0) === stepNumber;
                      return (
                        <div
                          key={step.id}
                          className={`flex text-left items-center gap-3 p-3 rounded-lg border ${
                            isCurrent ? 'border-primary bg-primary/5' : 'border-border bg-card'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : isCurrent
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {isCompleted ? <CheckCircle className="w-3 h-3" /> : stepNumber}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${isCurrent ? 'text-primary' : ''}`}>
                              {step.title}
                            </p>
                            {isCurrent && (
                              <p className="text-xs text-muted-foreground">Currently learning</p>
                            )}
                          </div>
                          {isCurrent && (
                            <Badge variant="outline" className="text-xs">
                              In Progress
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border">
              <CardContent className="py-8 px-6 text-center">
                <p className="text-sm text-muted-foreground">No project available. Create a project to get started.</p>
                <div className="mt-4">
                  <Button onClick={onCreateProject} className="">
                    Create Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Saved Projects - Collapsed */}
        <section className="mb-8">
          <Collapsible open={savedProjectsOpen} onOpenChange={setSavedProjectsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-auto mb-4">
                <h2>Your Saved Projects ({savedProjects.length})</h2>
                {savedProjectsOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedProjects.map((p) => {
                  const completed = Math.max(0, (p.progress || 0) - 1);
                  const total = p.steps?.length || p.totalSteps || 0;
                  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                  return (
                    <Card key={p.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{p.title}</CardTitle>
                          <Bookmark className="h-4 w-4 text-muted-foreground shrink-0" />
                        </div>
                        <CardDescription className="text-sm">{p.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{pct}% complete</span>
                            <span className="text-muted-foreground">{total} steps</span>
                          </div>
                          <Progress value={pct} className="h-1.5" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={getDifficultyColor(p.difficulty)}>
                            {p.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{p.lastAccessed}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => onStartProject(p.id)}
                        >
                          <Play className="h-3 w-3 mr-2" />
                          Continue
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </section>

        {/* Project Recommendations */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2>Recommended Projects</h2>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {project.title}
                        {project.trending && (
                          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                            <Zap className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm">{project.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <Badge className={getDifficultyColor(project.difficulty)}>
                      {project.difficulty}
                    </Badge>
                    <span className="text-muted-foreground">{project.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{project.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{project.students.toLocaleString()} students</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => onStartProject(project.id)}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Start Project
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}