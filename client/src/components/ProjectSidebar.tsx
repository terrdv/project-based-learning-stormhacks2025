import { CheckCircle2, Circle, BookOpen } from "lucide-react";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

export function ProjectSidebar({
  projectTitle,
  projectDescription,
  steps,
  currentStep,
  onStepClick,
}) {
  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="size-5 text-primary" />
          <h2>Current Project</h2>
        </div>
        <h3 className="mb-2">{projectTitle}</h3>
        <p className="text-muted-foreground text-sm">{projectDescription}</p>
      </div>
      
      <Separator />
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4>Progress</h4>
          <Badge variant="secondary">
            {steps.filter(s => s.completed).length}/{steps.length}
          </Badge>
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 pb-4">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => onStepClick(step.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentStep === step.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 hover:bg-secondary"
              }`}
            >
              <div className="flex items-start gap-2">
                {step.completed ? (
                  <CheckCircle2 className="size-4 mt-0.5 flex-shrink-0 text-green-500" />
                ) : (
                  <Circle className="size-4 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="text-sm">Step {step.id}</div>
                  <div className={currentStep === step.id ? "" : "text-sm"}>
                    {step.title}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
