import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import Features from "@/components/Features";
import TechStack from "@/components/TechStack";
import Impact from "@/components/Impact";
import Team from "@/components/Team";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <TechStack />
      <Impact />
      <Team />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
