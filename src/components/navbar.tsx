"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Zap, LogOut } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  // Define if the user is in the dashboard area
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 w-full items-center px-6">
        {/* Logo - Left */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">CollabHub</span>
        </Link>

        {/* Navigation - Right Aligned (ml-auto) */}
        <nav className="ml-auto flex items-center gap-4">
          {isDashboard ? (
            // LOGOUT BUTTON - Appears only on dashboard
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => {
                // Add your logout logic here
                window.location.href = "/";
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            // AUTH BUTTONS - Appear on marketing/auth pages
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
          
          {/* ThemeToggle remains at the end */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}