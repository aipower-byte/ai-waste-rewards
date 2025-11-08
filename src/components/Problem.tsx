import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { AlertCircle, Frown, TrendingDown } from "lucide-react";
import wasteProblem from "@/assets/waste-problem.jpg";

const Problem = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const problems = [
    {
      icon: AlertCircle,
      title: "Confusing waste categories",
      description: "People don't know where things go"
    },
    {
      icon: Frown,
      title: "No motivation to segregate",
      description: "Why bother if there's no reward?"
    },
    {
      icon: TrendingDown,
      title: "Recyclable materials wasted",
      description: "60% of recyclables end up in landfills"
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The Waste Problem We Choose <span className="text-gradient">Not to See</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <img
              src={wasteProblem}
              alt="Waste Crisis"
              className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-2xl" />
          </motion.div>

          {/* Problems List */}
          <div className="space-y-6">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="glass-card p-6 rounded-xl hover-scale"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <problem.icon className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                    <p className="text-muted-foreground">{problem.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center text-2xl md:text-3xl font-bold mt-16 text-primary"
        >
          Every photo can turn waste into worth.
        </motion.p>
      </div>
    </section>
  );
};

export default Problem;
