export interface SavingsAccount {
  id: string;

  account_number: string;
  product_name: string;
  bank_name: string;
  available_balance: string;
  opened_at: string;
  updated_at: string;


  balance: number;
  last_activity: string;
  status: "active" | "inactive" | "dormant" | "closed";
  member: {
    id: number | string,
    name: string,
  }
  product: {
    id: number | string,
    name: string,
  }
}
