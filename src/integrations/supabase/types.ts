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
      ads: {
        Row: {
          created_at: string | null
          cta_url: string | null
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          start_date: string | null
          target_audience: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cta_url?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          start_date?: string | null
          target_audience?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cta_url?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          start_date?: string | null
          target_audience?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string
          event_date: string
          event_time: string | null
          event_type: string
          id: string
          property_id: string | null
          start_time: string
          title: string
          unit_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time: string
          event_date: string
          event_time?: string | null
          event_type: string
          id?: string
          property_id?: string | null
          start_time: string
          title: string
          unit_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string
          event_date?: string
          event_time?: string | null
          event_type?: string
          id?: string
          property_id?: string | null
          start_time?: string
          title?: string
          unit_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      inspections: {
        Row: {
          created_at: string | null
          id: string
          inspected_by: string | null
          inspection_date: string
          is_signed_off: boolean | null
          notes: string | null
          photo_urls: string[] | null
          type: string | null
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inspected_by?: string | null
          inspection_date: string
          is_signed_off?: boolean | null
          notes?: string | null
          photo_urls?: string[] | null
          type?: string | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inspected_by?: string | null
          inspection_date?: string
          is_signed_off?: boolean | null
          notes?: string | null
          photo_urls?: string[] | null
          type?: string | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspections_inspected_by_fkey"
            columns: ["inspected_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      move_in_checklists: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          is_complete: boolean | null
          resident_id: string | null
          task: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_complete?: boolean | null
          resident_id?: string | null
          task: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_complete?: boolean | null
          resident_id?: string | null
          task?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "move_in_checklists_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "residents"
            referencedColumns: ["id"]
          },
        ]
      }
      move_out_checklists: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          is_complete: boolean | null
          resident_id: string | null
          task: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_complete?: boolean | null
          resident_id?: string | null
          task: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_complete?: boolean | null
          resident_id?: string | null
          task?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "move_out_checklists_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "residents"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address_line_1: string
          address_line_2: string | null
          allow_guests: boolean | null
          amenities: string | null
          amenity_wifi_name: string | null
          amenity_wifi_password: string | null
          auto_late_fee_threshold: number | null
          auto_legal_threshold: number | null
          available_wifi_providers: string[] | null
          city: string
          cleaning_contact_email: string | null
          concierge_available: boolean | null
          concierge_contact: string | null
          concierge_hours: string | null
          created_at: string | null
          default_inspection_required: boolean | null
          default_late_fee_policy: string | null
          default_rent_due_day: number | null
          door_access_system: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          guest_wifi_available: boolean | null
          id: string
          leasing_office_hours: string | null
          lifestyle_tags: string[] | null
          maintenance_company: string | null
          maintenance_contact: string | null
          maintenance_contact_email: string | null
          maintenance_phone: string | null
          management_company: string | null
          move_in_instructions: string | null
          on_site_contact_phone: string | null
          on_site_support_hours: string | null
          parking_info: string | null
          pet_policy: string | null
          property_code: string | null
          property_manager_email: string | null
          property_manager_name: string | null
          property_manager_phone: string | null
          property_name: string
          property_tags: string[] | null
          property_type: Database["public"]["Enums"]["property_type"] | null
          recycling_schedule: string | null
          smoking_policy: string | null
          special_instructions: string | null
          state: string
          super_operator_email: string | null
          timezone: string | null
          total_units: number | null
          trash_pickup_schedule: string | null
          unit_feature_tags: string[] | null
          updated_at: string | null
          website: string | null
          zip_code: string
        }
        Insert: {
          address_line_1: string
          address_line_2?: string | null
          allow_guests?: boolean | null
          amenities?: string | null
          amenity_wifi_name?: string | null
          amenity_wifi_password?: string | null
          auto_late_fee_threshold?: number | null
          auto_legal_threshold?: number | null
          available_wifi_providers?: string[] | null
          city: string
          cleaning_contact_email?: string | null
          concierge_available?: boolean | null
          concierge_contact?: string | null
          concierge_hours?: string | null
          created_at?: string | null
          default_inspection_required?: boolean | null
          default_late_fee_policy?: string | null
          default_rent_due_day?: number | null
          door_access_system?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          guest_wifi_available?: boolean | null
          id?: string
          leasing_office_hours?: string | null
          lifestyle_tags?: string[] | null
          maintenance_company?: string | null
          maintenance_contact?: string | null
          maintenance_contact_email?: string | null
          maintenance_phone?: string | null
          management_company?: string | null
          move_in_instructions?: string | null
          on_site_contact_phone?: string | null
          on_site_support_hours?: string | null
          parking_info?: string | null
          pet_policy?: string | null
          property_code?: string | null
          property_manager_email?: string | null
          property_manager_name?: string | null
          property_manager_phone?: string | null
          property_name: string
          property_tags?: string[] | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          recycling_schedule?: string | null
          smoking_policy?: string | null
          special_instructions?: string | null
          state: string
          super_operator_email?: string | null
          timezone?: string | null
          total_units?: number | null
          trash_pickup_schedule?: string | null
          unit_feature_tags?: string[] | null
          updated_at?: string | null
          website?: string | null
          zip_code: string
        }
        Update: {
          address_line_1?: string
          address_line_2?: string | null
          allow_guests?: boolean | null
          amenities?: string | null
          amenity_wifi_name?: string | null
          amenity_wifi_password?: string | null
          auto_late_fee_threshold?: number | null
          auto_legal_threshold?: number | null
          available_wifi_providers?: string[] | null
          city?: string
          cleaning_contact_email?: string | null
          concierge_available?: boolean | null
          concierge_contact?: string | null
          concierge_hours?: string | null
          created_at?: string | null
          default_inspection_required?: boolean | null
          default_late_fee_policy?: string | null
          default_rent_due_day?: number | null
          door_access_system?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          guest_wifi_available?: boolean | null
          id?: string
          leasing_office_hours?: string | null
          lifestyle_tags?: string[] | null
          maintenance_company?: string | null
          maintenance_contact?: string | null
          maintenance_contact_email?: string | null
          maintenance_phone?: string | null
          management_company?: string | null
          move_in_instructions?: string | null
          on_site_contact_phone?: string | null
          on_site_support_hours?: string | null
          parking_info?: string | null
          pet_policy?: string | null
          property_code?: string | null
          property_manager_email?: string | null
          property_manager_name?: string | null
          property_manager_phone?: string | null
          property_name?: string
          property_tags?: string[] | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          recycling_schedule?: string | null
          smoking_policy?: string | null
          special_instructions?: string | null
          state?: string
          super_operator_email?: string | null
          timezone?: string | null
          total_units?: number | null
          trash_pickup_schedule?: string | null
          unit_feature_tags?: string[] | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      resident_tags: {
        Row: {
          created_at: string | null
          id: string
          tag: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          tag: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          tag?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resident_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      residents: {
        Row: {
          additional_charges: number | null
          assigned_operator_email: string | null
          assigned_operator_name: string | null
          assigned_vendor_email: string | null
          assigned_vendor_name: string | null
          auto_pay_enabled: boolean | null
          balance_due: number | null
          carson_app_setup: boolean | null
          cleaning_provider: string | null
          company_address: string | null
          company_city: string | null
          company_name: string | null
          company_state: string | null
          company_zip: string | null
          concession_amount: number | null
          created_at: string | null
          custom_notes: string | null
          delinquency_status:
            | Database["public"]["Enums"]["delinquency_status"]
            | null
          deposit_amount: number | null
          email: string
          employer: string | null
          first_name: string
          gift_delivered: boolean | null
          gross_monthly_income: number | null
          id: string
          id_number: string | null
          is_active: boolean | null
          last_name: string
          last_payment_amount: number | null
          last_payment_date: string | null
          late_fee_count: number | null
          lease_end_date: string | null
          lease_start_date: string | null
          lease_term: number | null
          loss_to_lease: number | null
          maintenance_provider: string | null
          marketing_source: string | null
          monthly_rent: number | null
          months_at_property: number | null
          move_in_checklist_complete: boolean | null
          move_in_date: string | null
          move_out_checklist_complete: boolean | null
          move_out_date: string | null
          net_effective_rent: number | null
          onboarding_status: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          personal_address: string | null
          personal_city: string | null
          personal_state: string | null
          personal_zip: string | null
          pet: string | null
          phone: string | null
          property_id: string
          pseg_setup: boolean | null
          renter_insurance_uploaded: boolean | null
          resident_tags: string[] | null
          smart_access_setup: boolean | null
          status: Database["public"]["Enums"]["resident_status"] | null
          unit_id: string | null
          updated_at: string | null
          user_id: string | null
          utilities_account_number: string | null
          welcome_email_sent: boolean | null
        }
        Insert: {
          additional_charges?: number | null
          assigned_operator_email?: string | null
          assigned_operator_name?: string | null
          assigned_vendor_email?: string | null
          assigned_vendor_name?: string | null
          auto_pay_enabled?: boolean | null
          balance_due?: number | null
          carson_app_setup?: boolean | null
          cleaning_provider?: string | null
          company_address?: string | null
          company_city?: string | null
          company_name?: string | null
          company_state?: string | null
          company_zip?: string | null
          concession_amount?: number | null
          created_at?: string | null
          custom_notes?: string | null
          delinquency_status?:
            | Database["public"]["Enums"]["delinquency_status"]
            | null
          deposit_amount?: number | null
          email: string
          employer?: string | null
          first_name: string
          gift_delivered?: boolean | null
          gross_monthly_income?: number | null
          id?: string
          id_number?: string | null
          is_active?: boolean | null
          last_name: string
          last_payment_amount?: number | null
          last_payment_date?: string | null
          late_fee_count?: number | null
          lease_end_date?: string | null
          lease_start_date?: string | null
          lease_term?: number | null
          loss_to_lease?: number | null
          maintenance_provider?: string | null
          marketing_source?: string | null
          monthly_rent?: number | null
          months_at_property?: number | null
          move_in_checklist_complete?: boolean | null
          move_in_date?: string | null
          move_out_checklist_complete?: boolean | null
          move_out_date?: string | null
          net_effective_rent?: number | null
          onboarding_status?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          personal_address?: string | null
          personal_city?: string | null
          personal_state?: string | null
          personal_zip?: string | null
          pet?: string | null
          phone?: string | null
          property_id: string
          pseg_setup?: boolean | null
          renter_insurance_uploaded?: boolean | null
          resident_tags?: string[] | null
          smart_access_setup?: boolean | null
          status?: Database["public"]["Enums"]["resident_status"] | null
          unit_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          utilities_account_number?: string | null
          welcome_email_sent?: boolean | null
        }
        Update: {
          additional_charges?: number | null
          assigned_operator_email?: string | null
          assigned_operator_name?: string | null
          assigned_vendor_email?: string | null
          assigned_vendor_name?: string | null
          auto_pay_enabled?: boolean | null
          balance_due?: number | null
          carson_app_setup?: boolean | null
          cleaning_provider?: string | null
          company_address?: string | null
          company_city?: string | null
          company_name?: string | null
          company_state?: string | null
          company_zip?: string | null
          concession_amount?: number | null
          created_at?: string | null
          custom_notes?: string | null
          delinquency_status?:
            | Database["public"]["Enums"]["delinquency_status"]
            | null
          deposit_amount?: number | null
          email?: string
          employer?: string | null
          first_name?: string
          gift_delivered?: boolean | null
          gross_monthly_income?: number | null
          id?: string
          id_number?: string | null
          is_active?: boolean | null
          last_name?: string
          last_payment_amount?: number | null
          last_payment_date?: string | null
          late_fee_count?: number | null
          lease_end_date?: string | null
          lease_start_date?: string | null
          lease_term?: number | null
          loss_to_lease?: number | null
          maintenance_provider?: string | null
          marketing_source?: string | null
          monthly_rent?: number | null
          months_at_property?: number | null
          move_in_checklist_complete?: boolean | null
          move_in_date?: string | null
          move_out_checklist_complete?: boolean | null
          move_out_date?: string | null
          net_effective_rent?: number | null
          onboarding_status?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          personal_address?: string | null
          personal_city?: string | null
          personal_state?: string | null
          personal_zip?: string | null
          pet?: string | null
          phone?: string | null
          property_id?: string
          pseg_setup?: boolean | null
          renter_insurance_uploaded?: boolean | null
          resident_tags?: string[] | null
          smart_access_setup?: boolean | null
          status?: Database["public"]["Enums"]["resident_status"] | null
          unit_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          utilities_account_number?: string | null
          welcome_email_sent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "residents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residents_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "residents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_orders: {
        Row: {
          category: string | null
          completed_at: string | null
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          scheduled_at: string | null
          status: string | null
          unit_id: string | null
          updated_at: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          category?: string | null
          completed_at?: string | null
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          scheduled_at?: string | null
          status?: string | null
          unit_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          category?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          scheduled_at?: string | null
          status?: string | null
          unit_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_orders_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_status_logs: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: string
          notes: string | null
          status: string
          unit_id: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          notes?: string | null
          status: string
          unit_id?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          notes?: string | null
          status?: string
          unit_id?: string | null
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
          bathrooms: number | null
          bedrooms: number | null
          created_at: string | null
          floor: number | null
          id: string
          inspection_completed: boolean | null
          market_rent: number | null
          property_id: string
          sq_ft: number | null
          unit_number: string
          unit_ready_status:
            | Database["public"]["Enums"]["unit_ready_status"]
            | null
          unit_status: Database["public"]["Enums"]["unit_status"] | null
          unit_type: string | null
          updated_at: string | null
        }
        Insert: {
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          floor?: number | null
          id?: string
          inspection_completed?: boolean | null
          market_rent?: number | null
          property_id: string
          sq_ft?: number | null
          unit_number: string
          unit_ready_status?:
            | Database["public"]["Enums"]["unit_ready_status"]
            | null
          unit_status?: Database["public"]["Enums"]["unit_status"] | null
          unit_type?: string | null
          updated_at?: string | null
        }
        Update: {
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          floor?: number | null
          id?: string
          inspection_completed?: boolean | null
          market_rent?: number | null
          property_id?: string
          sq_ft?: number | null
          unit_number?: string
          unit_ready_status?:
            | Database["public"]["Enums"]["unit_ready_status"]
            | null
          unit_status?: Database["public"]["Enums"]["unit_status"] | null
          unit_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
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
          company_domain: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string | null
        }
        Insert: {
          company_domain?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
        }
        Update: {
          company_domain?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          category: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_available_units: {
        Args: { property_uuid: string }
        Returns: {
          id: string
          unit_number: string
          bedroom_type: string
          bath_type: string
          sq_ft: number
          floor: number
        }[]
      }
      get_unit_occupancy_rate: {
        Args: { property_uuid: string }
        Returns: number
      }
      get_user_property_id: {
        Args: { user_id: string }
        Returns: string
      }
      is_admin_or_operator: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_maintenance_staff: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
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
        | "vendor"
      delinquency_status: "current" | "notice" | "legal" | "eviction"
      move_in_status: "pending" | "approved" | "canceled"
      move_out_status: "scheduled" | "completed" | "canceled"
      payment_method: "ach" | "credit_card" | "check" | "cash" | "money_order"
      payment_status: "current" | "late" | "delinquent" | "paid_ahead"
      property_type:
        | "apartment"
        | "townhouse"
        | "single_family"
        | "condo"
        | "other"
      resident_status: "active" | "notice" | "past"
      unit_ready_status:
        | "ready"
        | "maintenance"
        | "cleaning"
        | "inspection_pending"
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
        "vendor",
      ],
      delinquency_status: ["current", "notice", "legal", "eviction"],
      move_in_status: ["pending", "approved", "canceled"],
      move_out_status: ["scheduled", "completed", "canceled"],
      payment_method: ["ach", "credit_card", "check", "cash", "money_order"],
      payment_status: ["current", "late", "delinquent", "paid_ahead"],
      property_type: [
        "apartment",
        "townhouse",
        "single_family",
        "condo",
        "other",
      ],
      resident_status: ["active", "notice", "past"],
      unit_ready_status: [
        "ready",
        "maintenance",
        "cleaning",
        "inspection_pending",
      ],
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
