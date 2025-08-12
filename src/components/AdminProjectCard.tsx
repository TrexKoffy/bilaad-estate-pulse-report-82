import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Square, 
  Bed, 
  Bath, 
  Edit, 
  Trash2, 
  Eye 
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Project {
  id: string;
  title: string;
  location: string;
  status: string;
  price: number;
  created_at: string;
  description?: string;
  area_sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  images?: string[];
}

interface AdminProjectCardProps {
  project: Project;
  onProjectDeleted: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Planning': return 'bg-warning';
    case 'In Progress': return 'bg-primary';
    case 'Near Completion': return 'bg-secondary';
    case 'Completed': return 'bg-success';
    default: return 'bg-muted';
  }
};

export function AdminProjectCard({ project, onProjectDeleted }: AdminProjectCardProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      
      onProjectDeleted();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete project: " + error.message,
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `₦${(price / 1000).toFixed(0)}K`;
    }
    return `₦${price.toLocaleString()}`;
  };

  return (
    <Card className="hover:shadow-elevation transition-all duration-300 border-0 shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              {project.title}
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {project.location}
            </div>
          </div>
          <Badge className={`${getStatusColor(project.status)} text-white border-0`}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              Price
            </div>
            <p className="text-sm font-medium">
              {formatPrice(project.price)}
            </p>
          </div>
          
          {project.area_sqft && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Square className="h-3 w-3" />
                Area
              </div>
              <p className="text-sm font-medium">{project.area_sqft.toLocaleString()} sq ft</p>
            </div>
          )}
        </div>

        {(project.bedrooms || project.bathrooms) && (
          <div className="flex items-center gap-4 text-sm">
            {project.bedrooms && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Bed className="h-3 w-3" />
                {project.bedrooms} beds
              </div>
            )}
            {project.bathrooms && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Bath className="h-3 w-3" />
                {project.bathrooms} baths
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Link to={`/admin/projects/${project.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </Link>
          
          <Link to={`/admin/edit-project/${project.id}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex-1">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{project.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}