import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';

interface FormData {
  title: string;
  location: string;
  description: string;
  price: string;
  status: string;
  area_sqft: string;
  bedrooms: string;
  bathrooms: string;
  amenities: string;
}

export default function AddProject() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    location: '',
    description: '',
    price: '',
    status: '',
    area_sqft: '',
    bedrooms: '',
    bathrooms: '',
    amenities: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Limit to 10 images
    const totalImages = selectedImages.length + files.length;
    if (totalImages > 10) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 10 images per project.",
        variant: "destructive",
      });
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file.`,
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...validFiles]);
      
      // Create previews
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (projectId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < selectedImages.length; i++) {
      const file = selectedImages[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectId}-${Date.now()}-${i}.${fileExt}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      } catch (error: any) {
        console.error('Error uploading image:', error);
        toast({
          title: "Image upload failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.location || !formData.status) {
      toast({
        title: "Missing required fields",
        description: "Please fill in title, location, and status.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse amenities
      const amenitiesArray = formData.amenities
        ? formData.amenities.split(',').map(a => a.trim()).filter(a => a)
        : [];

      // Create project data
      const projectData = {
        title: formData.title,
        location: formData.location,
        description: formData.description || null,
        price: formData.price ? parseFloat(formData.price) : null,
        status: formData.status as "Planning" | "In Progress" | "Completed" | "Near Completion",
        area_sqft: formData.area_sqft ? parseInt(formData.area_sqft) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        amenities: amenitiesArray.length > 0 ? amenitiesArray : null,
        images: null, // Will be updated after image upload
      };

      // Insert project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (projectError) throw projectError;

      // Upload images if any
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        imageUrls = await uploadImages(project.id);
        
        // Update project with image URLs
        if (imageUrls.length > 0) {
          const { error: updateError } = await supabase
            .from('projects')
            .update({ images: imageUrls })
            .eq('id', project.id);

          if (updateError) throw updateError;
        }
      }

      toast({
        title: "Project created successfully!",
        description: `${formData.title} has been added to your portfolio.`,
      });

      navigate('/admin/projects');
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Failed to create project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar className="hidden md:block" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Add New Project</h1>
              <p className="text-muted-foreground">Create a new real estate project</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter project title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Enter project location"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter project description"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Near Completion">Near Completion</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Project Details */}
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₦)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="Enter project price"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area_sqft">Area (sq ft)</Label>
                    <Input
                      id="area_sqft"
                      type="number"
                      value={formData.area_sqft}
                      onChange={(e) => handleInputChange('area_sqft', e.target.value)}
                      placeholder="Enter area in square feet"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                        placeholder="Number of bedrooms"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                        placeholder="Number of bathrooms"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amenities">Amenities</Label>
                    <Textarea
                      id="amenities"
                      value={formData.amenities}
                      onChange={(e) => handleInputChange('amenities', e.target.value)}
                      placeholder="Enter amenities separated by commas (e.g., Swimming Pool, Gym, Garden)"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Image Upload */}
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Project Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Click to upload images</p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF up to 5MB each (max 10 images)
                      </p>
                    </div>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/admin')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-primary"
              >
                {isSubmitting ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}