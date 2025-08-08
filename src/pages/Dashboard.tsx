import { useState } from "react";
import { DashboardStats } from "@/components/DashboardStats";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProjects } from "@/lib/projectData";
import { FileText, Calendar, Download, Filter, Search, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import bilaadHeader from "@/assets/bilaad-header.jpg";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingDescription, setMeetingDescription] = useState("");
  const [reportType, setReportType] = useState("");
  const [reportDateRange, setReportDateRange] = useState("");
  const [reportNotes, setReportNotes] = useState("");
  const { toast } = useToast();

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const generateReport = (type: 'weekly' | 'monthly') => {
    toast({
      title: "Report Generated",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} report is being downloaded...`,
    });
    
    // Simulate file download
    const reportData = {
      type,
      projects: filteredProjects.length,
      generated: new Date().toISOString(),
      data: mockProjects
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bilaad-${type}-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAllReports = () => {
    toast({
      title: "Exporting All Reports",
      description: "Comprehensive project report is being generated...",
    });
    
    const allReportsData = {
      summary: {
        totalProjects: mockProjects.length,
        byStatus: {
          planning: mockProjects.filter(p => p.status === 'planning').length,
          inProgress: mockProjects.filter(p => p.status === 'in-progress').length,
          nearCompletion: mockProjects.filter(p => p.status === 'near-completion').length,
        },
        totalBudget: mockProjects.reduce((sum, p) => sum + parseFloat(p.budget.replace('₦', '').replace('B', '')), 0),
        totalUnits: mockProjects.reduce((sum, p) => sum + p.totalUnits, 0),
      },
      projects: mockProjects,
      generated: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(allReportsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bilaad-comprehensive-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const scheduleMeeting = () => {
    if (!meetingDate || !meetingTime || !meetingDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all meeting details.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Meeting Scheduled",
      description: `Review meeting scheduled for ${meetingDate} at ${meetingTime}`,
    });

    // Reset form
    setMeetingDate("");
    setMeetingTime("");
    setMeetingDescription("");
  };

  const createCustomReport = () => {
    if (!reportType || !reportDateRange) {
      toast({
        title: "Missing Information",
        description: "Please select report type and date range.",
        variant: "destructive",
      });
      return;
    }

    const customReportData = {
      type: reportType,
      dateRange: reportDateRange,
      notes: reportNotes,
      projects: mockProjects.filter(project => {
        // Filter based on report type and date range
        return true; // Simplified for demo
      }),
      generated: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(customReportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bilaad-custom-${reportType}-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Custom Report Created",
      description: `${reportType} report for ${reportDateRange} has been generated.`,
    });

    // Reset form
    setReportType("");
    setReportDateRange("");
    setReportNotes("");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="relative h-32 bg-gradient-primary overflow-hidden">
        <img 
          src={bilaadHeader} 
          alt="BILAAD Real Estate" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">BILAAD</h1>
              <p className="text-white/90 text-lg">Project Management Dashboard</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => generateReport('weekly')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Weekly Report
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => generateReport('monthly')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Monthly Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Stats Overview */}
        <DashboardStats projects={mockProjects} />

        {/* Filters and Search */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Project Portfolio
              </CardTitle>
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === "planning" ? "warning" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("planning")}
                  >
                    Planning
                  </Button>
                  <Button
                    variant={statusFilter === "in-progress" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("in-progress")}
                  >
                    In Progress
                  </Button>
                  <Button
                    variant={statusFilter === "near-completion" ? "success" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("near-completion")}
                  >
                    Near Completion
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card className="border-0 shadow-card">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No projects found matching your criteria.</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="premium" size="lg" onClick={exportAllReports}>
                <Download className="h-4 w-4 mr-2" />
                Export All Reports
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Review Meeting
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Schedule Review Meeting</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="time" className="text-right">
                        Time
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={meetingTime}
                        onChange={(e) => setMeetingTime(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Meeting agenda and details..."
                        value={meetingDescription}
                        onChange={(e) => setMeetingDescription(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={scheduleMeeting}>
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Custom Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create Custom Report</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="reportType" className="text-right">
                        Report Type
                      </Label>
                      <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="progress">Progress Report</SelectItem>
                          <SelectItem value="financial">Financial Report</SelectItem>
                          <SelectItem value="status">Status Report</SelectItem>
                          <SelectItem value="milestone">Milestone Report</SelectItem>
                          <SelectItem value="quality">Quality Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="dateRange" className="text-right">
                        Date Range
                      </Label>
                      <Select value={reportDateRange} onValueChange={setReportDateRange}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="last-week">Last Week</SelectItem>
                          <SelectItem value="last-month">Last Month</SelectItem>
                          <SelectItem value="last-quarter">Last Quarter</SelectItem>
                          <SelectItem value="ytd">Year to Date</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="notes" className="text-right">
                        Notes
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Additional notes or requirements..."
                        value={reportNotes}
                        onChange={(e) => setReportNotes(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={createCustomReport}>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}