export interface Admin {
  Id: number;
  name: string;
  surname: string;
  email: string;
  active: boolean
  password: string;
}

export interface NewAdmin {
  name: string;
  surname: string;
  email: string;
  active: boolean
  password: string;
  confirmPassword: string;
}
