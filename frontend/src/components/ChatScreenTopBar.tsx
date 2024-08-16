import { FiSearch, FiInfo } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import { ChatDetails, GroupChatDetails } from "../store/atoms/Chat";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect } from "react";
import { IsAddUserGroupPopupAtom } from "../store/atoms/CompState";

const ChatScreenTopBar = () => {
  const chatdetails: any = useRecoilValue(ChatDetails);
  const groupChatDetails: any = useRecoilValue(GroupChatDetails);
  const setIsAddUserGroupPopup = useSetRecoilState(IsAddUserGroupPopupAtom);

  useEffect(() => {
    console.log(chatdetails, groupChatDetails);
  }, [chatdetails, groupChatDetails]);


  return (
    <div className="w-full top-[3vh] px-4 bg-[#222222] rounded-lg pt-[2vh]">
      <div className="flex items-center rounded-lg justify-between px-2">
        <div className="flex gap-2 items-center">
          <img
            src={chatdetails ? chatdetails.profile : groupChatDetails.profile}
            className="rounded-[50%] max-h-[10vh] md:max-h-[5vh] object-cover"
            alt="logo"
          />
          <div className="">
            <h1 className="text-[2vh] font-bold">
              {chatdetails ? chatdetails.name : groupChatDetails.name}
            </h1>
            {chatdetails && (
              <p className="text-[1.7vh] font-medium text-gray-500">
                @{chatdetails.username}
              </p>
            )}
            <div className="flex gap-1">
            {groupChatDetails != null &&
              groupChatDetails.users &&
              groupChatDetails.users.map((user: any) => (
                <p
                  key={user.id}
                  className="text-[1.7vh] font-medium text-gray-500"
                >
                  @{user.username}, 
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[1vw] text-[3vh]">
          <FiSearch className="text-gray-500" />
          <FiInfo className="text-gray-500" />
          {groupChatDetails && <FiPlus className="text-gray-500 cursor-pointer hover:text-white" onClick={()=>{setIsAddUserGroupPopup(true)}}/>}
        </div>
      </div>
      <hr className=" border-[0.1vh] border-black mt-[2vh]" />
    </div>
  );
};

export default ChatScreenTopBar;
