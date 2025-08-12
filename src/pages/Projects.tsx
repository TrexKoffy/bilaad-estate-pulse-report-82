import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Square, 
  Bed, 
  Bath,
  Search,
  Calendar
} from 'lucide-react';

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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Planning': return 'bg-warning';
    case 'In Progress': return 'bg-primary';
    case 'Near Completion': return 'bg-secondary';
    case 'Completed': return 'bg-success';
    default: return 'bg-muted';
  }
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch projects: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `₦${(price / 1000).toFixed(0)}K`;
    }
    return `₦${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-foreground">BILAAD Estate Projects</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our portfolio of premium real estate developments across Nigeria
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Card className="border-0 shadow-card">
            <CardContent className="py-16">
              <div className="text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No projects found</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-elevation transition-all duration-300 border-0 shadow-card">
                {project.images && project.images.length > 0 && (
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img 
                      src={project.images[0]} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
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

                  <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                    <Calendar className="h-3 w-3" />
                    Added {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}