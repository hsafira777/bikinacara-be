// export interface IRegisterParams {
//   name: string;
//   email: string;
//   password: string;
//   role: "attendee" | "organizer";
//   referredById?: string;
//   referralCode?: string;
// }

// export interface ILoginParams {
//   email: string;
//   password: string;
// }

// export interface IUserPayload {
//   id: string;
//   email: string;
//   name: string;
//   role: string;
// }

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