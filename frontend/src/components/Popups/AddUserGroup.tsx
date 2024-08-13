import { useEffect, useState } from "react";
import { IsAddUserGroupPopupAtom } from "../../store/atoms/CompState";
import { useRecoilState } from "recoil";

const AddUserGroup = () => {
  const [users, setUsers] = useState([]);
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [IsAddUserGroupPopup, setIsAddUserGroupPopup] = useRecoilState(IsAddUserGroupPopupAtom)

  const fetchRecommendedUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/alluser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": localStorage.getItem("token") || "",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      }

      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchRecommendedUsers();
  }, []);

  const handleCheckboxChange = (user:any) => {
    setCheckedUsers((prevCheckedUsers:any) => {
      if (prevCheckedUsers.some((item:any) => item.id === user.id)) {
        return prevCheckedUsers.filter((item:any) => item.id !== user.id);
      } else {
        return [...prevCheckedUsers, user];
      }
    });
  };

  const handleAddUsers = async() =>{
    console.log("Checked Users", checkedUsers);
    setIsAddUserGroupPopup(false);
  }

  return (
    <div className="fixed flex h-[100vh] w-screen top-0 left-0 justify-center items-center z-10 bg-[rgba(34,34,34,0.5)]">
      <div className="w-fit flex flex-col items-center h-fit p-4 bg-[#1a1a1a] border-2 border-gray-500 rounded-lg">
        <h1 className="font-black text-[2.1vh] mb-[0.7vh]">Add Users</h1>
        {users.length > 0 ? (
          <div className="flex flex-col gap-2">
            {users.map((user:any) => (
              <div key={user?.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checkedUsers.some((item:any) => item.id === user?.id)}
                  onChange={() => handleCheckboxChange(user)}
                />
                <p>{user?.username}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No users available</p>
        )}
        <button
          className="bg-[#EA4B8B] mt-[2vh] w-fit py-2 px-[2vw] text-white rounded-lg"
          onClick={() => handleAddUsers()}
        >
          Add Users
        </button>
      </div>
    </div>
  );
};

export default AddUserGroup;
