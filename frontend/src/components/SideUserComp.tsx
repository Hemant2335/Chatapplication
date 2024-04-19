import { FiMoreVertical } from "react-icons/fi";

const SideUserComp = ({ user }: any) => {
  return (
    <div className="flex items-center rounded-lg justify-between bg-[#2B2D31] p-3">
      <div className="flex gap-2 items-center">
        <img
          src={user.profile}
          className="rounded-[50%] max-h-[10vh] md:max-h-[5vh] object-cover"
          alt="logo"
        />
        <div className="">
          <h1 className="text-[2vh] font-bold">{user.name}</h1>
          <p className="text-[1.7vh] font-medium text-gray-500">
            @{user.username}
          </p>
        </div>
      </div>
      <FiMoreVertical />
    </div>
  );
};

export default SideUserComp;
