"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/services/auth/service";
import { toast } from "sonner";
import { getUser } from "@/services/user/service";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);

      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");

      if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof name !== "string"
      ) {
        throw new Error("Invalid Form input");
      }

      const res = await signup({ name, email, password });

      if (!res) {
        throw new Error("Error Creating User.");
      }

      toast.success("Success fully Registered");

      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser();
        if (res) {
          toast.info("User already logged in");
          router.push("/dashboard");
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>
          </CardContent>
        </form>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
