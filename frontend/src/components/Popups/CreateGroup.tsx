import { useState } from "react";
import { IsCreateGroupPopupAtom } from "../../store/atoms/CompState";
import { useSetRecoilState } from "recoil";

const CreateGroup = () => {
  const [GroupName, setGroupName] = useState("");
    const SetIsCreateGroupPopup = useSetRecoilState(IsCreateGroupPopupAtom);
  const handleCreateGroup = async () => {
    if (!GroupName.trim()) return;
    console.log("Group Name", GroupName);
    // Create Group
    try {
        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/chat/creategroup`,
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: localStorage.getItem("token") || "",
            },
            credentials: "include",
            body: JSON.stringify({ name : GroupName }),
            }
        );
        const data = await res.json();
        if (!data.Status) {
            alert(data.error);
            return;
        }
        console.log("Group Created", data);
        SetIsCreateGroupPopup(false);
    } catch (error) {
        return console.log(error);
    }
  };

  return (
    <div className=" fixed flex h-[100vh] w-screen top-0 left-0 justify-center items-center  z-10 bg-[rgba(34,34,34,0.5)]">
      <div className="w-fit flex flex-col items-center h-fit p-4 bg-[#1a1a1a] border-2 border-gray-500 rounded-lg">
        <div>
          <h1 className="font-black text-[2.1vh] mb-[0.7vh]">Group Name</h1>
          <input
            type="text"
            placeholder="eg. Gladiators"
            className="bg-[#F3F3F3] w-full font-medium text-sm  focus:outline-none p-[1.6vh] rounded-md"
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
          />
        </div>
        <button
          className="bg-[#EA4B8B] mt-[2vh] w-fit py-2 px-[2vw] text-white rounded-lg"
          onClick={() => handleCreateGroup()}
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default CreateGroup;
