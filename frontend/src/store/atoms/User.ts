import { atom, selector } from "recoil";
import { getUser } from "../../Utils/User";

const userSelector = selector({
  key: "userSelector",
  get: async ({ get }) => {
    return await getUser();
  },
});


export const userState = atom({
  key: "userState",
  default: userSelector
});



