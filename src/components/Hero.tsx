import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Sparkles, Leaf, Cpu } from "lucide-react";
import heroMockup from "@/assets/hero-mockup.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const floatingIcons = [
    { Icon: Camera, delay: 0, position: "top-20 left-10" },
    { Icon: Sparkles, delay: 0.2, position: "top-40 right-20" },
    { Icon: Leaf, delay: 0.4, position: "bottom-32 left-20" },
    { Icon: Cpu, delay: 0.6, position: "bottom-20 right-10" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-background to-secondary/20 animate-gradient" />
      
      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, position }, index) => (
        <motion.div
          key={index}
          className={`absolute ${position} opacity-20`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.2, y: [0, -20, 0] }}
          transition={{
            opacity: { delay, duration: 0.6 },
            y: { delay: delay + 0.6, duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Icon className="w-12 h-12 text-primary" />
        </motion.div>
      ))}

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="text-gradient">Snap. Sort.</span>
              <br />
              <span className="text-foreground">Save the Planet.</span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              EcoSnap uses AI to classify waste instantly and reward you for sustainable action.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button 
                size="lg" 
                className="text-lg px-8 hover-scale glow"
                onClick={() => navigate("/auth")}
              >
                Try Demo
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 hover-scale"
                onClick={() => window.open("https://github.com", "_blank")}
              >
                View GitHub
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative animate-float">
              <img
                src={heroMockup}
                alt="EcoSnap App Interface"
                className="rounded-2xl shadow-2xl hover-scale"
              />
              <div className="absolute -bottom-4 -right-4 glass-card p-4 rounded-xl">
                <p className="text-sm font-semibold text-primary">+250 EcoCredits</p>
                <p className="text-xs text-muted-foreground">Earned Today</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
