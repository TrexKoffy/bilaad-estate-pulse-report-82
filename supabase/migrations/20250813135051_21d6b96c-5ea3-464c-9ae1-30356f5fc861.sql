-- Add missing columns to projects table to match projectData.ts structure
ALTER TABLE public.projects 
ADD COLUMN progress integer DEFAULT 0,
ADD COLUMN total_units integer,
ADD COLUMN completed_units integer DEFAULT 0,
ADD COLUMN target_completion text,
ADD COLUMN current_phase text,
ADD COLUMN manager text,
ADD COLUMN start_date text,
ADD COLUMN budget text,
ADD COLUMN target_milestone text,
ADD COLUMN activities_in_progress text[],
ADD COLUMN completed_activities text[],
ADD COLUMN challenges text[],
ADD COLUMN progress_images text[],
ADD COLUMN weekly_notes text,
ADD COLUMN monthly_notes text;

-- Create units table for detailed unit tracking
CREATE TABLE public.units (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  unit_number text NOT NULL,
  unit_type text NOT NULL,
  sub_type text,
  bedrooms integer,
  status text NOT NULL DEFAULT 'in-progress',
  progress integer DEFAULT 0,
  target_completion text,
  current_phase text,
  foundation_status text DEFAULT 'in-progress',
  structure_status text DEFAULT 'in-progress', 
  roofing_status text DEFAULT 'in-progress',
  mep_status text DEFAULT 'in-progress',
  interior_status text DEFAULT 'in-progress',
  finishing_status text DEFAULT 'in-progress',
  unit_challenges text[],
  photos text[],
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on units table
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Create policies for units table
CREATE POLICY "Authenticated users can view units" 
ON public.units 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert units" 
ON public.units 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins and editors can update units" 
ON public.units 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins can delete units" 
ON public.units 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for units timestamp updates
CREATE TRIGGER update_units_updated_at
BEFORE UPDATE ON public.units
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();