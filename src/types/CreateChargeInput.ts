import { CustomerWithEmail, CustomerWithPhone, CustomerWithTaxID } from "./Customer"

export type CreateChargeInput = {

  correlationID: string;
  value: number;
  

  type?: "DYNAMIC" | "OVERDUE";
  comment?: string;
  expiresIn?: number;
  expiresDate?: string;
  

  customer?: CustomerWithEmail | CustomerWithPhone | CustomerWithTaxID;
  

  ensureSameTaxID?: boolean;
  daysForDueDate?: number;
  daysAfterDueDate?: number;
  

  interests?: {
    value: number;
  };
  fines?: {
    value: number;
  };
  discountSettings?: {
    modality: string;
    discountFixedDate: Array<{
      daysActive: number;
      value: number;
    }>;
  };
  

  additionalInfo?: Array<{
    key: string;
    value: string;
  }>;
  

  enableCashbackPercentage?: boolean;
  enableCashbackExclusivePercentage?: boolean;
  

  subaccount?: string;
  splits?: Array<{
    value: number;
    pixKey: string;
    splitType: "SPLIT_INTERNAL_TRANSFER" | "SPLIT_SUB_ACCOUNT" | "SPLIT_PARTNER";
  }>;
};
