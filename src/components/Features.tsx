import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Eye, Award, QrCode, LayoutDashboard } from "lucide-react";

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Eye,
      title: "AI Image Recognition",
      description: "Real-time waste classification powered by advanced machine learning models",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Award,
      title: "EcoCredits System",
      description: "Earn rewards for every proper disposal and track your environmental impact",
      gradient: "from-secondary to-accent"
    },
    {
      icon: QrCode,
      title: "QR Verification",
      description: "Ensures accountability with scannable codes for waste disposal confirmation",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: LayoutDashboard,
      title: "Admin Dashboard",
      description: "Real-time analytics for campuses and cities to track waste management",
      gradient: "from-primary to-secondary"
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
            Why <span className="text-gradient">EcoSnap Works</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="glass-card p-8 rounded-2xl hover-scale group cursor-pointer"
            >
              <div className={`inline-block p-4 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground text-lg">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
