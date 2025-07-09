import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthProvider'
const ProfilePage = () => {
  const {authUser, updateProfile} = useContext(AuthContext)
  const [selectImage, setSelectImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName)
  async function handelSubmit(e){
    e.preventDefault();
    if(!selectImage){
      await updateProfile({fullName: name});
      navigate('/');
      return
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectImage)
    reader.onload = async ()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image, fullName: name})
      navigate('/')
    }
  }
  return (
    <div className='bg-gradient-to-r from-black via-gray-900 to-black min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl  bg-gradient-to-r from-black via-gray-900 to-black text-gray-200 border-2 border-gray-600 flex items-center
        justify-between max-sm:flex-col-reverse rounded-lg'>
          <form action="" onSubmit={handelSubmit} className='flex flex-col gap-5 p-10 flex-1'>
            <h3 className='text-lg'> Profile details </h3>
            <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
              <input type="file" id='avatar' onChange={(e)=>e.target.files[0] && setSelectImage(e.target.files[0])} accept='.png, .jpg, .jpeg' hidden/>
              <img src={selectImage? URL.createObjectURL(selectImage): assets.avatar_icon} 
              alt="select image logo" className={`w-12 h-12 ${selectImage && 'rounded-full'}`}/>
              upload profile image
            </label>
            <input type="text" onChange={(e)=>setName(e.target.value)} value={name} required placeholder='Your Name'
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-violet-500'/>
            <button type='submit' className='text-white p-2 rounded-full text-lg cursor-pointer bg-violet-600 w-[50%]'>Save</button>

          </form>
          <img src={authUser?.profilePic || assets.logo_icon} alt="user profile image" className={`max-w-44 aspect-square rounded-full mx-10
            max-sm:mt-10 ${selectImage && 'rounded-full'}`}/>
      </div>
    </div>
  )
}

export default ProfilePage