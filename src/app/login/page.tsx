
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase/client";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn, Chrome } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push("/"); 
    } catch (error: any) {
      console.error("Login error", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Please try again.";
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Google Sign-In Successful", description: "Welcome!" });
      router.push("/");
    } catch (error: any) {
      console.error("Google Sign-In detailed error object:", error); 

      if (error.code === 'auth/popup-closed-by-user') {
        toast({
          title: "Google Sign-In Cancelled or Interrupted",
          description: "The Google Sign-In window was closed. If you didn't close it, your browser, an extension, or the current environment (like Cloud Workstations) might be blocking or closing the popup. Check for popup blockers or console errors.",
        });
      } else if (error.code === 'auth/popup-blocked') {
         toast({
          title: "Google Sign-In Failed: Popup Blocked",
          description: "Google Sign-In popup was blocked by the browser. Please allow popups for this site and try again.",
          variant: "destructive",
        });
      } else if (error.code === 'auth/unauthorized-domain') {
         toast({
          title: "Google Sign-In Failed: Unauthorized Domain",
          description: "This domain is not authorized for Google Sign-In. Please ensure this domain is added to the 'Authorized domains' list in your Firebase project's Authentication settings.",
          variant: "destructive",
        });
      } else {
        let errorMessage = "An unexpected error occurred with Google Sign-In.";
        if (error.code === 'auth/account-exists-with-different-credential') {
          errorMessage = "An account already exists with the same email address but different sign-in credentials. Try signing in with a different method.";
        } else if (error.message) {
          errorMessage = error.message;
        }
        toast({
          title: "Google Sign-In Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center">
            <LogIn className="w-8 h-8 mr-2 text-primary" />
            Login
          </CardTitle>
          <CardDescription>Enter your credentials or use a social provider.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                {isLoading ? "Logging in..." : "Login with Email"}
              </Button>
            </form>
          </Form>
          <div className="my-6 flex items-center">
            <Separator className="flex-grow" />
            <span className="mx-4 text-xs text-muted-foreground">OR</span>
            <Separator className="flex-grow" />
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
          >
            <Chrome className="w-5 h-5 mr-2" /> 
            {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <p className="w-full">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
