import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { migrateProjectsToDatabase } from '@/utils/migrateProjectData';
import { Database, Loader2 } from 'lucide-react';

export function MigrationButton() {
  const [isMigrating, setIsMigrating] = useState(false);
  const { toast } = useToast();

  const handleMigration = async () => {
    setIsMigrating(true);
    try {
      const result = await migrateProjectsToDatabase();
      if (result.success) {
        toast({
          title: "Migration Successful",
          description: "All project data has been migrated to the database",
        });
      } else {
        throw new Error(result.error as string);
      }
    } catch (error: any) {
      toast({
        title: "Migration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <Button 
      onClick={handleMigration} 
      disabled={isMigrating}
      variant="outline"
      className="gap-2"
    >
      {isMigrating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Database className="h-4 w-4" />
      )}
      {isMigrating ? "Migrating..." : "Migrate Static Data"}
    </Button>
  );
}