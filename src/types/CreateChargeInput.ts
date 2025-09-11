export type CreateChargeInput = {
  correlationID: string;
  
  value: number;
  
  comment?: string;
  
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    taxID?: string;
    correlationID?: string;
  };
  
  pixKey?: string;
  
  additionalInfo?: Array<{
    key: string;
    value: string;
  }>;
  
  expiresDate?: string;
  
  expiresIn?: number;
};
