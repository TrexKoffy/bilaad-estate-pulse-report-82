import { supabase } from '@/integrations/supabase/client';
import { mockProjects } from '@/lib/projectData';

export async function migrateProjectsToDatabase() {
  try {
    console.log('Starting project data migration...');
    
    for (const project of mockProjects) {
      // Insert project
      const { data: insertedProject, error: projectError } = await supabase
        .from('projects')
        .upsert({
          id: project.id,
          title: project.name,
          location: project.location,
          status: project.status === 'near-completion' ? 'Near Completion' : 
                  project.status === 'in-progress' ? 'In Progress' : 
                  project.status === 'completed' ? 'Completed' : 'Planning',
          description: `${project.name} Estate Development Project`,
          progress: project.progress,
          total_units: project.totalUnits,
          completed_units: project.completedUnits,
          target_completion: project.targetCompletion,
          current_phase: project.currentPhase,
          manager: project.manager,
          start_date: project.startDate,
          budget: project.budget,
          target_milestone: project.targetMilestone,
          activities_in_progress: project.activitiesInProgress,
          completed_activities: project.completedActivities,
          challenges: project.challenges,
          progress_images: project.progressImages,
          weekly_notes: project.weeklyNotes,
          monthly_notes: project.monthlyNotes,
          price: extractPriceFromBudget(project.budget),
          area_sqft: 5000, // Default area
          bedrooms: 3, // Default bedrooms
          bathrooms: 2, // Default bathrooms
        }, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (projectError) {
        console.error(`Error inserting project ${project.name}:`, projectError);
        continue;
      }

      console.log(`Migrated project: ${project.name}`);

      // Insert units for this project
      const unitsToInsert = project.units.map(unit => ({
        id: unit.id,
        project_id: project.id,
        unit_number: unit.unitNumber,
        unit_type: unit.type,
        sub_type: unit.subType,
        bedrooms: unit.bedrooms,
        status: unit.status,
        progress: unit.progress,
        target_completion: unit.targetCompletion,
        current_phase: unit.currentPhase,
        foundation_status: unit.activities.foundation,
        structure_status: unit.activities.structure,
        roofing_status: unit.activities.roofing,
        mep_status: unit.activities.mep,
        interior_status: unit.activities.interior,
        finishing_status: unit.activities.finishing,
        unit_challenges: unit.challenges,
        photos: unit.photos,
        last_updated: new Date(unit.lastUpdated).toISOString(),
      }));

      const { error: unitsError } = await supabase
        .from('units')
        .upsert(unitsToInsert, {
          onConflict: 'id'
        });

      if (unitsError) {
        console.error(`Error inserting units for project ${project.name}:`, unitsError);
      } else {
        console.log(`Migrated ${unitsToInsert.length} units for ${project.name}`);
      }
    }

    console.log('Project data migration completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
}

function extractPriceFromBudget(budget: string): number {
  // Extract numeric value from budget string like "₦2.5B" or "₦18.5B"
  const match = budget.match(/₦(\d+\.?\d*)([BM]?)/);
  if (match) {
    const value = parseFloat(match[1]);
    const unit = match[2];
    if (unit === 'B') return value * 1000000000; // Billions
    if (unit === 'M') return value * 1000000; // Millions
    return value;
  }
  return 0;
}