export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      content_blocks: {
        Row: {
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          created_at: string
          id: string
          label: string
          photo_url: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          photo_url?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          photo_url?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      map_boundaries: {
        Row: {
          direction: Database["public"]["Enums"]["boundary_direction"]
          id: string
          neighbor_name: string
          updated_at: string
        }
        Insert: {
          direction: Database["public"]["Enums"]["boundary_direction"]
          id?: string
          neighbor_name: string
          updated_at?: string
        }
        Update: {
          direction?: Database["public"]["Enums"]["boundary_direction"]
          id?: string
          neighbor_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      news_posts: {
        Row: {
          body: string | null
          category: Database["public"]["Enums"]["news_category"]
          created_at: string
          excerpt: string | null
          id: string
          photo_url: string | null
          published_at: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          category: Database["public"]["Enums"]["news_category"]
          created_at?: string
          excerpt?: string | null
          id?: string
          photo_url?: string | null
          published_at?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          category?: Database["public"]["Enums"]["news_category"]
          created_at?: string
          excerpt?: string | null
          id?: string
          photo_url?: string | null
          published_at?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      population_snapshot: {
        Row: {
          id: number
          kepala_keluarga: number
          laki_laki: number
          luas_wilayah_km2: number
          perempuan: number
          period_label: string | null
          total_penduduk: number
          updated_at: string
        }
        Insert: {
          id?: number
          kepala_keluarga?: number
          laki_laki?: number
          luas_wilayah_km2?: number
          perempuan?: number
          period_label?: string | null
          total_penduduk?: number
          updated_at?: string
        }
        Update: {
          id?: number
          kepala_keluarga?: number
          laki_laki?: number
          luas_wilayah_km2?: number
          perempuan?: number
          period_label?: string | null
          total_penduduk?: number
          updated_at?: string
        }
        Relationships: []
      }
      rw_areas: {
        Row: {
          id: string
          masjid_count: number
          name: string
          rumah_count: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          id?: string
          masjid_count?: number
          name: string
          rumah_count?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          id?: string
          masjid_count?: number
          name?: string
          rumah_count?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      service_types: {
        Row: {
          id: string
          requirements: string[]
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          id?: string
          requirements?: string[]
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          id?: string
          requirements?: string[]
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string
          id: string
          name: string
          nip: string | null
          photo_url: string | null
          role: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          nip?: string | null
          photo_url?: string | null
          role: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          nip?: string | null
          photo_url?: string | null
          role?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      tax_monthly_realizations: {
        Row: {
          created_at: string
          id: string
          month: number
          pbb_rp: number
          pbb_stts: number
          tunggakan_rp: number
          tunggakan_stts: number
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          month: number
          pbb_rp?: number
          pbb_stts?: number
          tunggakan_rp?: number
          tunggakan_stts?: number
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          month?: number
          pbb_rp?: number
          pbb_stts?: number
          tunggakan_rp?: number
          tunggakan_stts?: number
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "tax_monthly_realizations_year_fkey"
            columns: ["year"]
            isOneToOne: false
            referencedRelation: "tax_year_targets"
            referencedColumns: ["year"]
          },
        ]
      }
      tax_year_targets: {
        Row: {
          pokok_rp: number
          pokok_stts: number
          tunggakan_awal_rp: number
          tunggakan_awal_stts: number
          updated_at: string
          year: number
        }
        Insert: {
          pokok_rp?: number
          pokok_stts?: number
          tunggakan_awal_rp?: number
          tunggakan_awal_stts?: number
          updated_at?: string
          year: number
        }
        Update: {
          pokok_rp?: number
          pokok_stts?: number
          tunggakan_awal_rp?: number
          tunggakan_awal_stts?: number
          updated_at?: string
          year?: number
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
      boundary_direction: "utara" | "selatan" | "timur" | "barat"
      news_category: "berita" | "pengumuman"
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
      boundary_direction: ["utara", "selatan", "timur", "barat"],
      news_category: ["berita", "pengumuman"],
    },
  },
} as const
