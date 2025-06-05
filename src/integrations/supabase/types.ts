export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      calendar_events: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          event_date: string
          event_time: string | null
          event_type: string
          id: string
          related_unit_id: string | null
          related_user_id: string | null
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          event_date: string
          event_time?: string | null
          event_type: string
          id?: string
          related_unit_id?: string | null
          related_user_id?: string | null
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          event_date?: string
          event_time?: string | null
          event_type?: string
          id?: string
          related_unit_id?: string | null
          related_user_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_related_unit_id_fkey"
            columns: ["related_unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_related_user_id_fkey"
            columns: ["related_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      move_ins: {
        Row: {
          balance_due: number
          checklist_completed: boolean
          created_at: string
          id: string
          lease_signed_date: string | null
          lease_start_date: string
          resident_id: string
          status: Database["public"]["Enums"]["move_in_status"]
          unit_id: string
          updated_at: string
        }
        Insert: {
          balance_due?: number
          checklist_completed?: boolean
          created_at?: string
          id?: string
          lease_signed_date?: string | null
          lease_start_date: string
          resident_id: string
          status?: Database["public"]["Enums"]["move_in_status"]
          unit_id: string
          updated_at?: string
        }
        Update: {
          balance_due?: number
          checklist_completed?: boolean
          created_at?: string
          id?: string
          lease_signed_date?: string | null
          lease_start_date?: string
          resident_id?: string
          status?: Database["public"]["Enums"]["move_in_status"]
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "move_ins_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "move_ins_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      move_outs: {
        Row: {
          checklist_completed: boolean
          created_at: string
          forwarding_address: string | null
          id: string
          inspection_video_link: string | null
          move_out_date: string
          notice_to_vacate_signed: boolean
          resident_id: string
          status: Database["public"]["Enums"]["move_out_status"]
          unit_id: string
          updated_at: string
        }
        Insert: {
          checklist_completed?: boolean
          created_at?: string
          forwarding_address?: string | null
          id?: string
          inspection_video_link?: string | null
          move_out_date: string
          notice_to_vacate_signed?: boolean
          resident_id: string
          status?: Database["public"]["Enums"]["move_out_status"]
          unit_id: string
          updated_at?: string
        }
        Update: {
          checklist_completed?: boolean
          created_at?: string
          forwarding_address?: string | null
          id?: string
          inspection_video_link?: string | null
          move_out_date?: string
          notice_to_vacate_signed?: boolean
          resident_id?: string
          status?: Database["public"]["Enums"]["move_out_status"]
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "move_outs_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "move_outs_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          created_at: string
          id: string
          name: string
          operator_id: string
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          name: string
          operator_id: string
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          name?: string
          operator_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_status_logs: {
        Row: {
          changed_at: string
          changed_by: string
          id: string
          new_status: Database["public"]["Enums"]["unit_status"]
          notes: string | null
          old_status: Database["public"]["Enums"]["unit_status"] | null
          unit_id: string
        }
        Insert: {
          changed_at?: string
          changed_by: string
          id?: string
          new_status: Database["public"]["Enums"]["unit_status"]
          notes?: string | null
          old_status?: Database["public"]["Enums"]["unit_status"] | null
          unit_id: string
        }
        Update: {
          changed_at?: string
          changed_by?: string
          id?: string
          new_status?: Database["public"]["Enums"]["unit_status"]
          notes?: string | null
          old_status?: Database["public"]["Enums"]["unit_status"] | null
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unit_status_logs_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unit_status_logs_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          bath_count: number
          bed_count: number
          created_at: string
          current_resident_id: string | null
          id: string
          lease_end: string | null
          lease_start: string | null
          property_id: string
          status: Database["public"]["Enums"]["unit_status"]
          unit_number: string
          updated_at: string
        }
        Insert: {
          bath_count?: number
          bed_count?: number
          created_at?: string
          current_resident_id?: string | null
          id?: string
          lease_end?: string | null
          lease_start?: string | null
          property_id: string
          status?: Database["public"]["Enums"]["unit_status"]
          unit_number: string
          updated_at?: string
        }
        Update: {
          bath_count?: number
          bed_count?: number
          created_at?: string
          current_resident_id?: string | null
          id?: string
          lease_end?: string | null
          lease_start?: string | null
          property_id?: string
          status?: Database["public"]["Enums"]["unit_status"]
          unit_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_current_resident_id_fkey"
            columns: ["current_resident_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "units_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role:
        | "super_admin"
        | "senior_operator"
        | "operator"
        | "maintenance"
        | "leasing"
        | "prospect"
        | "resident"
        | "former_resident"
      move_in_status: "pending" | "approved" | "canceled"
      move_out_status: "scheduled" | "completed" | "canceled"
      unit_status:
        | "available"
        | "occupied"
        | "maintenance"
        | "turn"
        | "leased_not_moved_in"
        | "off_market"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "senior_operator",
        "operator",
        "maintenance",
        "leasing",
        "prospect",
        "resident",
        "former_resident",
      ],
      move_in_status: ["pending", "approved", "canceled"],
      move_out_status: ["scheduled", "completed", "canceled"],
      unit_status: [
        "available",
        "occupied",
        "maintenance",
        "turn",
        "leased_not_moved_in",
        "off_market",
      ],
    },
  },
} as const
