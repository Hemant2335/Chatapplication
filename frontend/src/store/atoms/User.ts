import { atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: {
    id: "",
    email: "",
    username: "",
    name: "",
    profile: "",
  },
});
