
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase/client";
import { updateProfile, updateEmail, updatePassword, sendEmailVerification } from "firebase/auth";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { UserCircle, Mail, Lock, Edit3, ShieldAlert, Eye, EyeOff, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const displayNameSchema = z.object({
  displayName: z.string().min(3, { message: "Display name must be at least 3 characters." }).max(50, { message: "Display name must be 50 characters or less." }),
});

const emailSchema = z.object({
  newEmail: z.string().email({ message: "Invalid email address." }),
});

const passwordSchema = z.object({
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match.",
  path: ["confirmNewPassword"],
});

type DisplayNameFormValues = z.infer<typeof displayNameSchema>;
type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [isDisplayNameLoading, setIsDisplayNameLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  const displayNameForm = useForm<DisplayNameFormValues>({
    resolver: zodResolver(displayNameSchema),
    defaultValues: {
      displayName: "",
    },
  });

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      newEmail: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      displayNameForm.reset({ displayName: user.displayName || "" });
    }
  }, [user, user?.displayName, displayNameForm.reset]);

  useEffect(() => {
    if (user) {
      emailForm.reset({ newEmail: user.email || "" });
    }
  }, [user, user?.email, emailForm.reset]);

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading profile...</div>;
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleUpdateError = (error: any, action: string) => {
    console.error(`${action} error`, error);
    let errorMessage = `An unexpected error occurred while updating your ${action.toLowerCase()}.`;
    if (error.code === "auth/requires-recent-login") {
      errorMessage = "This operation is sensitive and requires recent authentication. Please log out and log back in, then try again.";
    } else if (error.code === "auth/email-already-in-use") {
      errorMessage = "This email address is already in use by another account.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "The new password is too weak.";
    } else if (error.code === "auth/operation-not-allowed") {
      if (action === "Email") {
        errorMessage = `Could not update email. This might be because your current email is not verified, or due to project security settings preventing this change. Firebase error: ${error.message}`;
      } else if (action === "Password") {
         errorMessage = `Could not update password. This may be due to project security settings. Firebase error: ${error.message}`;
      } else {
        errorMessage = `This operation is not allowed. Firebase error: ${error.message}`;
      }
    }
    toast({
      title: `${action} Failed`,
      description: errorMessage,
      variant: "destructive",
    });
  };

  const onDisplayNameSubmit = async (data: DisplayNameFormValues) => {
    if (!auth.currentUser) return;
    setIsDisplayNameLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName: data.displayName });
      toast({ title: "Display Name Updated", description: "Your display name has been successfully updated." });
    } catch (error: any) {
      handleUpdateError(error, "Display Name");
    } finally {
      setIsDisplayNameLoading(false);
    }
  };

  const onEmailSubmit = async (data: EmailFormValues) => {
    if (!auth.currentUser) return;

    if (!auth.currentUser.emailVerified) {
      toast({
        title: "Current Email Not Verified",
        description: "Please verify your current email address before attempting to change it. You can resend a verification email from this page.",
        variant: "destructive",
      });
      return;
    }

    setIsEmailLoading(true);
    try {
      await updateEmail(auth.currentUser, data.newEmail);
      toast({ 
        title: "Verification Sent to New Email", 
        description: "A verification link has been sent to your new email address. Please click the link in that email to finalize the change." 
      });
    } catch (error: any) {
      handleUpdateError(error, "Email");
    } finally {
      setIsEmailLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    if (!auth.currentUser) return;
    setIsPasswordLoading(true);
    try {
      await updatePassword(auth.currentUser, data.newPassword);
      toast({ title: "Password Updated", description: "Your password has been successfully updated." });
      passwordForm.reset();
    } catch (error: any) {
      handleUpdateError(error, "Password");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    if (!auth.currentUser) return;
    setIsSendingVerification(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast({
        title: "Verification Email Sent",
        description: `A new verification email has been sent to ${auth.currentUser.email}. Please check your inbox.`,
      });
    } catch (error: any) {
      console.error("Resend verification email error", error);
      let errorMessage = "Could not send verification email. Please try again later.";
      if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please wait a while before trying to resend the verification email.";
      }
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSendingVerification(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-3xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold flex items-center justify-center text-primary">
          <UserCircle className="w-10 h-10 mr-3" />
          Your Profile
        </h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and personal information.</p>
      </header>

      {!user.emailVerified && (
        <Alert variant="default" className="mb-6 border-yellow-500/50 bg-yellow-500/5 text-yellow-700 dark:text-yellow-400">
          <ShieldAlert className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
          <AlertTitle className="text-yellow-700 dark:text-yellow-500">Email Not Verified</AlertTitle>
          <AlertDescription>
            Your current email address ({user.email}) is not verified. Some actions, like changing your email, may be restricted.
            <Button
              variant="link"
              onClick={handleResendVerificationEmail}
              disabled={isSendingVerification}
              className="p-0 h-auto ml-1 text-yellow-700 dark:text-yellow-400 hover:underline"
            >
              {isSendingVerification ? "Sending..." : "Resend verification email"}
              {!isSendingVerification && <Send className="w-3 h-3 ml-1" />}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-8 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Edit3 className="w-6 h-6 mr-2 text-primary" />
            Update Display Name
          </CardTitle>
          <CardDescription>Change the name that is displayed on your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...displayNameForm}>
            <form onSubmit={displayNameForm.handleSubmit(onDisplayNameSubmit)} className="space-y-6">
              <FormField
                control={displayNameForm.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your display name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full sm:w-auto" disabled={isDisplayNameLoading}>
                {isDisplayNameLoading ? "Updating..." : "Update Display Name"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <Card className="mb-8 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Mail className="w-6 h-6 mr-2 text-primary" />
            Update Email Address
          </CardTitle>
          <CardDescription>Change the email address associated with your account. Current: {user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="mb-6 border-primary/50 bg-primary/5">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary">Security Notice</AlertTitle>
            <AlertDescription>
              Changing your email address is a sensitive operation. You will need to verify your new email address. If your current email is unverified, you must verify it first.
            </AlertDescription>
          </Alert>
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
              <FormField
                control={emailForm.control}
                name="newEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full sm:w-auto" disabled={isEmailLoading}>
                {isEmailLoading ? "Updating..." : "Update Email"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Lock className="w-6 h-6 mr-2 text-primary" />
            Change Password
          </CardTitle>
          <CardDescription>Update your account password for enhanced security.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="mb-6 border-primary/50 bg-primary/5">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary">Security Notice</AlertTitle>
            <AlertDescription>
              Changing your password is a sensitive operation and may require you to re-authenticate.
            </AlertDescription>
          </Alert>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showNewPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                     <FormControl>
                      <div className="relative">
                        <Input 
                          type={showConfirmNewPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                          onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        >
                          {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full sm:w-auto" disabled={isPasswordLoading}>
                {isPasswordLoading ? "Updating..." : "Change Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

