import React, { useState } from "react";
import chatIcon from "../assets/live-chat.png"
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../Context/ChatContext";
import { useNavigate } from "react-router";
const JoinCreateChat=()=>{
    const [detail , setDetails]=useState({
        roomId:"",
        userName:"",
    })

   const {roomId , userName, connected , setRoomId, setCurrentUser, setConnected } = useChatContext();
    const navigate= useNavigate();


function handleFormInputChange(event){
    setDetails({
        ...detail,
        [event.target.name]: event.target.value,
    })

}
function validateForm(){
    if(detail.roomId === "" || detail.userName === ""){
        toast.error("Invalid Input !!");
        return false;
    }
    return true;
}

async function joinChat(){
    if(validateForm()){
     
      try{
        const room=  await joinChatApi(detail.roomId);
        toast.success("Joined...");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
         setConnected(true);
         navigate("/chat")

      }catch(error){
        if(error.status == 400)
        {
            toast.error(error.responce.data);
        }
        else{
            toast.error("Error In Joining Room")
           
        }
        console.log(error);
      }
    }
}

async function createRoom(){
    if(validateForm()){
        console.log(detail);
        try{
           const responce=await createRoomApi(detail.roomId)
           console.log(responce);
           toast.success("Room Created Successfully");
           //join the room
           setCurrentUser(detail.userName);
           setRoomId(responce.roomId);
            setConnected(true);
            navigate("/chat")
           //forword to chat pages
        }catch (error) {
            console.log(error);
            if(error.status == 400){
                toast.error("Room Id Is Already Exist");
            }else{
            toast.error("Error In Creating Room");
            }
            
        }
    }
}



    return(
        <div className="min-h-screen flex items-center justify-center"> 
            <div className="p-10 dark:border-gray-700 border w-full flex flex-col gap-5 max-w-md rounded dark:bg-gray-900 shadow">
                <div>
                    <img src={chatIcon} className="w-24 mx-auto "/>
                </div>
                <h1 className="text-2xl font-semibold text-center ">Join Room / Create Room</h1>
                <div>
                    <label htmlFor="" className="block font-medium mb-2"> Your Name</label>
                    <input onChange={handleFormInputChange}
                    value={detail.userName}
                     type="text"
                    id="name"
                    name="userName"
                    placeholder="Enter the Name"
                    className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>



                <div>
                    <label htmlFor="" className="block font-medium mb-2"> New Room ID</label>
                    <input
                    name="roomId"
                    onChange={handleFormInputChange}
                    value={detail.roomId}
                     type="text"
                    id="name"
                    placeholder="Enter Room Id"
                    className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* button */}
                <div className="flex justify-center gap-2 mt-4">
                    <button onClick={joinChat} className="px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-lg">
                        Join Room
                    </button>

                    <button onClick={createRoom} className="px-3 py-2 dark:bg-orange-500 hover:dark:bg-orange-800 rounded-lg">
                        Create Room
                    </button>
                </div>
            </div>
        </div>
    )
}

export default JoinCreateChat;