import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdminSidebar } from '@/components/AdminSidebar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  BarChart3, 
  Calendar, 
  DollarSign,
  Search,
  Plus,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
}

export default function AdminDashboard() {
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

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'In Progress').length,
    completedProjects: projects.filter(p => p.status === 'Completed').length,
    totalValue: projects.reduce((sum, p) => sum + (p.price || 0), 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning': return 'warning';
      case 'In Progress': return 'default';
      case 'Near Completion': return 'secondary';
      case 'Completed': return 'success';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar className="hidden md:block" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar className="hidden md:block" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Manage your real estate projects</p>
            </div>
            <Link to="/admin/add-project">
              <Button className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProjects}</div>
                <p className="text-xs text-muted-foreground">All projects in portfolio</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeProjects}</div>
                <p className="text-xs text-muted-foreground">Currently in progress</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedProjects}</div>
                <p className="text-xs text-muted-foreground">Successfully delivered</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{(stats.totalValue / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-muted-foreground">Portfolio value</p>
              </CardContent>
            </Card>
          </div>

          {/* Projects Section */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Projects</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredProjects.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No projects found</p>
                  <Link to="/admin/add-project">
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first project
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProjects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-foreground">{project.title}</h3>
                          <Badge variant={getStatusColor(project.status) as any}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{project.location}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          {project.price && (
                            <span>₦{(project.price / 1000000).toFixed(1)}M</span>
                          )}
                          {project.area_sqft && (
                            <span>{project.area_sqft.toLocaleString()} sq ft</span>
                          )}
                          {project.bedrooms && (
                            <span>{project.bedrooms} beds</span>
                          )}
                          {project.bathrooms && (
                            <span>{project.bathrooms} baths</span>
                          )}
                        </div>
                      </div>
                      <Link to={`/admin/projects/${project.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                  {filteredProjects.length > 5 && (
                    <div className="text-center pt-4">
                      <Link to="/admin/projects">
                        <Button variant="outline">
                          View all {filteredProjects.length} projects
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}