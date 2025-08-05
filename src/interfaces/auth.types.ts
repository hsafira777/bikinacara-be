export interface ILoginParam {
  email: string;
  password: string;
}

export interface IRegisterParam {
  email: string;
  password: string;
  name: string;

  role: "ATTENDEE" | "ORGANIZER";
}

export interface IJwtPayload {
  id: string;
  email: string;
  role: "ATTENDEE" | "ORGANIZER";
}
