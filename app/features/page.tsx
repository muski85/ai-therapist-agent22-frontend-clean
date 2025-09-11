"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Shield,
  Users,
  Clock,
  Brain,
  Lightbulb,
  Target,
  MessageCircle,
  Sparkles,
  Award,
  Globe,
  Lock,
  HeartHandshake,
  Zap,
  BookOpen
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";

export default function About() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { icon: Users, label: "Users Supported", value: "10K+", color: "from-blue-500/20" },
    { icon: MessageCircle, label: "Conversations", value: "50K+", color: "from-green-500/20" },
    { icon: Clock, label: "24/7 Availability", value: "Always", color: "from-purple-500/20" },
    { icon: Globe, label: "Languages", value: "12+", color: "from-orange-500/20" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "Every interaction is designed with empathy and understanding at its core",
      color: "from-rose-500/20"
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your conversations are encrypted and completely confidential",
      color: "from-emerald-500/20"
    },
    {
      icon: BookOpen,
      title: "Evidence-Based",
      description: "All therapeutic approaches are backed by clinical research and best practices",
      color: "from-blue-500/20"
    },
    {
      icon: Target,
      title: "Personalized Support",
      description: "Tailored therapeutic interventions adapted to your unique needs and goals",
      color: "from-amber-500/20"
    }
  ];

  const mission = [
    {
      icon: Lightbulb,
      title: "Innovation in Mental Health",
      description: "We're pioneering the next generation of accessible mental health support through advanced AI technology."
    },
    {
      icon: HeartHandshake,
      title: "Breaking Down Barriers",
      description: "Making quality mental health care available to everyone, regardless of location, time, or financial constraints."
    },
    {
      icon: Zap,
      title: "Immediate Support",
      description: "Providing instant access to therapeutic support when you need it most, without waiting lists or appointments."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] mt-20 flex flex-col items-center justify-center py-12 px-4">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] rounded-full blur-3xl top-0 -left-20 bg-gradient-to-r from-primary/20 to-transparent opacity-60" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl bottom-0 right-0" />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center space-y-6 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm border border-primary/20 bg-primary/5 backdrop-blur-sm">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-foreground/90">AI-Powered Mental Health Support</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-plus-jakarta tracking-tight">
            <span className="bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">
              About Aura
            </span>
            <br />
            <span className="bg-gradient-to-b from-foreground to-foreground/90 bg-clip-text text-transparent">
              Your Mental Health Companion
            </span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            An AI-powered mental health support application built with Next.js and TypeScript. 
            We provide accessible, 24/7 mental health assistance through advanced conversational AI, 
            featuring intuitive chat interfaces, mood tracking, progress monitoring, and personalized wellness support.
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 px-4 bg-muted/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="text-center border border-primary/10 bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} to-transparent mx-auto mb-3 flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm border border-primary/20 bg-primary/5">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-foreground/80">Our Mission</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
              Transforming Mental Healthcare
            </h2>
            <p className="text-foreground/80 max-w-3xl mx-auto text-lg">
              We believe everyone deserves access to quality mental health support. 
              Our mission is to democratize mental healthcare through innovative AI technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mission.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border border-primary/10 bg-card/30 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {item.title}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm border border-primary/20 bg-primary/5">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-foreground/80">Our Values</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
              What Drives Us
            </h2>
            <p className="text-foreground/80 max-w-2xl mx-auto">
              Our core values guide every decision we make and every feature we build.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="group relative overflow-hidden border border-primary/10 hover:border-primary/20 transition-all duration-300 h-full bg-card/30 backdrop-blur-sm">
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  <CardHeader>
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 w-fit mb-3">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {value.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground/90 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm border border-primary/20 bg-primary/5">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-foreground/80">Advanced Technology</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
              Built with Cutting-Edge AI
            </h2>
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/10 p-8">
              <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                Aura is powered by Google's Gemini 2.0 Flash model, providing sophisticated natural language understanding 
                and generation capabilities. Our multi-agent system coordinates specialized AI therapists to deliver 
                comprehensive mental health support.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="secondary" className="px-3 py-1">Next.js</Badge>
                <Badge variant="secondary" className="px-3 py-1">TypeScript</Badge>
                <Badge variant="secondary" className="px-3 py-1">Gemini 2.0 Flash</Badge>
                <Badge variant="secondary" className="px-3 py-1">Multi-Agent AI</Badge>
                <Badge variant="secondary" className="px-3 py-1">Real-time Processing</Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-16 px-4 bg-muted/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ready to Start Your Mental Health Journey?
            </h2>
            <p className="text-foreground/80 text-lg max-w-2xl mx-auto">
              Join thousands of users who have found support, guidance, and healing through our AI-powered platform.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}