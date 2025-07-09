import React, { useContext, useEffect, useRef, useState } from "react";
import assets  from "../assets/assets";
import { formateMessageTime } from "../library/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthProvider";
import toast from "react-hot-toast";

const ChatContainer = () => {

  const {messages, selectedUser, setSelectedUser, sendMessage, getMessages} = useContext(ChatContext)
  
  const { authUser, onlineUsers } = useContext(AuthContext)
  const [input, setInput] = useState('');
  const scrollRef = useRef()

  useEffect(()=>{
    if(scrollRef.current && messages){
     scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  },[messages])

  useEffect(()=>{
    if(selectedUser){
      getMessages(selectedUser._id)
    }
  },[selectedUser])

  async function handelSendMessage(e){
    e.preventDefault();
    if(input.trim() === '') return null;
    await sendMessage({text: input.trim()});
    setInput(''); 
  }

  function handelSendImage(e){
    const file = e.target.files[0];
    if(!file || !file.type.startsWith('image/')){
      toast.error('Select an image file');
      return
    }
    const reader = new FileReader();
    reader.onloadend = async ()=>{
      await sendMessage({image: reader.result})
      e.terget.value = ''
    }
    reader.readAsDataURL(file);
  }

  return selectedUser ? (
    <div className=" bg-gradient-to-r from-black via-gray-900 to-black  h-full overflow-scroll relative">
      {/* header of chat (middle) part */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="user profile"
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          <span className={`w-2 h-2 rounded-full ${onlineUsers.includes(selectedUser._id)?'bg-green-500':'bg-gray-500'}`}></span>
        </p>
        <img
          src={assets.arrow_icon}
          onClick={() => setSelectedUser(null)}
          alt="arrow icon"
          className="md:hidden max-w-7"
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
      </div>
      {/* main part chat */}

      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6 ">
        {messages?.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg?.senderId !== authUser._id && "flex-row-reverse"
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt="image"
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30
                text-white ${
                  msg.senderId === authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img src={msg?.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="images" className="w-7 rounded-full" />
              <p className="text-gray-500">{formateMessageTime(msg?.createdAt)}</p>
            </div>
          </div>
        ))}
        <span ref={scrollRef}></span>
      </div>
      {/* message typing area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input type="text" placeholder="Send a message" onChange={(e)=>setInput(e.target.value)} value={input}
          onKeyDown={(e)=> e.key === 'Enter' && handelSendMessage(e)} 
          className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"/>
          <input type="file" id="image" onChange={handelSendImage} accept="image/png, image/jpeg" hidden/>
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="Select gallery image" className="w-5 mr-2 cursor-pointer" />
          </label>
        </div>
        <img src={assets.send_button} alt="send button" onClick={(e)=>handelSendMessage(e)} 
        className="w-7 cursor-pointer rotate-45"/>
      </div>
    </div>
  ) : (
    <div className=" bg-gradient-to-r from-black via-gray-900 to-black flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="app logo" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
