import axios from "axios";

export async function openChat(
  professionalUserId:number
){

  const response =
    await axios.post(

      "/api/chat/channel",

      {

        professionalUserId,

      },

      {

        headers:{

          Authorization:
            `Bearer ${localStorage.getItem("token")}`

        }

      }

    );

  return response.data.channelId;

}

export async function getChatToken(){

  const response =
    await axios.get(

      "/api/chat/token",

      {

        headers:{

          Authorization:
            `Bearer ${localStorage.getItem("token")}`

        }

      }

    );

  return response.data.token;

}
export async function verifyChannel(

  channelId:string

){

  await axios.get(

    `/api/chat/channel/${channelId}`,

    {

      headers:{

        Authorization:
          `Bearer ${localStorage.getItem("token")}`

      }

    }

  );

}