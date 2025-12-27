import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowRight, CheckCircle2, Users, Zap, Shield } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex flex-col items-center">
        {/* Hero Section */}
        <section className="container px-6 pt-24 pb-12 text-center md:pt-32">
          <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1">
            Now in Beta — Version 2.0
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            Where teams build <br />
            <span className="text-primary">the future together.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            A unified workspace for real-time collaboration, project tracking,
            and seamless communication. Simple enough for individuals, powerful
            enough for enterprises.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base">
              Start Building Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              View Demo
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container px-6 py-24">
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Users className="h-6 w-6 text-primary" />}
              title="Real-time Sync"
              description="Work together on the same document simultaneously without any lag or conflicts."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-primary" />}
              title="Enterprise Security"
              description="End-to-end encryption and advanced permission controls keep your data safe."
            />
            <FeatureCard
              icon={<CheckCircle2 className="h-6 w-6 text-primary" />}
              title="Task Management"
              description="Integrated kanban boards and sprint tracking to keep your team on schedule."
            />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="container px-6 pb-24">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="text-center py-12">
              <CardTitle className="text-3xl font-bold">
                Ready to streamline your workflow?
              </CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">
                Join over 10,000+ teams worldwide today.
              </CardDescription>
              <div className="pt-6">
                <Button size="lg" variant="secondary" className="font-semibold">
                  Create Your Workspace
                </Button>
              </div>
            </CardHeader>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container px-6 text-center text-sm text-muted-foreground">
          © 2025 CollabHub Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-none shadow-none bg-muted/50">
      <CardHeader>
        <div className="mb-2 w-fit rounded-lg bg-background p-2 shadow-sm">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
