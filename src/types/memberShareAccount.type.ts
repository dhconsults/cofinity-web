export type MemberShareAccount = {
  id: number;
  member_id: number;
  shares_plan_id: number;
  savings_account_id: number | null;
  total_units: number;
  total_value: number;
  is_active: boolean;
  member: {
    id: number;
    first_name: string;
    last_name: string;
    member_number: string;
  };
  shares_plan: {
    id: number;
    name: string;
  };
  savings_account: {
    id: number;
    account_number: string;
  };
};


// "accounts": [
//             {
//                 "id": 5,
//                 "tenant_id": 4,
//                 "member_id": 4,
//                 "shares_plan_id": 1,
//                 "savings_account_id": 8,
//                 "total_units": "1.00000000",
//                 "total_value": "10000.00",
//                 "is_active": true,
//                 "meta": null,
//                 "created_at": "2025-12-10T21:42:36.000000Z",
//                 "updated_at": "2025-12-10T21:42:36.000000Z",
//                 "member": {
//                     "id": 4,
//                     "first_name": "Precious",
//                     "last_name": "Obaseki"
//                 },
//                 "shares_plan": {
//                     "id": 1,
//                     "name": "Ordinary Shares",
//                     "unit_price": "10000.00"
//                 },
//                 "savings_account": {
//                     "id": 8,
//                     "tenant_id": 4,
//                     "member_id": 4,
//                     "savings_product_id": 1,
//                     "branch_id": 1,
//                     "account_number": "7466655779",
//                     "bank_name": "Some Bank Name",
//                     "balance": "33634.00",
//                     "available_balance": "43534.00",
//                     "lien_balance": "0.00",
//                     "status": "active",
//                     "description": null,
//                     "opened_at": "2025-12-10T00:00:00.000000Z",
//                     "closed_at": null,
//                     "nomba_metadata": null,
//                     "created_at": "2025-12-10T10:36:20.000000Z",
//                     "updated_at": "2025-12-10T21:42:36.000000Z"
//                 }
//             }
//         ],