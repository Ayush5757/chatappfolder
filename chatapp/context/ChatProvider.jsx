import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "./ChatContext";
import { AuthContext } from "./AuthProvider";
import toast from "react-hot-toast";

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unSeenMessages, setUnseenMessages] = useState({});

  const { socket, axios, setOnlineUsers } = useContext(AuthContext);

  const getUsers = async () => {

    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unSeenMessages || {});
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.message || []);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  async function sendMessage(messageData) {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prevMessages) => [
          ...(prevMessages || []),
          data.newMessage,
        ]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const subscribeToMessages = async () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...(prevMessages || []), newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnseenMessages = {}) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
            ? prevUnseenMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
    socket.on("getOnlineUsers", (socketIdObj) => {
      setOnlineUsers([...socketIdObj]);
    });
  };

  function unSubscribeFromMessages() {
    if (socket) socket.off("newMessage");
  }

  useEffect(() => {
    subscribeToMessages();
    return () => unSubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    unSeenMessages,
    setUnseenMessages,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
