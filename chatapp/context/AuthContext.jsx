import React, { useEffect } from "react";
import { AuthContext } from "./AuthProvider.js";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from 'socket.io-client'

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;


export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null)

  const checkAuth = async ()=> {
    try {
      const { data } = await axios.get('/api/auth/check');
      
      if(data.success){
        setAuthUser(data.user)
        connectSocket(data.user)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const connectSocket = (userData)=>{
    if(!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id
      }
    })
    if(newSocket){
      newSocket.connect();
      setSocket(newSocket)
    }
  }

  const login = async(state, credentials)=>{
    try {
      const { data } = await axios.post(`/api/auth/${state}`,credentials);
      if(data.success){
        setAuthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common['token'] = data.token;
        setToken(data.token);
        localStorage.setItem('token', data.token)
        toast.success(data.message)
        return true
      } else {
        toast.error('Please enter right information')
        return false
      }
    } catch (error) {
      toast.error('Something went wrong')
      console.log('error = ',error);
      return false
    }
  }

  const logout = async () =>{
    localStorage.removeItem('token')
    setToken(null)
    setAuthUser(null)
    setOnlineUsers([])
    axios.defaults.headers.common['token'] = null
    toast.success('Logged out successfully')
    socket.disconnect();
  }

  const updateProfile = async(body)=>{
    try{
      const { data } = await axios.put('/api/auth/update-profile', body)
      if(data.success){
        setAuthUser(data.user)
        toast.success('Profile update successfully')
      }
    } catch(error){
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if (token) {
      axios.defaults.headers.common['token'] = token;
    }
    
    checkAuth()
  },[])

  const value = {
    axios,
    authUser,
    onlineUsers,
    setOnlineUsers,
    socket,
    login,
    logout,
    updateProfile
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
