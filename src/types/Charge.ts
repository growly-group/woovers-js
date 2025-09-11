export type Charge = {
  id?: string;
  
  correlationID: string;
  
  value: number;
  
  comment?: string;
  
  type: 'DYNAMIC' | 'OVERDUE';

  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';
  
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
  
  paymentLinkID?: string;
  
  paymentLinkUrl?: string;
  
  qrCodeImage?: string;
  
  brCode?: string;
  
  paidAt?: string;
  
  createdAt: string;
  
  updatedAt: string;
};
