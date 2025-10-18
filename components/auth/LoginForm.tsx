"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/schemas/loginSchema";
import { useRouter } from "next/navigation";
import { useLogin } from "@/queries/auth";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "../ui/label";
import Link from "next/link";
import { Checkbox } from "../ui/checkbox";
import type { User } from "@/schemas/userSchema";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export default function LoginForm() {
  const setUser = useAuthStore((state) => state.setUser);
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending, isError, error } = useLogin();
  const router = useRouter();

  const onSubmit = (data: LoginSchema) => {
    const toastId = toast.loading("Logging in...");
    mutate(data, {
      onSuccess: (res) => {
        const user = res.content.user as User;
        if (user) {
          const userSession = {
            email: user.email,
            role: user.role,
            fullName: user.fullName,
          };

          setUser({
            email: user.email,
            role: user.role,
            fullName: user.fullName,
            contact: "",
            id: user.id,
          });

          localStorage.setItem("userSession", JSON.stringify(userSession));
          toast.success("Login successful! Redirecting...", { id: toastId });
          router.replace("/todo");
        } else {
          console.error("Login success but no user object in response:", res);
          toast.error(error?.message || "Invalid email or password", {
            id: toastId,
          });
        }

        router.replace("/todo");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center flex-col justify-center bg-gray-50">
      <div className="space-y-8 mb-8 text-center">
        <h1 className="text-6xl font-bold text-stone-700">Sign in</h1>
        <p className="text-muted-foreground">
          Just sign in if you have an account in here. Enjoy our Website{" "}
        </p>
      </div>
      <Card className="w-full max-w-md">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Email / Username</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your Email"
                        {...field}
                      />
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
                    <FormLabel>Enter Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember-me" />
                    <Label
                      htmlFor="remember-me"
                      className="text-sm font-medium leading-none"
                    >
                      Remember me
                    </Label>
                  </div>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              {isError && (
                <Alert variant="destructive">
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Login..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Button variant={"link"} asChild>
        <Link
          href="/register"
          className="mt-12 inline-block w-full text-center"
        >
          Already have an Square account? Log in
        </Link>
      </Button>
    </div>
  );
}
