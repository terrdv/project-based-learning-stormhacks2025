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
  Clock, 
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

  useEffect(() => {
      let mounted = true;
      (async () => {
        try {
          const { data } = await supabase.auth.getUser();
          const user = data?.user;
          if (!mounted || !user) return
          const meta: any = user.user_metadata ?? {}
          setUserName(meta.full_name || 'user')
        } catch (e) {
          // ignore
        }
    })()
      return () => { mounted = false }
    }, []);

  const onContinueLearning = () => {
    // navigate to learning environment
    navigate('/editor');
  };

  const onStartProject = (projectId: string) => {
    // route to learning with project state
    navigate('/editor', { state: { projectId } });
  };
    
  const [savedProjectsOpen, setSavedProjectsOpen] = useState(false);

  // Mock current project data
  const currentProject = {
    id: "html-css-basics",
    title: "HTML & CSS Fundamentals",
    description: "Learn the building blocks of web development",
    progress: 65,
    currentStep: 3,
    totalSteps: 4,
    timeSpent: "2h 15m",
    lastAccessed: "2 hours ago",
    steps: [
      { id: 1, title: "HTML Structure", completed: true },
      { id: 2, title: "CSS Styling", completed: true },
      { id: 3, title: "Responsive Design", completed: false, current: true },
      { id: 4, title: "CSS Grid & Flexbox", completed: false }
    ]
  };

  // Mock saved projects
  const savedProjects = [
    {
      id: "js-fundamentals",
      title: "JavaScript Fundamentals",
      description: "Master the basics of JavaScript programming",
      progress: 45,
      totalSteps: 6,
      lastAccessed: "1 week ago",
      difficulty: "Beginner"
    },
    {
      id: "react-intro",
      title: "Introduction to React",
      description: "Build dynamic user interfaces with React",
      progress: 20,
      totalSteps: 8,
      lastAccessed: "2 weeks ago",
      difficulty: "Intermediate"
    },
    {
      id: "css-animations",
      title: "CSS Animations & Transitions",
      description: "Create engaging animations with pure CSS",
      progress: 80,
      totalSteps: 5,
      lastAccessed: "3 days ago",
      difficulty: "Intermediate"
    }
  ];

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
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {currentProject.title}
                  </CardTitle>
                  <CardDescription>{currentProject.description}</CardDescription>
                </div>
                <Button onClick={onContinueLearning} className="shrink-0">
                  <Play className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="space-y-2 md:col-span-2">
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{currentProject.progress}%</span>
                      <span className="text-xs text-muted-foreground">{currentProject.currentStep}/{currentProject.totalSteps} steps</span>
                    </div>
                    <Progress value={currentProject.progress} className="h-2" />
                  </div>
                </div>
                <div className="flex items-center gap-8 mx-auto md:mx-0 md:ml-auto">
                    <div className="flex flex-col items-center space-y-2">
                    <p className="text-sm text-muted-foreground">Time Spent</p>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{currentProject.timeSpent}</span>
                    </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                    <p className="text-sm text-muted-foreground">Last Accessed</p>
                    <span className="font-medium">{currentProject.lastAccessed}</span>
                    </div>
                </div>
              </div>

              <Separator />

              {/* Detailed Steps */}
              <div className="space-y-3">
                <h4 className={`flex text-left`}>Learning Steps</h4>
                <div className="space-y-2">
                  {currentProject.steps.map((step) => (
                    <div 
                      key={step.id} 
                      className={`flex text-left items-center gap-3 p-3 rounded-lg border ${
                        step.current 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border bg-card'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        step.completed 
                          ? 'bg-green-500 text-white' 
                          : step.current 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {step.completed ? '✓' : step.id}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${step.current ? 'text-primary' : ''}`}>
                          {step.title}
                        </p>
                        {step.current && (
                          <p className="text-xs text-muted-foreground">Currently learning</p>
                        )}
                      </div>
                      {step.current && (
                        <Badge variant="outline" className="text-xs">
                          In Progress
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
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
                {savedProjects.map((project) => (
                  <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{project.title}</CardTitle>
                        <Bookmark className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                      <CardDescription className="text-sm">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{project.progress}% complete</span>
                          <span className="text-muted-foreground">{project.totalSteps} steps</span>
                        </div>
                        <Progress value={project.progress} className="h-1.5" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className={getDifficultyColor(project.difficulty)}>
                          {project.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{project.lastAccessed}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => onStartProject(project.id)}
                      >
                        <Play className="h-3 w-3 mr-2" />
                        Continue
                      </Button>
                    </CardContent>
                  </Card>
                ))}
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