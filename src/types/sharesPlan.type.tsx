export type SharesPlan = {
  id: number;
  tenant_id: number;
  name: string;
  description: string | null;
  unit_price: number;
  minimum_units: number;
  maximum_units: number | null;
  is_active: boolean;
  is_default: boolean;
  allow_partial_purchase: boolean;
  meta: Record<string, any> | null;
  created_at: string;
  updated_at: string;
};