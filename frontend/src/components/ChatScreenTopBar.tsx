import {  FiSearch , FiInfo } from "react-icons/fi"
import { ChatDetails } from "../store/atoms/Chat"
import { useRecoilValue } from "recoil"

const ChatScreenTopBar = () => {

  const chatdetails:any = useRecoilValue(ChatDetails);

  return (
    <div className="w-full top-[3vh] px-4 bg-[#222222] rounded-lg pt-[2vh]">
        <div className="flex items-center rounded-lg justify-between px-2">
          <div className="flex gap-2 items-center">
            <img
              src={chatdetails.profile}
              className="rounded-[50%] max-h-[10vh] md:max-h-[5vh] object-cover"
              alt="logo"
            />
            <div className="">
              <h1 className="text-[2vh] font-bold">{chatdetails.name}</h1>
              <p className="text-[1.7vh] font-medium text-gray-500">
                @{chatdetails.username}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-[1vw] text-[3vh]">
          <FiSearch className="text-gray-500"/>
          <FiInfo className="text-gray-500"/>
          </div>
        </div>
        <hr className=" border-[0.1vh] border-black mt-[2vh]" />
      </div>
  )
}

export default ChatScreenTopBar