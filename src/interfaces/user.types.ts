export interface ICreateUserParam {
  name: string;
  email: string;
  password: string;
  profilePic?: string;
  role: "ATTENDEE" | "ORGANIZER";
  refeallCode?: string | null;
}

export interface IUpdateUserParam {
  name?: string;
  email?: string;
  password?: string;
  profilePic?: string;
  role: "ATTENDEE" | "ORGANIZER";
}


