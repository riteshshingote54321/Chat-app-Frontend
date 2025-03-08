import { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../Context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { baseURL } from "../config/AxoisHelper";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";


const ChatPage=()=>{

    const {roomId , currentUser , connected} = useChatContext();

    // console.log(roomId);
    // console.log(currentUser);
    // console.log(connected);
    
    const navigate= useNavigate()
    
    useEffect(()=>{
        if(!connected){
            navigate('/');
        }
    } , [connected , roomId , currentUser])
    
    

    const [messages , setMessages]=useState([

       {
        content:"hello",
        sender:"Ritesh",
       },
       {
        content:"hello",
        sender:"Ritesh",
       },
       {
        content:"hello",
        sender:"milind",
       },
       {
        content:"hello",
        sender:"Ritesh",
       },
       {
        content:"hello",
        sender:"milind",
       },
     
    
    ]);
    const [input , setinput]=useState("");
    const inputRef=useRef(null);
    const chatRef = useRef(null);
    const [stompClient , setStompClient]=useState(null);
    

    //load the massage

    //init the stompClient
    // useEffect(()=>{
    //     const connectWebSocked=()=>{
    //         //sockJs
    //         const sock = new SockJS(`${baseURL}/chat`);

    //         const client = Stomp.over(sock);
    //         client.connect({} , ()=>{
    //             setStompClient(client);
    //             toast.success("Connected");
    //             client.subscribe(`/topic/room/${roomId}`,(message)=>{
    //                 console.log(message);
    //                 const newMessage = JSON.parse(message.body);
    //                 setMessages((prev)=>[...prev, newMessage]);

                    
    //             })
    //         } )
    //     }
    //     connectWebSocked();
    //     //stomp client
    // },[roomId])


    useEffect(() => {
        if (!roomId) return;
    
        const connectWebSocket = () => {
            const sock = new SockJS(`${baseURL}/chat`);
            const client = Stomp.over(sock);
    
            client.connect({}, () => {
                setStompClient(client);
                toast.success("Connected");
    
                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    console.log("Received message:", newMessage);
    
                    // ✅ Update state with received messages
                    setMessages((prev) => [...prev, newMessage]);
                });
            });
        };
    
        connectWebSocket();
    
        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, [roomId]);
    



    // send massages
    // const sendMessage=async ()=>{
    //     if(stompClient && connected && input.trim()){
            
         
    //         const message={
    //         sender:currentUser,
    //         content:input,
    //         roomId:roomId
    //     }            

    //     stompClient.send(
    //         `/app/sendMessage/${roomId}`,
    //         {},
    //         JSON.stringify(message)
    //       );
    //       console.log(message);
    //     // setMessages({...,content:message.content, sender:message.sender});
    //       setinput("");
          
    //     }
    // }


    const sendMessage = async () => {
        if (stompClient && connected && input.trim()) {
            const message = {
                sender: currentUser,
                content: input,
                roomId: roomId
            };
    
            stompClient.send(
                `/app/sendMessage/${roomId}`,
                {},
                JSON.stringify(message)
            );
    
            console.log(message);
    
            // ✅ Update the state immediately to show the sent message in UI
            setMessages((prev) => [...prev, message]);
    
            setinput("");
        }
    };
    
    return(
        <div>
           <header className="dark:border-gray-700 h-20 fixed w-full border dark:bg-gray-900 shadow flex gap-3 justify-around mt-0 py-3 items-center ">  
            <div>
                <h1 className="text-x1 font-semibold">
                    Room : <span>Family Room</span>
                </h1>
            </div>

            <div>

            <h1 className="text-x1 font-semibold">
                    User : <span>Ritesh Shingote</span>
                </h1>
            </div>

            <div>
                <button className="dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-lg">Leave Room</button>
            </div>
           </header>


        <main className="py-20 px-10 border w-2/3 dark:bg-slate-600 mx-auto h-screen overflow-auto">
        {
           messages.map((message, index) => {
            console.log("Rendering message:", message);
            return (
                <div key={index} className={`flex ${message.sender === currentUser ? "justify-end" : "justify-start"}`}>
                    <div className={`my-2 ${message.sender === currentUser ? 'bg-blue-800' : 'bg-gray-800'} p-2 max-w-xs rounded`}>
                        <div className="flex flex-row gap-2">
                            <img className="h-10 w-10 gap-2" src={'https://avatar.iran.liara.run/public/27'} alt="" />
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-bold">{message.sender} </p>
                                <p>{message.content} </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        })
        
        }
        </main>





        <div className="fixed bottom-4 w-full h-14 ">
        <div className="h-full pr-10 gap-4 flex items-center justify-between rounded  w-1/2 mx-auto dark:bg-gray-900">
            <input value={input} onChange={(e)=>{setinput(e.target.value)}} type="text"  placeholder="Type message hare"  className="dark:border-gray-600 px-5 w-full dark:bg-gray-800  py-2 rounded-full h-full focus:outline-none "/>
            <div className="flex gap-1">
            <button className="dark:bg-orange-600 h-10 w-10 rounded-full flex justify-center items-center"><MdAttachFile size={20}/></button>
            <button onClick={sendMessage} className="dark:bg-blue-600 h-10 w-10 rounded-full flex justify-center items-center"><MdSend size={20}/></button>
            </div>
        </div>
        </div>

        </div>
    )
}
export default ChatPage;