import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UnitCard from "@/components/UnitCard";
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  DollarSign, 
  MapPin, 
  User, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Camera,
  FileText,
  Edit3,
  Save,
  Home
} from "lucide-react";
import realEstateHeaderBg from "@/assets/real-estate-header-bg.jpg";

interface Unit {
  id: string;
  unit_number: string;
  unit_type: string;
  sub_type?: string;
  bedrooms?: number;
  status: string;
  progress: number;
  target_completion?: string;
  current_phase?: string;
  foundation_status: string;
  structure_status: string;
  roofing_status: string;
  mep_status: string;
  interior_status: string;
  finishing_status: string;
  unit_challenges: string[];
  photos: string[];
  last_updated: string;
}

interface Project {
  id: string;
  title: string;
  location: string;
  status: string;
  description?: string;
  progress: number;
  total_units: number;
  completed_units: number;
  target_completion: string;
  current_phase: string;
  manager: string;
  start_date: string;
  budget: string;
  target_milestone: string;
  activities_in_progress: string[];
  completed_activities: string[];
  challenges: string[];
  progress_images: string[];
  weekly_notes: string;
  monthly_notes: string;
  units?: Unit[];
}

export default function ProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [editableNotes, setEditableNotes] = useState({
    weekly: "",
    monthly: "",
    targetMilestone: ""
  });

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    if (!projectId) return;
    
    try {
      // Fetch project data
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;

      // Fetch units data
      const { data: unitsData, error: unitsError } = await supabase
        .from('units')
        .select('*')
        .eq('project_id', projectId);

      if (unitsError) throw unitsError;

      const fullProject = {
        ...projectData,
        units: unitsData || []
      };

      setProject(fullProject);
      setEditableNotes({
        weekly: projectData.weekly_notes || "",
        monthly: projectData.monthly_notes || "",
        targetMilestone: projectData.target_milestone || ""
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch project data: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="border-0 shadow-card">
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="border-0 shadow-card">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
            <Link to="/">
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusColors = {
    'Planning': 'bg-warning text-warning-foreground',
    'In Progress': 'bg-primary text-primary-foreground',
    'Near Completion': 'bg-secondary text-secondary-foreground',
    'Completed': 'bg-success text-success-foreground'
  };

  const statusLabels = {
    'Planning': 'Planning',
    'In Progress': 'In Progress',
    'Near Completion': 'Near Completion',
    'Completed': 'Completed'
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          weekly_notes: editableNotes.weekly,
          monthly_notes: editableNotes.monthly,
          target_milestone: editableNotes.targetMilestone,
        })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Project notes updated successfully",
      });

      setIsEditing(false);
      fetchProjectData(); // Refresh data
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save changes: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${realEstateHeaderBg})`
        }}
      >
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3 drop-shadow-lg">
                  <Building2 className="h-8 w-8" />
                  {project.title} Estate
                </h1>
                <p className="text-white/80 text-lg drop-shadow-md">Project Management Details</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={`${statusColors[project.status as keyof typeof statusColors]} border-0 text-base px-4 py-2 shadow-lg`}>
                {statusLabels[project.status as keyof typeof statusLabels]}
              </Badge>
              <Button 
                variant={isEditing ? "default" : "outline"}
                className={isEditing ? "bg-primary text-primary-foreground shadow-lg" : "bg-white/10 border-white/20 text-white hover:bg-white/20 shadow-lg"}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
              >
                {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                {isEditing ? "Save Changes" : "Edit Report"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Progress</p>
                  <p className="text-3xl font-bold text-primary">{project.progress}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <Progress value={project.progress} className="mt-4" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Units</p>
                  <p className="text-3xl font-bold text-secondary">{project.completed_units}/{project.total_units}</p>
                </div>
                <Building2 className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Budget</p>
                  <p className="text-3xl font-bold text-accent">{project.budget}</p>
                </div>
                <DollarSign className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Target Date</p>
                  <p className="text-2xl font-bold">{project.target_completion}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4" />
                      Location
                    </div>
                    <p className="font-medium">{project.location}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                      <User className="h-4 w-4" />
                      Project Manager
                    </div>
                    <p className="font-medium">{project.manager}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      Start Date
                    </div>
                    <p className="font-medium">{project.start_date}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                      <TrendingUp className="h-4 w-4" />
                      Current Phase
                    </div>
                    <p className="font-medium">{project.current_phase}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                      <Building2 className="h-4 w-4" />
                      Total Units
                    </div>
                    <p className="font-medium">{project.total_units} residential units</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                      <DollarSign className="h-4 w-4" />
                      Project Budget
                    </div>
                    <p className="font-medium">{project.budget}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Target Milestone
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editableNotes.targetMilestone}
                  onChange={(e) => setEditableNotes(prev => ({ ...prev, targetMilestone: e.target.value }))}
                  placeholder="Enter target milestone for this month..."
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-sm leading-relaxed">{project.target_milestone}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="units" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="units">Units</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="units" className="space-y-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Individual Unit Reports
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Detailed progress tracking for each residential unit
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.units?.map((unit) => (
                    <UnitCard key={unit.id} unit={{
                      id: unit.id,
                      unitNumber: unit.unit_number,
                      type: unit.unit_type as any,
                      subType: unit.sub_type as any,
                      bedrooms: unit.bedrooms,
                      status: unit.status as any,
                      progress: unit.progress,
                      targetCompletion: unit.target_completion || '',
                      currentPhase: unit.current_phase || '',
                      activities: {
                        foundation: unit.foundation_status as any,
                        structure: unit.structure_status as any,
                        roofing: unit.roofing_status as any,
                        mep: unit.mep_status as any,
                        interior: unit.interior_status as any,
                        finishing: unit.finishing_status as any,
                      },
                      challenges: unit.unit_challenges,
                      photos: unit.photos,
                      lastUpdated: new Date(unit.last_updated).toLocaleDateString()
                    }} />
                  ))}
                </div>
                
                {/* Quick Actions */}
                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      onClick={() => {
                        const unitData = {
                          projectName: project.title,
                          units: project.units,
                          exportDate: new Date().toISOString(),
                          totalUnits: project.units?.length || 0
                        };
                        const dataStr = JSON.stringify(unitData, null, 2);
                        const dataBlob = new Blob([dataStr], {type: 'application/json'});
                        const url = URL.createObjectURL(dataBlob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `${project.title}_unit_reports_${new Date().toISOString().split('T')[0]}.json`;
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export Unit Reports
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        // In a real app, this would open a calendar/scheduling modal
                        alert('Schedule Review Meeting feature would open a calendar here');
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Review Meeting
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-secondary">
                    <CheckCircle className="h-5 w-5" />
                    Completed Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.completed_activities?.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{activity}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Clock className="h-5 w-5" />
                    Activities in Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.activities_in_progress?.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{activity}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="challenges">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="h-5 w-5" />
                  Project Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.challenges && project.challenges.length > 0 ? (
                    project.challenges.map((challenge, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-warning/5 border border-warning/20 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{challenge}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No current challenges reported.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-accent" />
                  Progress Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                
                {uploadedPhotos.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {uploadedPhotos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Progress photo ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg border border-border"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
                              URL.revokeObjectURL(photo);
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="text-center">
                      <Button 
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Upload More Photos
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No progress photos uploaded yet.</p>
                    <Button 
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Photos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Weekly Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={editableNotes.weekly}
                      onChange={(e) => setEditableNotes(prev => ({ ...prev, weekly: e.target.value }))}
                      placeholder="Enter weekly progress notes..."
                      className="min-h-[150px]"
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{project.weekly_notes}</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Monthly Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={editableNotes.monthly}
                      onChange={(e) => setEditableNotes(prev => ({ ...prev, monthly: e.target.value }))}
                      placeholder="Enter monthly summary notes..."
                      className="min-h-[150px]"
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{project.monthly_notes}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}