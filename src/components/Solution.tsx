import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Brain, Recycle, Coins, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Solution = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();

  const workflow = [
    { icon: Camera, label: "Snap Photo", color: "text-blue-500" },
    { icon: Brain, label: "AI Classifies", color: "text-purple-500" },
    { icon: Recycle, label: "Sort Waste", color: "text-primary" },
    { icon: Coins, label: "Earn Credits", color: "text-secondary" },
    { icon: BarChart3, label: "Track Impact", color: "text-accent" },
  ];

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meet <span className="text-gradient">EcoSnap</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your AI Sustainability Partner
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Phone Mockup Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative glass-card p-8 rounded-3xl aspect-[9/16] max-w-sm mx-auto flex items-center justify-center hover-scale">
              <div className="text-center">
                <Camera className="w-24 h-24 text-primary mx-auto mb-4 animate-pulse" />
                <p className="text-lg font-semibold">Interactive Demo</p>
                <p className="text-sm text-muted-foreground mt-2">Click to try waste classification</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Description */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-3xl font-bold mb-6">
              Making waste segregation simple, smart, and rewarding
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              EcoSnap makes waste segregation simple, smart, and rewarding. Snap a photo, 
              let AI classify your waste, and earn EcoCredits for every correct disposal.
            </p>
            <Button 
              size="lg" 
              className="hover-scale glow"
              onClick={() => navigate("/auth")}
            >
              Try Live Demo
            </Button>
          </motion.div>
        </div>

        {/* Workflow */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent -z-10" />
            
            {workflow.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="flex flex-col items-center text-center relative z-10"
              >
                <div className={`glass-card p-6 rounded-2xl mb-4 hover-scale ${step.color}`}>
                  <step.icon className="w-12 h-12" />
                </div>
                <p className="font-semibold text-sm">{step.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Solution;
