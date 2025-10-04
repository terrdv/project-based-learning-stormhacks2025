import { Code2, Sparkles, BookOpen, Zap, Users, Award, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function HomePage({ onGetStarted, onSignUp }) {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Guidance",
      description: "Get intelligent, step-by-step instructions from our advanced AI tutor that adapts to your learning pace.",
    },
    {
      icon: Code2,
      title: "Built-in Code Editor",
      description: "Write and test code directly in your browser with our integrated Monaco-based IDE.",
    },
    {
      icon: BookOpen,
      title: "Structured Learning",
      description: "Follow carefully crafted projects that take you from beginner to confident developer.",
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Run your code and see results immediately with real-time validation and helpful hints.",
    },
    {
      icon: Users,
      title: "Learn by Doing",
      description: "Build real projects while learning, not just reading theory or watching videos.",
    },
    {
      icon: Award,
      title: "Track Progress",
      description: "Visualize your journey with step-by-step completion tracking and achievements.",
    },
  ];

  const projects = [
    {
      title: "Build Your First Webpage",
      level: "Beginner",
      topics: "HTML, CSS",
      description: "Learn web development basics by creating a personal webpage from scratch.",
    },
    {
      title: "Interactive To-Do App",
      level: "Intermediate",
      topics: "JavaScript, DOM",
      description: "Master JavaScript fundamentals by building a fully functional task manager.",
    },
    {
      title: "Weather Dashboard",
      level: "Intermediate",
      topics: "APIs, React",
      description: "Fetch and display real-time weather data using modern web technologies.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-8">
              <Sparkles className="size-4 text-primary" />
              <span className="text-sm">AI-Powered Learning Platform</span>
            </div>
            
            <h1 className="mb-6">
              Learn to Code with AI Guidance
            </h1>
            
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
              Master programming through hands-on projects with personalized AI instruction. 
              Build real applications while learning at your own pace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={onGetStarted} className="group">
                Start Learning Free
                <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" onClick={onSignUp}>
                Create Account
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Start coding in minutes
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="mb-4">Everything You Need to Succeed</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform combines the best of AI technology and educational best practices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="size-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="bg-muted/30 border-y border-border py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Popular Learning Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from curated projects designed to build your skills progressively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Card key={index} className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                      {project.level}
                    </span>
                    <span className="text-xs text-muted-foreground">{project.topics}</span>
                  </div>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{project.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" onClick={onGetStarted}>
              View All Projects
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-2xl p-12 text-center text-primary-foreground">
          <h2 className="mb-4">Ready to Start Your Coding Journey?</h2>
          <p className="mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Join thousands of learners who are building their programming skills with AI guidance
          </p>
          <Button size="lg" variant="secondary" onClick={onSignUp}>
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="size-5 text-primary" />
              <span>AI Code Tutor</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 AI Code Tutor. Learn to code with confidence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
