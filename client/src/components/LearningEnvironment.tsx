import { useState, useRef } from "react";
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
  ArrowRight
} from "lucide-react";
import { CodeEditor } from "./Sandpack";
import { postFeedback } from "../services/geminiAPI";

// fetch from database using project id
const initialSteps = [
  {
    id: 1,
    title: "Set up HTML structure",
    completed: false,
    instruction: "Let's start by creating a basic HTML structure. We need a DOCTYPE declaration, html, head, and body tags.",
    hint: "Remember to include a title in the head section!",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Webpage</title>
</head>
<body>
    
</body>
</html>`,
  },
  {
    id: 2,
    title: "Add a heading and paragraph",
    completed: false,
    instruction: "Great! Now let's add some content. Add an h1 heading with 'Welcome to My Page' and a paragraph introducing yourself.",
    hint: "Use <h1> for the heading and <p> for the paragraph.",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Webpage</title>
</head>
<body>
    <h1>Welcome to My Page</h1>
    <p>Hello! I'm learning web development.</p>
</body>
</html>`,
  },
  {
    id: 3,
    title: "Create a list of hobbies",
    completed: false,
    instruction: "Let's add an unordered list of your hobbies. Use the <ul> tag with multiple <li> items.",
    hint: "Each hobby should be wrapped in an <li> tag.",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Webpage</title>
</head>
<body>
    <h1>Welcome to My Page</h1>
    <p>Hello! I'm learning web development.</p>
    
    <h2>My Hobbies</h2>
    <ul>
        <li>Reading</li>
        <li>Coding</li>
        <li>Gaming</li>
    </ul>
</body>
</html>`,
  },
  {
    id: 4,
    title: "Style with CSS",
    completed: false,
    instruction: "Now let's add some basic CSS styling to make our page look better. Add a style section in the head.",
    hint: "Use CSS to change colors, fonts, and spacing.",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Webpage</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        h1 {
            color: #333;
            text-align: center;
        }
        h2 {
            color: #666;
        }
        ul {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        li {
            margin: 8px 0;
        }
    </style>
</head>
<body>
    <h1>Welcome to My Page</h1>
    <p>Hello! I'm learning web development.</p>
    
    <h2>My Hobbies</h2>
    <ul>
        <li>Reading</li>
        <li>Coding</li>
        <li>Gaming</li>
    </ul>
</body>
</html>`,
  },
];

export function LearningEnvironment() {
  // const navigate = useNavigate();

  const userName = "Your Name" // !!! need to change 
  const [steps, setSteps] = useState(initialSteps);
  const [currentStep, setCurrentStep] = useState(1);
  //  should w use database here 
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: `Welcome to your HTML & CSS learning journey, ${userName || 'there'}! 👋`,
    },
  ]);
  // keep a stable id counter for messages so ids don't depend on array length
  const messageIdRef = useRef<number>(2);
  const [editorFiles, setEditorFiles] = useState<Record<string, string>>({});
  // const previewRef = useRef<HTMLIFrameElement>(null);

  // steps from database
  const currentStepData = steps.find((step) => step.id === currentStep);
  const completedSteps = steps.filter((step) => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
    const step = steps.find((s) => s.id === stepId);
    if (step) {
      // update preview / local code is managed by Sandpack; we no longer keep a separate local `code` state
      // updatePreview(step.starterCode);
      
      // Add AI message when switching steps
      // print new message on submit instead.
      const newMessage = {
        id: messageIdRef.current++,
        role: "assistant",
        content: `Great! Let's work on Step ${stepId}: ${step.title}

${step.instruction}

// Add a hint button.
💡 **Hint**: ${step.hint}

The code editor has been updated with the starting code for this step. Give it a try!`,
      };
      
        setMessages((m) => [...m, newMessage]);
    }
  };

  const handleCompleteStep = async () => {
    // Submit the current editor code to Gemini and show feedback in the chat
    try {
      await submitCodeToGemini();
    } catch (e) {
      // ignore submission errors here — the submitCodeToGemini function already appends an error message
    }

    // mark the step complete locally
    setSteps(steps.map((step) => 
      step.id === currentStep ? { ...step, completed: true } : step
    ));

    const newMessage = {
      id: messageIdRef.current++,
      role: "assistant",
      content: `🎉 Excellent work! You've completed Step ${currentStep}: ${currentStepData?.title}

${currentStep < totalSteps 
  ? `Ready for the next challenge? Click on Step ${currentStep + 1} to continue!` 
  : "Congratulations! You've completed all the steps in this project. You've learned the fundamentals of HTML and CSS! 🎊"
}`,
    };
    setMessages((m) => [...m, newMessage]);

    // Auto-advance to next step if available
    if (currentStep < totalSteps) {
      setTimeout(() => {
        handleStepClick(currentStep + 1);
      }, 2000);
    }
  };

  const handleSendMessage = (userMessage: string) => {
    const userMsg = {
      id: messages.length + 1,
      role: "user",
      content: userMessage,
    };

    // Basic local assistant responses for navigation/explain/hint keywords
    const lowerMessage = userMessage.toLowerCase();
    let aiResponse = "";
    const step = steps.find((s) => s.id === currentStep);

    if (lowerMessage.includes("help") || lowerMessage.includes("stuck")) {
      aiResponse = `Don't worry! Let me help you with Step ${currentStep}.

${step?.hint}

Try looking at the starter code I provided. Each part serves a specific purpose. Would you like me to explain any particular section?`;
    } else if (lowerMessage.includes("next")) {
      if (currentStep < steps.length) {
        const nextStepId = currentStep + 1;
        handleStepClick(nextStepId);
        return;
      } else {
        aiResponse = "Great job! You've completed all the steps. Feel free to experiment with the code and add your own features!";
      }
    } else if (lowerMessage.includes("explain")) {
      aiResponse = `Sure! Let me explain the current step:

**${currentStepData?.title}**

${currentStepData?.instruction}

The key things to focus on:
- Look at the HTML structure and how elements are nested
- Notice how each tag has an opening and closing part
- Pay attention to proper indentation for readability

What specific part would you like me to explain in more detail?`;
    } else if (lowerMessage.includes("hint")) {
      aiResponse = `💡 **Hint for Step ${currentStep}**: ${currentStepData?.hint}

Remember, you can always experiment with the code. Try making small changes and see what happens in the preview!`;
    } else {
      aiResponse = `That's a great question! I'm here to help you with your coding journey.

For Step ${currentStep} (${currentStepData?.title}), remember that ${currentStepData?.hint}

Feel free to ask me:
- "help" if you're stuck
- "explain" for more details about the current step  
- "hint" for a helpful tip
- "next" to move to the next step

Keep coding! 💪`;
    }

    const aiMsg = {
      id: messages.length + 2,
      role: "assistant",
      content: aiResponse,
    };

    setMessages([...messages, userMsg, aiMsg]);
  };

  // Submit code to Gemini and append response to the assistant chat
  const submitCodeToGemini = async (codeToSend?: string) => {
    // fallback to current editor files if no explicit code provided
    const code = codeToSend ?? (editorFiles['/App.js'] || editorFiles['index.js'] || Object.values(editorFiles).join('\n\n'));

    const interimMsg = { id: messageIdRef.current++, role: 'assistant', content: 'Checking your code with Gemini...' };
    setMessages((m) => [...m, interimMsg]);

    try {
      const resp = await postFeedback(code, `Feedback for step ${currentStep}`);
      const content = typeof resp === 'object' ? JSON.stringify(resp, null, 2) : String(resp);
      setMessages((m) => [...m.slice(0, -1), { id: messageIdRef.current++, role: 'assistant', content }]);
    } catch (err) {
      setMessages((m) => [...m.slice(0, -1), { id: messageIdRef.current++, role: 'assistant', content: `Error getting feedback: ${String(err)}` }]);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      handleStepClick(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      handleStepClick(currentStep + 1);
    }
  };


  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      
      {/* Horizontal Progress Bar */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-medium">HTML & CSS Fundamentals</h3>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}: {currentStepData?.title}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{completedSteps}/{totalSteps} completed</span>
            <Badge variant={completedSteps === totalSteps ? "default" : "secondary"}>
              {Math.round(progressPercentage)}%
            </Badge>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        
        {/* Step Navigation */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${
                  step.id === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : step.completed
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {step.completed ? (
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
              disabled={currentStep === totalSteps}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
  {/* AI Assistant Sidebar */}
  <div className="w-80 border-r border-border bg-card flex flex-col min-h-0">
          
          <div className="flex-1">
            <AIAssistant
              messages={messages}
              onSendMessage={handleSendMessage}
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
                {currentStepData?.instruction}
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={handleCompleteStep}
                  disabled={currentStepData?.completed}
                  className="flex-1"
                >
                  {currentStepData?.completed ? "Completed" : "Mark Complete"}
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
          <CodeEditor onFiles={setEditorFiles} />
        </div>
        
      </div>
    </div>
  );
}