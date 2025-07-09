import React, { useContext } from "react";
import SideBar from "../components/SideBar";
import ChatContainer from "../components/ChatContainer";
import RightSideBar from "../components/RightSideBar";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);
  return (
    <div className=" w-full h-full  text-gray-100 lg:bg-gradient-to-r from-black via-gray-900 to-black">
      <div
        className={`h-full grid relative ${
          selectedUser
            ? `md:grid-cols-[1fr_1.5fr_1fr]
        xl:grid-cols-[1fr_2fr_1fr]`
            : "md:grid-cols-2"
        }`}
      >
        <SideBar />
        <ChatContainer />
        <RightSideBar />
      </div>
    </div>
  );
};

export default HomePage;
