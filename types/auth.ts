export interface Currency {
  value: string;
  label: string;
}

export interface Account {
  firstName: string;
  lastName: string;
  country: string;
  password: string;
  email: string;
  currency: Currency;
  lang: string;
  mobile: string;
}

export interface User {
  id: string;
  account: Account;
}

export interface ISubscription {
  id: string;
  userId: string;
  status: string;
  plan: string;
  stripePriceId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

export interface LoginUser {
  access_token: string;
  user: User;
  subscription: ISubscription | null
  productsCount: number
}
