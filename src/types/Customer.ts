
export type BaseCustomer = {
  name: string;
  correlationID?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
};

export type CustomerWithTaxID = BaseCustomer & {
  taxID: string;
  email?: string;
  phone?: string;
};

export type CustomerWithEmail = BaseCustomer & {
  email: string;
  taxID?: string;
  phone?: string;
};

export type CustomerWithPhone = BaseCustomer & {
  phone: string;
  taxID?: string;
  email?: string;
};

export type Customer = CustomerWithTaxID | CustomerWithEmail | CustomerWithPhone;
