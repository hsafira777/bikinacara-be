export interface ILoginParam {
  role: "ATTENDEE" | "ORGANIZER";
  email: string;
  password: string;
}

export interface IRegisterParam {
  role: "ATTENDEE" | "ORGANIZER";
  name: string;
  email: string;
  password: string;
  referralCode?: string;
  referredById?: string; 
}

export interface IJwtPayload {
  role: "ATTENDEE" | "ORGANIZER";
  id: string;
  name: string;
  email: string;
}
