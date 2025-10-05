import { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom'
import { Header } from "./Header";
import { AIAssistant } from "./AIAssistant";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  CheckCircle,
  Circle,
  RotateCcw,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { CodeEditor } from "./Sandpack";
// import { postFeedback } from "../services/geminiAPI";
import { supabase } from "../supabase";

export function LearningEnvironment() {
  // const navigate = useNavigate();


  const [userId, setUserId] = useState("");

  const [project, setProject] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);

  const step = project?.steps[currentStep - 1] ?? null;

  const updateProject = async () => {
    try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        if (!user) return;
        const id = user.id;
        const { data: projectData } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", id)
        .order("last_saved", { ascending: false })
        .limit(1)
        .single();
        setCurrentStep(projectData.progress)
        setMaxStep(projectData.progress)
        setUserId(id);
        setProject(projectData);
    } catch (e) {
        console.error(e);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
        await updateProject();
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Keep the local project in sync with database changes for this user
  useEffect(() => {
    if (!userId) return;

    // create a channel scoped to this user's projects
    const channel = supabase
      .channel(`projects_user_${userId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'projects', filter: `user_id=eq.${userId}` },
        () => {
          // refresh local project when the DB row changes
          updateProject().catch((e) => console.error('updateProject error from realtime:', e));
        }
      )
      .subscribe();

    return () => {
      // unsubscribe the channel when component unmounts or userId changes
      try {
        channel.unsubscribe();
      } catch (e) {
        // fallback: remove channel via supabase client
        // @ts-ignore
        if (supabase.removeChannel) supabase.removeChannel(channel);
      }
    };
  }, [userId]);


  const submitCodeToGemini = async () => {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/gemini/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project.id
        }),
      });
      const data = await response.json();
      return data.pass;
    };


  const handleStepClick = (stepId: number) => {
    if (stepId > maxStep){
        return;
    }
    setCurrentStep(stepId);
  };


  const handleCompleteStep = async () => {
    // 1) Check the submission result
    let passed = false;
    try {
      passed = await submitCodeToGemini(); // should return a boolean
    } catch {
      // ignore — submitCodeToGemini already appends an error message
    }

    if (passed) {
        setMaxStep((s) => s + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      handleStepClick(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < maxStep) {
      handleStepClick(currentStep + 1);
    }
  };

  return project?.steps?.length > 0 ? (
    <div className="h-screen flex flex-col bg-background">
      <Header />

      {/* Horizontal Progress Bar */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-left">
            <h3 className="font-medium">{project.title}</h3>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {project.steps.length}: {step.title}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {project.progress - 1}/{project.steps.length} completed
            </span>
            <Badge
              variant={project.progress === project.steps.length ? "default" : "secondary"}
            >
              {Math.round(((project.progress - 1) / project.steps.length) * 100)}%
            </Badge>
          </div>
        </div>
        <Progress value={((project.progress - 1) / project.steps.length) * 100} className="h-2" />

        {/* Step Navigation */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {project.steps.map((step: any, idx: number) => (
              <button
                key={idx + 1}
                onClick={() => handleStepClick(idx + 1)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${
                  idx + 1 === project.progress
                    ? "bg-primary text-primary-foreground"
                    : idx + 1 <= project.progress
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {idx + 1 <= project.progress ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{step.id}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextStep}
              disabled={currentStep >= project.progress}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex max-h-[600px] "> 
        {/* AI Assistant Sidebar */}
        {/* !!! Try to fix AI assistant height !!! */}
        <div className="w-80 border-r border-border bg-card flex flex-col min-h-0 h-full"> 
          <div className="flex-1 h-full">
            <AIAssistant
            project={project} userId = {userId}
            />
          </div>

          {/* Current Step Info */}
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Current Task</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {step.instruction}
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={handleCompleteStep}
                  disabled={project.progress > currentStep}
                  className="flex-1"
                >
                  {project.progress > currentStep ? "Completed" : "Submit"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  // onClick={handleResetCode}
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 bg-background h-full">
          <CodeEditor files={project.files} project={project} />
        </div>
      </div>
    </div>
  ):(
    <div className="flex items-center justify-center h-full">
      <p className="text-sm text-muted-foreground">
        Loading...
      </p>
    </div>
  );
}
