"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Shield,
  Brain,
  MessageCircle,
  Sparkles,
  LineChart,
  Clock,
  Lock,
  Zap,
  HeartHandshake
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

export default function Features() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const coreFeatures = [
    {
      icon: MessageCircle,
      title: "AI Therapy Chat",
      description: "Engage in meaningful conversations with our empathetic AI therapist available 24/7",
      color: "from-blue-500/20"
    },
    {
      icon: LineChart,
      title: "Mood Tracking",
      description: "Monitor your emotional well-being with intuitive mood logging and insights",
      color: "from-purple-500/20"
    },
    {
      icon: Brain,
      title: "Personalized Support",
      description: "Receive tailored therapeutic interventions adapted to your unique needs",
      color: "from-rose-500/20"
    },
    {
      icon: Sparkles,
      title: "Wellness Games",
      description: "Interactive anxiety-relief exercises and mindfulness activities",
      color: "from-amber-500/20"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Get support whenever you need it, without appointments or waiting lists",
      color: "from-green-500/20"
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your conversations are encrypted and completely confidential",
      color: "from-emerald-500/20"
    }
  ];

  const benefits = [
    {
      icon: HeartHandshake,
      title: "Accessible Care",
      description: "Mental health support for everyone, regardless of location or schedule"
    },
    {
      icon: Zap,
      title: "Instant Response",
      description: "No waiting rooms or appointments - get help the moment you need it"
    },
    {
      icon: Shield,
      title: "Safe Space",
      description: "A judgment-free environment to express yourself openly and honestly"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] mt-16 md:mt-20 flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full blur-3xl top-0 -left-10 md:-left-20 bg-gradient-to-r from-blue-500/30 via-primary/20 to-transparent opacity-60 animate-pulse-gentle" />
          <div className="absolute w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-br from-amber-500/20 via-secondary/10 to-transparent blur-3xl bottom-0 right-0 animate-pulse-gentle" />
          <div className="absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] rounded-full bg-gradient-to-r from-emerald-500/15 to-transparent blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center space-y-4 sm:space-y-6 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 sm:px-4 text-xs sm:text-sm border border-primary/20 bg-primary/5 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-foreground/90">Powerful Mental Health Tools</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight px-4">
            <span className="bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">
              Features
            </span>
            <br />
            <span className="bg-gradient-to-b from-foreground to-foreground/90 bg-clip-text text-transparent">
              Designed for Your Wellbeing
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto px-4">
            Everything you need to support your mental health journey, powered by advanced AI
            and evidence-based therapeutic techniques.
          </p>
        </motion.div>
      </section>

      {/* Core Features Section */}
      <section className="relative py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs sm:text-sm border border-primary/20 bg-primary/5">
              <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              <span className="text-foreground/80">Core Features</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent px-4">
              What Lumina Offers
            </h2>
            <p className="text-foreground/80 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Comprehensive tools and features designed to support your mental wellness.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="group relative overflow-hidden border border-primary/10 hover:border-primary/20 transition-all duration-300 h-full bg-card/30 backdrop-blur-sm">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="p-2 sm:p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 w-fit mb-2 sm:mb-3">
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-foreground">
                      {feature.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-12 sm:py-16 md:py-20 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs sm:text-sm border border-primary/20 bg-primary/5">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              <span className="text-foreground/80">Why Choose Lumina</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent px-4">
              Benefits That Matter
            </h2>
            <p className="text-foreground/80 max-w-3xl mx-auto text-sm sm:text-base md:text-lg px-4">
              Mental health support that fits your life, not the other way around.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border border-primary/10 bg-card/30 backdrop-blur-sm hover:border-primary/20 transition-all">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <div className="p-1.5 sm:p-2 rounded-xl bg-primary/10">
                        <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                        {benefit.title}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-12 sm:py-16 md:py-20 px-4 bg-muted/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-4">
              Experience the Difference
            </h2>
            <p className="text-foreground/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
              Join our community and discover a new approach to mental wellness.
            </p>
            <Button
              onClick={() => router.push("/signup")}
              size="lg"
              className="h-11 sm:h-12 px-6 sm:px-8 rounded-full text-sm sm:text-base bg-gradient-to-r from-primary via-primary/90 to-secondary hover:to-primary shadow-lg shadow-primary/20 transition-all duration-500"
            >
              Get Started Free
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}