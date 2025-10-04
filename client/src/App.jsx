import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { SignupPage } from "./components/SignupPage";
import { LearningEnvironment } from "./components/LearningEnvironment";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [userName, setUserName] = useState("");

  const handleGetStarted = () => {
    setCurrentPage("learning");
  };

  const handleSignUp = () => {
    setCurrentPage("signup");
  };

  const handleSignupSuccess = (name) => {
    setUserName(name);
    setCurrentPage("learning");
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
  };

  const handleExit = () => {
    setCurrentPage("home");
    setUserName("");
  };

  if (currentPage === "signup") {
    return (
      <SignupPage
        onBack={handleBackToHome}
        onSignupSuccess={handleSignupSuccess}
      />
    );
  }

  if (currentPage === "learning") {
    return (
      <LearningEnvironment
        userName={userName}
        onExit={handleExit}
      />
    );
  }

  return (
    <HomePage
      onGetStarted={handleGetStarted}
      onSignUp={handleSignUp}
    />
  );
}
