import { FiMoreVertical } from "react-icons/fi";
import { ChatDetails, GroupChatDetails} from "../store/atoms/Chat";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";


const SideGroupComp = ({ group }: any) => {

  const setChatDetails = useSetRecoilState(ChatDetails);
  const setGroupChatDetails = useSetRecoilState(GroupChatDetails);
  const navigate = useNavigate();

  const handleClick = () => {
    setGroupChatDetails(group);
    setChatDetails(null);
    if (!window.location.href.endsWith("/Chat")) {
      navigate("/Chat");
    }
  };

  return (
    <div
      className="flex items-center cursor-pointer rounded-lg justify-between bg-[#222222] p-3"
      onClick={handleClick}
    >
      <div className="flex gap-2 items-center">
        <img
          src={group.profile}
          className="rounded-full max-h-[10vh] md:max-h-[5vh] object-cover"
          alt="logo"
        />
        <div>
          <h1 className="text-[2vh] font-bold">{group.name}</h1>
          <p className="text-[1.7vh] font-medium text-gray-500">@Group</p>
        </div>
      </div>
      <FiMoreVertical />
    </div>
  );
};

export default SideGroupComp;
