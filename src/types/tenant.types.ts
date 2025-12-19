// src/types/tenant.types.ts
export type Tenant = {
  id: number;
  name: string;
  slug: string;
  logo?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
  

  coop_initials:string;

 
  approved_at: string | null;
  registration_number: string | null;
  business_type: string | null;
  industry_type: string | null;

 
   cac_cert: string | null;
   city:string | null;
   country:string | null;
   description: string |null;

  
   founded_at:string | null; 
   
   member_types: string | null; 
  membership_fee: string | null;
  meta: []; 

 
  plan_id:string | null;  
  
  state:string; 
  status: string;
  website: string;


  auto_sweep_enabled: string; 
  sweep_bank_name: string | null;
  sweep_account_name: string | null;
  sweep_account_number: string | null;
  sweep_bank_code: string | null;
  sms_enabled: boolean;
  auto_deduct_fees:boolean;  
  email_enabled:boolean; 

 
 



};