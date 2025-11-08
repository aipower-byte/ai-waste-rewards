import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Code, Server, Palette, Target } from "lucide-react";

const Team = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const team = [
    {
      name: "Sahil",
      role: "AI Lead",
      tagline: "Training models to see green",
      icon: Sparkles,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Pushkar",
      role: "Frontend Lead",
      tagline: "Crafting pixels with purpose",
      icon: Code,
      gradient: "from-secondary to-accent"
    },
    {
      name: "Backend Developer",
      role: "Backend Developer",
      tagline: "Building scalable solutions",
      icon: Server,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Designer",
      role: "Designer",
      tagline: "Making sustainability beautiful",
      icon: Palette,
      gradient: "from-primary to-secondary"
    },
    {
      name: "Product Lead",
      role: "Product & Pitch",
      tagline: "Turning code into climate impact",
      icon: Target,
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built by <span className="text-gradient">Change-Makers</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden hover-scale group"
            >
              <div className={`h-48 bg-gradient-to-br ${member.gradient} flex items-center justify-center relative overflow-hidden`}>
                <member.icon className="w-24 h-24 text-white/80 group-hover:scale-125 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                <p className="text-primary font-semibold mb-3">{member.role}</p>
                <p className="text-muted-foreground italic">"{member.tagline}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
