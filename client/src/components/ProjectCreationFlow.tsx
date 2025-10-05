import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { Button } from "./ui/button";
// Input not used in this flow (kept removed)
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  Code,
  Lightbulb,
  Target,
  BookOpen,
  Clock,
  Rocket
} from "lucide-react";
import { supabase } from "@/supabase";

type SkillLevel = {
  value: string;
  title: string;
  description: string;
  icon: string;
}

const SKILL_LEVELS: SkillLevel[] = [
  {
    value: "beginner",
    title: "Beginner",
    description: "New to coding or this technology",
    icon: "🌱"
  },
  {
    value: "intermediate",
    title: "Intermediate",
    description: "Comfortable with basics, ready to level up",
    icon: "🚀"
  },
  {
    value: "advanced",
    title: "Advanced",
    description: "Experienced, seeking mastery",
    icon: "⚡"
  }
];

type ProjectInterest = { id: string; label: string; icon: string };

const PROJECT_INTERESTS: ProjectInterest[] = [
  { id: "web", label: "Web Development", icon: "🌐" },
  { id: "mobile", label: "Mobile Apps", icon: "📱" },
  { id: "games", label: "Games", icon: "🎮" },
  { id: "ai", label: "AI & Machine Learning", icon: "🤖" },
  { id: "data", label: "Data Science", icon: "📊" },
  { id: "api", label: "APIs & Backend", icon: "⚙️" },
  { id: "design", label: "UI/UX Design", icon: "🎨" },
  { id: "other", label: "Other", icon: "✨" }
];

export function ProjectCreationFlow(): React.ReactElement {
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  type FormData = {
    skillLevel: string;
    learningGoal: string;
    projectDescription: string;
    interests: string[];
    projectSize: string;
    selectedProject: number | null;
  };

  const [formData, setFormData] = useState<FormData>({
    skillLevel: "",
    learningGoal: "",
    projectDescription: "",
    interests: [],
    projectSize: "medium",
    selectedProject: null
  });
    const [isGenerating, setIsGenerating] = useState(false);

  type Project = {
    id: number;
    icon: string;
    title: string;
    difficulty: string;
    description: string;
    topics: string[];
    duration: number;
  };
  const [suggestedProjects, setProjects] = useState<Project[]>([]);
  const handleProjectSelect = (projectId: number) => {
    setFormData({ ...formData, selectedProject: projectId });
  };
  
useEffect(() => {
    let mounted = true;
    (async () => {
    try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        if (!mounted || !user) return;
    } catch (e) {
        // ignore
    }
})()
    return () => { mounted = false }
}, []);

  const totalSteps = 5;
  const progressPercentage = (step / totalSteps) * 100;

  const handleSkillLevelSelect = (level: string): void => {
    setFormData({ ...formData, skillLevel: level });
  };

  const handleInterestToggle = (interestId: string): void => {
    const newInterests = formData.interests.includes(interestId)
      ? formData.interests.filter(id => id !== interestId)
      : [...formData.interests, interestId];
    setFormData({ ...formData, interests: newInterests });
  };

  const handleNext = async (): Promise<void> => {
    if (step == 4){
        await handleComplete();
    }
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = (): void => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async (): Promise<void> => {
    setIsGenerating(true);
    try {
        const session = await supabase.auth.getSession();

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gemini/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: formData,
            authToken: session.data?.session?.access_token || '',
          })
        });

        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`Server error: ${resp.status} ${text}`);
        }

        let result = await resp.json();
        console.log(result);
        result = result.map((item: any, idx: number) => {
          const project: Project = {
            ...item,
            id: suggestedProjects.length + idx + 1,
          };
          return project;
        });

        setProjects(result);
      } catch (err: any) {
        console.error('Project generation error:', err);
      }

    setIsGenerating(false);
  };

  const handleSubmit = async (): Promise<void> => {
    setIsGenerating(true);
    try {
        const session = await supabase.auth.getSession();

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gemini/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
                userInfo: formData,
                projectDetails: suggestedProjects[formData.selectedProject ?? 1 - 1]
            },
            authToken: session.data?.session?.access_token || '',
          })
        });

        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`Server error: ${resp.status} ${text}`);
        }

        navigate('/editor');
      } catch (err: any) {
        console.error('Project generation error:', err);
      }

    setIsGenerating(false);
  };



  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return formData.skillLevel !== "";
      case 2:
        return formData.learningGoal.trim().length > 0;
      case 3:
        return formData.interests.length > 0;
      case 4:
        return formData.projectDescription.trim().length > 0;
      case 5:
        return formData.selectedProject !== null;
      default:
        return false;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h2 className="font-medium">Create New Project</h2>
                <p className="text-sm text-muted-foreground">
                  Step {step} of {totalSteps}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="w-3 h-3" />
              AI-Powered
            </Badge>
          </div>
          <div className="mt-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Step 1: Skill Level */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-medium">
                  What's your skill level?
                </h3>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  This helps us create the perfect learning path tailored to your experience
                </p>
              </div>

              <div className="grid gap-4 max-w-2xl mx-auto">
                {SKILL_LEVELS.map((level) => (
                  <Card
                    key={level.value}
                    className={`cursor-pointer transition-all hover:border-primary ${
                      formData.skillLevel === level.value
                        ? 'border-primary bg-primary/5 shadow-md'
                        : ''
                    }`}
                    onClick={() => handleSkillLevelSelect(level.value)}
                  >
                    <CardHeader className="text-left">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{level.icon}</span>
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {level.title}
                            {formData.skillLevel === level.value && (
                              <CheckCircle className="w-5 h-5 text-primary" />
                            )}
                          </CardTitle>
                          <CardDescription>{level.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Learning Goal */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-medium">
                  What do you want to learn?
                </h3>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Tell us about the skills or concepts you're excited to master
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="learningGoal">Your Learning Goal</Label>
                  <Textarea
                    id="learningGoal"
                    placeholder="Example: I want to learn how to build interactive websites with React and create beautiful user interfaces..."
                    value={formData.learningGoal}
                    onChange={(e) => setFormData({ ...formData, learningGoal: e.target.value })}
                    className="min-h-32 resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.learningGoal.length} characters
                  </p>
                </div>

                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">💡 Tips for a great response:</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-1">
                    <p>• Be specific about what you want to learn</p>
                    <p>• Mention any technologies you're interested in</p>
                    <p>• Share what motivated you to learn this</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Code className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-medium">
                  What interests you most?
                </h3>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Select the areas you'd like to explore (choose at least one)
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-2 gap-3">
                  {PROJECT_INTERESTS.map((interest) => (
                    <Card
                      key={interest.id}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        formData.interests.includes(interest.id)
                          ? 'border-primary bg-primary/5 shadow-md'
                          : ''
                      }`}
                      onClick={() => handleInterestToggle(interest.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{interest.icon}</span>
                          <div className="flex-1">
                            <p className="font-medium">{interest.label}</p>
                          </div>
                          {formData.interests.includes(interest.id) && (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Project Description */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-medium">
                  Describe your project idea
                </h3>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  What kind of project would you like to build? Be as creative as you want!
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Project Description</Label>
                  <Textarea
                    id="projectDescription"
                    placeholder="Example: I want to build a todo list app that helps me organize my daily tasks. It should have categories, due dates, and the ability to mark tasks as complete. I'd love to add animations and make it look modern..."
                    value={formData.projectDescription}
                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    className="min-h-40 resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.projectDescription.length} characters
                  </p>
                </div>

                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">💡 Great project ideas include:</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-1">
                    <p>• The purpose of your project</p>
                    <p>• Key features you want to include</p>
                    <p>• Any specific design or functionality preferences</p>
                    <p>• What you hope to learn by building it</p>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Label htmlFor="projectSize">Project Size/Time Commitment</Label>
                  <RadioGroup
                    value={formData.projectSize}
                    onValueChange={(value) => setFormData({ ...formData, projectSize: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="small" id="small" />
                      <Label htmlFor="small" className="font-normal cursor-pointer">
                        Small - 2-3 hours
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="font-normal cursor-pointer">
                        Medium - 5-7 hours
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="large" id="large" />
                      <Label htmlFor="large" className="font-normal cursor-pointer">
                        Large - Multiple sessions
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Select Suggested Project */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-medium">
                  Choose Your Perfect Project
                </h3>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Based on your interests, we've generated these personalized project ideas for you
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="grid gap-4 md:grid-cols-2">
                  {suggestedProjects.map((project) => (
                    <Card
                      key={project.id}
                      className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary ${
                        formData.selectedProject === project.id
                          ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                          : ''
                      }`}
                      onClick={() => handleProjectSelect(project.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <span className="text-3xl shrink-0">{project.icon}</span>
                            <div className="space-y-1 flex-1 text-left">
                              <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                                {project.title}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                {project.description}
                              </CardDescription>
                            </div>
                          </div>
                          {formData.selectedProject === project.id && (
                            <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getDifficultyColor(project.difficulty)}>
                            Difficulty: {project.difficulty}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <Clock className="w-3 h-3" />
                            {project.duration} hours
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {project.topics.slice(0, 4).map((topic, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-muted/50 mt-6">
                  <CardContent>
                    <div className="gap-3 flex w-full items-center justify-between">
                      <BookOpen className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="font-medium">Don't see what you're looking for?</p>
                      <Button className="ml-auto" variant="outline" onClick={handleComplete} disabled={isGenerating}>Redo suggestions</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between max-w-4xl mx-auto pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || isGenerating}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {step < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating Projects...
                  </>
                ) : step === 4 ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Projects
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isGenerating || !canProceed()}
                className="gap-2"
              >
                <Rocket className="w-4 h-4" />
                Start Learning
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}