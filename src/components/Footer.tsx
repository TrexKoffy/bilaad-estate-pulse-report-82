import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/company/bilaad-realty-nigeria-ltd/mycompany/"
    },
    {
      name: "Facebook", 
      icon: Facebook,
      url: "https://www.facebook.com/share/kK5KXDXFec6KVmhu/?mibextid=qi2Omg"
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/bilaadrealty?igsh=bTltbDh2Y2VpdmRz"
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://x.com/BilaadRealty?t=AtexiTuf2OF_yZq1U6Ctcw&s=08"
    }
  ];

  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-accent">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 text-accent flex-shrink-0" />
                <p className="text-sm">
                  No 47 ML Wushishi Crescent Utako Abuja, Adjacent CBN Quarters
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <a 
                  href="mailto:info@bilaadprojects.com" 
                  className="text-sm hover:text-accent transition-colors"
                >
                  info@bilaadprojects.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <a 
                  href="tel:07002222111" 
                  className="text-sm hover:text-accent transition-colors"
                >
                  0700 222 2111
                </a>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-accent">Follow Us</h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center hover:bg-accent/30 transition-colors group"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-accent">BILAAD Realty</h3>
            <p className="text-sm opacity-90">
              Leading real estate development company providing quality housing solutions and project management services across Nigeria.
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center">
          <p className="text-sm opacity-75">
            © {new Date().getFullYear()} BILAAD Realty Nigeria Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;