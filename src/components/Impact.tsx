import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const Impact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const metrics = [
    { value: 85, label: "Classification Accuracy", suffix: "%" },
    { value: 60, label: "Increase in Correct Segregation", suffix: "%" },
    { value: 40, label: "Landfill Reduction", suffix: "%" },
  ];

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,224,99,0.1),transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-gradient">Vision</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="glass-card p-8 rounded-2xl text-center hover-scale"
            >
              <CountUpMetric
                end={metric.value}
                suffix={metric.suffix}
                isInView={isInView}
                delay={0.5 + index * 0.2}
              />
              <p className="text-muted-foreground text-lg mt-4">{metric.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center text-2xl md:text-3xl font-bold text-primary max-w-3xl mx-auto"
        >
          EcoSnap doesn't just track waste — it transforms behavior.
        </motion.p>
      </div>
    </section>
  );
};

const CountUpMetric = ({ 
  end, 
  suffix, 
  isInView, 
  delay 
}: { 
  end: number; 
  suffix: string; 
  isInView: boolean; 
  delay: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = end / steps;
      let current = 0;

      const counter = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(counter);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isInView, end, delay]);

  return (
    <div className="text-5xl md:text-6xl font-bold text-gradient">
      {count}{suffix}
    </div>
  );
};

export default Impact;
