import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFile';
import { IoClose } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import Loading from "./Loading";
import backgroundImage from '../assets/walpaper.jpeg'
import { IoMdSend } from "react-icons/io";
import moment from 'moment'



const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });
  const [openImageVideoUpload,setOpenImageVideoUpload] = useState(false)
  const [message,setMessage] = useState({
    text : "",
    imageUrl : "",
    videoUrl : ""
  })
  const [loading,setLoading] = useState(false)
  const [allMessage,setAllMessage] = useState([])
  const currentMessage = useRef(null)

  useEffect(()=>{
      if(currentMessage.current){
          currentMessage.current.scrollIntoView({behavior : 'smooth', block : 'end'})
      }
  },[allMessage])

  const handleUploadImageVideoOpen = ()=>{
    setOpenImageVideoUpload(preve => !preve)
  }

  const handleUploadImage = async(e)=>{
    const file = e.target.files[0]

    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)

    setMessage(preve => {
      return{
        ...preve,
        imageUrl : uploadPhoto.url
      }
    })
  }
  const handleClearUploadImage = ()=>{
    setMessage(preve => {
      return{
        ...preve,
        imageUrl : ""
      }
    })
  }

  const handleUploadVideo = async(e)=>{
    const file = e.target.files[0]

    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)

    setMessage(preve => {
      return{
        ...preve,
        videoUrl : uploadPhoto.url
      }
    })
  }
  const handleClearUploadVideo = ()=>{
    setMessage(preve => {
      return{
        ...preve,
        videoUrl : ""
      }
    })
  }

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);

      socketConnection.emit('seen',params.userId)

      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });

      socketConnection.on('message',(data)=>{
        console.log('message data',data)
        setAllMessage(data)
      })
    }
  }, [socketConnection, params?.userId, user]);

  const handleOnChange = (e)=>{
    const { name, value} = e.target

    setMessage(preve => {
      return{
        ...preve,
        text : value
      }
    })
  }

  const handleSendMessage = (e)=>{
    e.preventDefault()

    if(message.text || message.imageUrl || message.videoUrl){
      if(socketConnection){
        socketConnection.emit('new message',{
          sender : user?._id,
          receiver : params.userId,
          text : message.text,
          imageUrl : message.imageUrl,
          videoUrl : message.videoUrl,
          msgByUserId : user?._id
        })
        setMessage({
          text : "",
          imageUrl : "",
          videoUrl : ""
        })
      }
    }
  }

  return (
    // style={{ backgroundImage : `url(${backgroundImage})`}} className='bg-no-repeat bg-cover'
    <div >
      <header className="sticky top-0 h-16 bg-gray-800 flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden ">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            <p className="-mt-5px text-sm">
              {dataUser.online ? (
                <span className="text-green-600">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>

        <div>
          <button className="cursor-pointer hover:text-primary">
            <HiDotsVertical />
          </button>
        </div>
      </header>
      {/* **show all message */}
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-800 bg-opacity-50">
        <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
                    {
                      allMessage.map((msg,index)=>{
                        return(
                          <div className={` p-1 py-1 rounded-lg w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg?.msgByUserId ? "ml-auto bg-green-700" : "bg-black"}`}>
                            <div className=' text-ellipsis line-clamp-1'>
                              {
                                msg?.imageUrl && (
                                  <img 
                                    src={msg?.imageUrl}
                                    className='w-full h-full object-scale-down'
                                  />
                                )
                              }
                              {
                                msg?.videoUrl && (
                                  <video
                                    src={msg.videoUrl}
                                    className='w-full h-full object-scale-down'
                                    controls
                                  />
                                )
                              }
                            </div>
                            <p className='px-2'>{msg.text}</p>
                            <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm')}</p>
                          </div>
                        )
                      })
                    }
                  </div> 
        {/* *upload Image display */}
        {
                    message.imageUrl && (
                      <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                        
                        <div onClick={handleClearUploadImage} className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' >
                            <RiDeleteBin6Line size={30}/>
                        </div>

                        <div className='bg-transparent p-3'>
                            <img
                              src={message.imageUrl}
                              alt='uploadImage'
                              className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                            />
                        </div>
                      </div>
                    )
                  }
        {/* *upload video display */}
         {
                    message.videoUrl && (
                      <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                        <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadVideo}>
                            <RiDeleteBin6Line size={30}/>
                        </div>
                        <div className='bg-black p-3'>
                            <video 
                              src={message.videoUrl} 
                              className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                              controls
                              muted
                              autoPlay
                            />
                        </div>
                      </div>
                    )
                  } 
         {
                    loading && (
                      <div className='w-full h-full flex sticky bottom-0 justify-center items-center'>
                        <Loading/>
                      </div>
                    )
                  } 
      </section>
      {/* *send message */}
       <section className='h-16 bg-gray-800 flex items-center px-4'>
              <div className='relative '>
              
                  <button title="attach" onClick={handleUploadImageVideoOpen}  className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-gray-900 hover:text-white'>
                    <FaPlus size={20}/>
                  </button>

                  {/* *video and image */}
                  {
                    openImageVideoUpload &&
                     (
                      <div className='bg-gray-800 shadow rounded absolute bottom-14 w-36 p-2'>
                      <form>
                          <label htmlFor='uploadImage' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-700 cursor-pointer'>
                              <div className='text-primary'>
                                  <FaImage size={18}/>
                              </div>
                              <p>Image</p>
                          </label>
                          <label htmlFor='uploadVideo' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-700 cursor-pointer'>
                              <div>
                                  <FaVideo size={18}/>
                              </div>
                              <p>Video</p>
                          </label>

                          <input 
                            type='file'
                            id='uploadImage'
                            onChange={handleUploadImage}
                            className='hidden'
                          />

                          <input 
                            type='file'
                            id='uploadVideo'
                            onChange={handleUploadVideo}
                            className='hidden'
                          />
                      </form>
                      </div>
                    )
                  }
                  
              </div>

              {/* *input box */}
              <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
                  <input
                    type='text'
                    placeholder='Type a message...'
                    className='py-1 px-4 outline-none w-full h-full bg-gray-800'
                    value={message.text}
                    onChange={handleOnChange}
                  />
                  <button className='text-white'>
                      <IoMdSend size={28}/>
                  </button>
              </form>
              
          </section> 
    </div>
  );
};

export default MessagePage;
