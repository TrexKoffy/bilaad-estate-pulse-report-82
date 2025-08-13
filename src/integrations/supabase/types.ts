export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          activities_in_progress: string[] | null
          amenities: string[] | null
          area_sqft: number | null
          bathrooms: number | null
          bedrooms: number | null
          budget: string | null
          challenges: string[] | null
          completed_activities: string[] | null
          completed_units: number | null
          created_at: string
          created_by: string | null
          current_phase: string | null
          description: string | null
          id: string
          images: string[] | null
          location: string
          manager: string | null
          monthly_notes: string | null
          price: number | null
          progress: number | null
          progress_images: string[] | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          target_completion: string | null
          target_milestone: string | null
          title: string
          total_units: number | null
          updated_at: string
          weekly_notes: string | null
        }
        Insert: {
          activities_in_progress?: string[] | null
          amenities?: string[] | null
          area_sqft?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          budget?: string | null
          challenges?: string[] | null
          completed_activities?: string[] | null
          completed_units?: number | null
          created_at?: string
          created_by?: string | null
          current_phase?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          location: string
          manager?: string | null
          monthly_notes?: string | null
          price?: number | null
          progress?: number | null
          progress_images?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          target_completion?: string | null
          target_milestone?: string | null
          title: string
          total_units?: number | null
          updated_at?: string
          weekly_notes?: string | null
        }
        Update: {
          activities_in_progress?: string[] | null
          amenities?: string[] | null
          area_sqft?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          budget?: string | null
          challenges?: string[] | null
          completed_activities?: string[] | null
          completed_units?: number | null
          created_at?: string
          created_by?: string | null
          current_phase?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          location?: string
          manager?: string | null
          monthly_notes?: string | null
          price?: number | null
          progress?: number | null
          progress_images?: string[] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          target_completion?: string | null
          target_milestone?: string | null
          title?: string
          total_units?: number | null
          updated_at?: string
          weekly_notes?: string | null
        }
        Relationships: []
      }
      units: {
        Row: {
          bedrooms: number | null
          created_at: string | null
          current_phase: string | null
          finishing_status: string | null
          foundation_status: string | null
          id: string
          interior_status: string | null
          last_updated: string | null
          mep_status: string | null
          photos: string[] | null
          progress: number | null
          project_id: string | null
          roofing_status: string | null
          status: string
          structure_status: string | null
          sub_type: string | null
          target_completion: string | null
          unit_challenges: string[] | null
          unit_number: string
          unit_type: string
          updated_at: string | null
        }
        Insert: {
          bedrooms?: number | null
          created_at?: string | null
          current_phase?: string | null
          finishing_status?: string | null
          foundation_status?: string | null
          id?: string
          interior_status?: string | null
          last_updated?: string | null
          mep_status?: string | null
          photos?: string[] | null
          progress?: number | null
          project_id?: string | null
          roofing_status?: string | null
          status?: string
          structure_status?: string | null
          sub_type?: string | null
          target_completion?: string | null
          unit_challenges?: string[] | null
          unit_number: string
          unit_type: string
          updated_at?: string | null
        }
        Update: {
          bedrooms?: number | null
          created_at?: string | null
          current_phase?: string | null
          finishing_status?: string | null
          foundation_status?: string | null
          id?: string
          interior_status?: string | null
          last_updated?: string | null
          mep_status?: string | null
          photos?: string[] | null
          progress?: number | null
          project_id?: string | null
          roofing_status?: string | null
          status?: string
          structure_status?: string | null
          sub_type?: string | null
          target_completion?: string | null
          unit_challenges?: string[] | null
          unit_number?: string
          unit_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "units_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor"
      project_status:
        | "Planning"
        | "In Progress"
        | "Completed"
        | "Near Completion"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor"],
      project_status: [
        "Planning",
        "In Progress",
        "Completed",
        "Near Completion",
      ],
    },
  },
} as const
