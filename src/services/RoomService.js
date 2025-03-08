import { httpClient } from "../config/AxoisHelper"

export const createRoomApi= async (roomDetail)=>{
   const responce= await httpClient.post(`/api/v1/rooms` , roomDetail,{
      headers:{
         "Content-Type":"text/plain",
      }
   });
   return responce.data;
}

export const joinChatApi=async(roomId)=>{
   const responce=await httpClient.get(`/api/v1/rooms/${roomId}`);

   return responce.data;

}