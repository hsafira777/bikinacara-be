export interface ICreateUserParam {
  name: string;
  email: string;
  password: string;
  profilePic?: string;
  role: "ATTENDEE" | "ORGANIZER";
}

export interface IUpdateUserParam {
  name?: string;
  email?: string;
  password?: string;
  profilePic?: string;
  role: "ATTENDEE" | "ORGANIZER";
}


// export interface IRegisterParam {
//   name: string;
//   email: string;
//   password: string;
//   role: "ATTENDEE" | "ORGANIZER";
// }