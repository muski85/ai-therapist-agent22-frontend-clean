"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api/auth";


export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword){
      setError("Passwords do not match");
      return;
    }
      setLoading(true);
      try{
        console.log(name, email);
        await registerUser(name, email, password );
        router.push('/login');
      }catch (error: any){
        setError(error.message || "Signup failed, Please try again");
      }finally{
        setLoading(false);
      }
  
};


  return (
    <div
      className="min-h-screen w-full flex 
    items-center justify-center 
    bg-gradient-to-br from-primary/10
    via-background to-secondary/30"
    >
      <Container className="flex flex-col items-center justify-center w-full px-4">
        <Card className="w-full sm:w-10/12 md:w-7/12 lg:w-5/12 max-w-2xl p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-primary/10 bg-card/90 backdrop-blur-lg mt-8 sm:mt-12">
          <div className="mb-4 sm:mb-6 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-1 tracking-tight">
              Sign Up
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium">
              Create your account to start your journey with Aura.
            </p>
          </div>
          {/* form component */}
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Name */}
                <div className="flex-1">
                <label
                  htmlFor="name"
                  className="block text-sm sm:text-base font-semibold mb-1"
                >
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    className="pl-10 sm:pl-12 py-2 sm:py-2.5 text-sm sm:text-base rounded-xl bg-card bg-opacity-80 border border-primary focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder:text-muted-foreground"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
                {/* email */}
              <div className="flex-1">
                <label
                  htmlFor="email"
                  className="block text-sm sm:text-base font-semibold mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 sm:pl-12 py-2 sm:py-2.5 text-sm sm:text-base rounded-xl bg-card bg-opacity-80 border border-primary focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder:text-muted-foreground"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm sm:text-base font-semibold mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 sm:pl-12 py-2 sm:py-2.5 text-sm sm:text-base rounded-xl bg-card bg-opacity-80 border border-primary focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder:text-muted-foreground"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              {/* confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm sm:text-base font-semibold mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10 sm:pl-12 py-2 sm:py-2.5 text-sm sm:text-base rounded-xl bg-card bg-opacity-80 border border-primary focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder:text-muted-foreground"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

            </div>
            {error && (
              <p className="text-red-500 text-xs sm:text-sm
              text-center
              " > {error} </p>
            )}

            {/* Button */}
            <Button
            className="w-full py-2 sm:py-2.5 text-sm sm:text-base rounded-xl font-bold bg-gradient-to-r
            from-primary to-primary/80 shadow-md hover:from-primary/80 hover:to-primary

            "
            size="lg"
            type="submit"
            disabled= {loading}
            >
             {loading ? "Signing Up..." : "Sign Up"}

            </Button>
          </form>


            <div  className="my-4 sm:my-6 border-t border-primary/10"/>
              <p className="text-sm sm:text-base text-center text-muted-foreground">
                 Already have an account?{" "}

              <Link
               href="/login"
               className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
              >
                Sign in
              </Link>
            </p> 
        </Card>
      </Container>
    </div>
  );
}
