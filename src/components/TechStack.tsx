import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2 } from "lucide-react";

const TechStack = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const technologies = [
    { name: "React.js", color: "#61DAFB" },
    { name: "Tailwind CSS", color: "#06B6D4" },
    { name: "Node.js", color: "#339933" },
    { name: "MongoDB", color: "#47A248" },
    { name: "TensorFlow", color: "#FF6F00" },
    { name: "Google Vision API", color: "#4285F4" },
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
            Powered by <span className="text-gradient">Modern Tech</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Fast, scalable, and designed for impact
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="glass-card p-8 rounded-xl text-center hover-scale group"
            >
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${tech.color}20` }}
              >
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: tech.color }}
                />
              </div>
              <p className="font-semibold text-lg">{tech.name}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="glass-card p-8 rounded-2xl max-w-4xl mx-auto"
        >
          <div className="flex items-start gap-4">
            <Code2 className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <pre className="text-sm overflow-x-auto">
                <code className="text-muted-foreground">
{`// AI Classification Engine
async function classifyWaste(imageData) {
  const model = await loadModel();
  const prediction = await model.classify(imageData);
  return {
    category: prediction.category,
    confidence: prediction.confidence,
    ecoCredits: calculateRewards(prediction)
  };
}`}
                </code>
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
