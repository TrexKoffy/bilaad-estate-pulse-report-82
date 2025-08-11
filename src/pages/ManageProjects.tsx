import { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Plus,
  ArrowUpDown
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
  images?: string[];
}

export default function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, [sortBy, sortOrder]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order(sortBy, { ascending: sortOrder === 'asc' });

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

  const handleDelete = async (projectId: string, projectTitle: string) => {
    try {
      // Delete images from storage if they exist
      const project = projects.find(p => p.id === projectId);
      if (project?.images && project.images.length > 0) {
        for (const imageUrl of project.images) {
          const fileName = imageUrl.split('/').pop();
          if (fileName) {
            await supabase.storage
              .from('project-images')
              .remove([fileName]);
          }
        }
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast({
        title: "Project deleted",
        description: `${projectTitle} has been successfully deleted.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete project: " + error.message,
        variant: "destructive",
      });
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning': return 'warning';
      case 'In Progress': return 'default';
      case 'Near Completion': return 'secondary';
      case 'Completed': return 'success';
      default: return 'outline';
    }
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar className="hidden md:block" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading projects...</p>
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
              <h1 className="text-3xl font-bold text-foreground">Manage Projects</h1>
              <p className="text-muted-foreground">View, edit, and manage all your projects</p>
            </div>
            <Link to="/admin/add-project">
              <Button className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filters & Search</span>
                </CardTitle>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Near Completion">Near Completion</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Projects Table */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle>
                Projects ({filteredProjects.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredProjects.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">
                    {projects.length === 0 ? 'No projects found.' : 'No projects match your search criteria.'}
                  </div>
                  {projects.length === 0 && (
                    <Link to="/admin/add-project">
                      <Button className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Create your first project
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-2">
                          <Button
                            variant="ghost"
                            onClick={() => toggleSort('title')}
                            className="h-auto p-0 font-semibold"
                          >
                            Title
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </th>
                        <th className="text-left p-2">
                          <Button
                            variant="ghost"
                            onClick={() => toggleSort('location')}
                            className="h-auto p-0 font-semibold"
                          >
                            Location
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </th>
                        <th className="text-left p-2">
                          <Button
                            variant="ghost"
                            onClick={() => toggleSort('status')}
                            className="h-auto p-0 font-semibold"
                          >
                            Status
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </th>
                        <th className="text-left p-2">
                          <Button
                            variant="ghost"
                            onClick={() => toggleSort('price')}
                            className="h-auto p-0 font-semibold"
                          >
                            Price
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </th>
                        <th className="text-left p-2">
                          <Button
                            variant="ghost"
                            onClick={() => toggleSort('created_at')}
                            className="h-auto p-0 font-semibold"
                          >
                            Created
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </th>
                        <th className="text-left p-2 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project) => (
                        <tr key={project.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-2">
                            <div>
                              <div className="font-medium">{project.title}</div>
                              {project.description && (
                                <div className="text-xs text-muted-foreground truncate max-w-xs">
                                  {project.description}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-2 text-sm">{project.location}</td>
                          <td className="p-2">
                            <Badge variant={getStatusColor(project.status) as any}>
                              {project.status}
                            </Badge>
                          </td>
                          <td className="p-2 text-sm">
                            {project.price ? `₦${(project.price / 1000000).toFixed(1)}M` : 'N/A'}
                          </td>
                          <td className="p-2 text-sm">
                            {new Date(project.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-2">
                            <div className="flex items-center space-x-2">
                              <Link to={`/admin/projects/${project.id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link to={`/admin/projects/${project.id}/edit`}>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4 text-destructive" />
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
                                    <AlertDialogAction
                                      onClick={() => handleDelete(project.id, project.title)}
                                      className="bg-destructive hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}