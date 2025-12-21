export interface SavingsProduct {
  id: number;
  name: string;
  account_prefix: string;
  yearly_interest_rate: number;
  interest_period: string;
  interest_method: string;
  min_balance_for_interest: number;
  allow_withdrawal: boolean;
  min_deposit_amount: number;
  min_account_balance: number;
  maintenance_fee: number;
  maintenance_fee_month: string | null;
  auto_create_on_registration: boolean;
  is_active: boolean;
  is_default: boolean;
  description: string | null;
  created_at: string;
}
