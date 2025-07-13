import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import { ChatContext } from "../../context/ChatContext";
const SideBar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unSeenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const { logout, onlineUsers } = useContext(AuthContext);
  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;
  const [isPopupopen, setIsPopupOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handelEvent(event) {
      console.log("event ", event);
      if (ref.current && !ref.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    }
    document.addEventListener("mousedown", handelEvent);
    return () => {
      document.removeEventListener("mousedown", handelEvent);
    };
  }, []);

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div
      className={`border-r-1 border-gray-700 h-full p-5  overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
     
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative py-2 group/menu"  ref={ref}>
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="max-h-5 cursor-pointer"
              onClick={() => setIsPopupOpen(true)}
            />
            <div
              className={`absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600
              text-gray-100 ${
                isPopupopen ? "block" : "hidden"
              } group-hover/menu:block `}
            >
              <p
                onClick={() => {
                  navigate("/profile");
                }}
                className="cursor-pointer text-sm"
              >
                {" "}
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={() => logout()} className="cursor-pointer text-sm">
                LogOut
              </p>
            </div>
          </div>
        </div>
        {/* -------------input section */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="search" className="w-3" />
          <input
            type="text"
            className="bg-transparent border-none outline-none text-white text-sm
          placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </div>
      </div>

      <div className="flex flex-col">
        {filteredUsers.map((user) => (
          <div
            key={user?.email}
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            className={`relative border-b-2 border-b-gray-900 hover:bg-gray-800 flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm
            ${selectedUser?._id === user?._id && "bg-[#282142]/50"}`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt="user profile pic"
              className="w-[35px] aspect-[1/1] rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {onlineUsers.includes(user._id) ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>
            {unSeenMessages?.[user._id] > 0 && (
              <p
                className="absolute top-3 right-4 text-xs h-5 w-5 flex justify-center items-center
                rounded-full bg-violet-500/50"
              >
                {unSeenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
