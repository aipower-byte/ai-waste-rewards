import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">EcoSnap</h3>
            <p className="text-primary-foreground/80">
              Turning everyday waste into global impact through AI, gamification, and sustainability.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-secondary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Team</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-3 bg-primary-foreground/10 rounded-full hover:bg-secondary hover:text-primary transition-all hover-scale"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-primary-foreground/10 rounded-full hover:bg-secondary hover:text-primary transition-all hover-scale"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-primary-foreground/10 rounded-full hover:bg-secondary hover:text-primary transition-all hover-scale"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60">
          <p>© 2025 EcoSnap. Built with 💚 for the planet. Hackathon Project.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
