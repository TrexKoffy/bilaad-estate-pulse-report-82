import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, Users, Shield } from "lucide-react";
import bilaadLogo from "@/assets/bilaad-realty-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <img 
            src={bilaadLogo} 
            alt="BILAAD Realty" 
            className="h-20 mx-auto"
          />
          <h1 className="text-4xl font-bold text-foreground">BILAAD Real Estate</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional real estate project management and dashboard system
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center space-y-3 p-6 bg-card rounded-lg border shadow-card">
            <Building2 className="h-10 w-10 text-primary mx-auto" />
            <h3 className="text-lg font-semibold">Project Management</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive project tracking and management tools
            </p>
          </div>
          
          <div className="text-center space-y-3 p-6 bg-card rounded-lg border shadow-card">
            <Users className="h-10 w-10 text-primary mx-auto" />
            <h3 className="text-lg font-semibold">Team Collaboration</h3>
            <p className="text-sm text-muted-foreground">
              Seamless team communication and progress tracking
            </p>
          </div>
          
          <div className="text-center space-y-3 p-6 bg-card rounded-lg border shadow-card">
            <Shield className="h-10 w-10 text-primary mx-auto" />
            <h3 className="text-lg font-semibold">Secure Access</h3>
            <p className="text-sm text-muted-foreground">
              Role-based access control and data security
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/admin">
              <Button size="lg" className="bg-gradient-primary">
                Access Admin Dashboard
              </Button>
            </Link>
            <Link to="/projects">
              <Button variant="outline" size="lg">
                View Projects
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            Admin access requires authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
