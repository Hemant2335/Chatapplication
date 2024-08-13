import { FiMoreVertical } from "react-icons/fi";
import { ChatDetails, chatstate  , GroupChatDetails, groupchatsType} from "../store/atoms/Chat";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { userState } from "../store/atoms/User";
import { chatsType } from "../store/atoms/Chat";

const SideUserComp = ({ user }: any) => {
  const [Chatdetails, setChatDetails] = useRecoilState(ChatDetails);
  const setGroupChatDetails = useSetRecoilState(GroupChatDetails);
  const userstate = useRecoilValue(userState);
  const chat = useRecoilValue(chatstate);
  const navigate = useNavigate();

  const handleClick = () => {
    const UserChat = chat?.find((item) => item.userID === user.id);
    if (!UserChat) {
      // Create New Chat
      const newChat: chatsType = {
        userID: user.id,
        recived_message: [],
        send_message: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        name: user.name,
        profile: user.profile,
        username: user.username,
      };
      setChatDetails(newChat);
      
    } else {
      setChatDetails({
        ...UserChat,
        name: user.name,
        profile: user.profile,
        username: user.username,
      });
    }
    setGroupChatDetails(null);
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
          src={user.profile}
          className="rounded-full max-h-[10vh] md:max-h-[5vh] object-cover"
          alt="logo"
        />
        <div>
          <h1 className="text-[2vh] font-bold">{user.name}</h1>
          <p className="text-[1.7vh] font-medium text-gray-500">@{user.username}</p>
        </div>
      </div>
      <FiMoreVertical />
    </div>
  );
};

export default SideUserComp;
