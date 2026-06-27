export type Json =
  | boolean
  | null
  | number
  | string
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Insert: {
          action: string;
          created_at?: string;
          entity: string;
          entity_id: string;
          id?: string;
          user_id: string;
        };
        Row: {
          action: string;
          created_at: string;
          entity: string;
          entity_id: string;
          id: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
      };
      companies: {
        Insert: { created_at?: string; id?: string; name: string };
        Row: { created_at: string; id: string; name: string };
        Update: Partial<Database["public"]["Tables"]["companies"]["Insert"]>;
      };
      projects: {
        Insert: {
          client_id: string;
          code: string;
          company_id: string;
          contract_value: number;
          expected_end_date?: string | null;
          id?: string;
          name: string;
          stage: string;
          start_date: string;
          status: string;
        };
        Row: {
          client_id: string;
          code: string;
          company_id: string;
          contract_value: number;
          expected_end_date: string | null;
          id: string;
          name: string;
          stage: string;
          start_date: string;
          status: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      transactions: {
        Insert: {
          amount: number;
          category: string;
          description?: string | null;
          id?: string;
          labour_id?: string | null;
          payment_method: string;
          project_id: string;
          supplier_id?: string | null;
          transaction_date: string;
          type: string;
        };
        Row: {
          amount: number;
          category: string;
          description: string | null;
          id: string;
          labour_id: string | null;
          payment_method: string;
          project_id: string;
          supplier_id: string | null;
          transaction_date: string;
          type: string;
        };
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
