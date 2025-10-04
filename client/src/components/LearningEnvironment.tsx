import { useState } from "react";
import { Header } from "./Header";
import { ProjectSidebar } from "./ProjectSidebar";
import { AIAssistant } from "./AIAssistant";
import { CodeEditor } from "./CodeEditor";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./ui/resizable";

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
    title: "Add basic CSS styling",
    completed: false,
    instruction: "Now let's make it look better! Add a <style> tag in the head section and add some CSS to style your page.",
    hint: "Try changing the background color, text color, and font family.",
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Webpage</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            color: #333;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            color: #2563eb;
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

export function LearningEnvironment({ userName, onExit }) {
  const [steps, setSteps] = useState(initialSteps);
  const [currentStep, setCurrentStep] = useState(1);
  const [code, setCode] = useState(initialSteps[0].starterCode);
  const [output, setOutput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: `Welcome to AI Code Tutor${userName ? `, ${userName}` : ""}! 👋

I'm here to guide you through building your first webpage step by step.

${initialSteps[0].instruction}

${initialSteps[0].hint}

The starter code is already loaded in the editor. Take your time and ask me questions if you need help!`,
    },
  ]);

  const handleStepClick = (stepId) => {
    const step = steps.find((s) => s.id === stepId);
    if (!step) return;

    setCurrentStep(stepId);
    setCode(step.starterCode);
    
    const newMessage = {
      id: messages.length + 1,
      role: "assistant",
      content: `Step ${stepId}: ${step.title}

${step.instruction}

${step.hint}

I've loaded the starter code for this step. You can modify it or start fresh!`,
    };
    
    setMessages([...messages, newMessage]);
  };

  const handleSendMessage = (userMessage) => {
    const userMsg = {
      id: messages.length + 1,
      role: "user",
      content: userMessage,
    };

    // Mock AI response based on common questions
    let aiResponse = "";
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("help") || lowerMessage.includes("stuck")) {
      const step = steps.find((s) => s.id === currentStep);
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
      aiResponse = `I'd be happy to explain! 

For Step ${currentStep}, here's what's happening:
- Each HTML tag has a specific purpose
- The structure follows a hierarchy (parent and child elements)
- CSS styling makes your page visually appealing

What specific part would you like me to explain in more detail?`;
    } else {
      aiResponse = `Great question! I'm here to help you learn.

For your current step, remember to:
1. Read the instruction carefully
2. Look at the starter code as a reference
3. Experiment and try things out
4. Use the "Run Code" button to test your changes

Keep up the great work! 🚀`;
    }

    const aiMsg = {
      id: messages.length + 2,
      role: "assistant",
      content: aiResponse,
    };

    setMessages([...messages, userMsg, aiMsg]);
  };

  const handleRunCode = () => {
    // Mock output - in a real app, this could execute code in a sandboxed environment
    setOutput(`Code executed successfully!

Output:
✓ HTML structure is valid
✓ Step ${currentStep} content loaded
✓ Ready for next step

Note: This is a learning environment. Your code would render as a webpage in a real browser.`);

    // Mark current step as completed
    setSteps(
      steps.map((step) =>
        step.id === currentStep ? { ...step, completed: true } : step
      )
    );
  };

  return (
    <div className="h-screen flex flex-col">
      <Header userName={userName} onExit={onExit} />
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <ProjectSidebar
            projectTitle="Build Your First Webpage"
            projectDescription="Learn HTML and CSS basics by creating a personal webpage from scratch."
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={40} minSize={30}>
          <AIAssistant messages={messages} onSendMessage={handleSendMessage} />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={40} minSize={30}>
          <CodeEditor
            code={code}
            language="html"
            onChange={setCode}
            onRun={handleRunCode}
            output={output}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
