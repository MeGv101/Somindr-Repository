import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { useAuth } from "../context/authContext";

import { streamClient } from "../lib/stream";

import { getChatToken, verifyChannel } from "../services/chat";

import type { Channel as StreamChannel } from "stream-chat";

import {

  Chat,

  Channel,

  Window,

  MessageList,

  MessageComposer,

  ChannelHeader,

} from "stream-chat-react";

import "stream-chat-react/dist/css/index.css";

export default function Messages(){

  const { channelId } =
    useParams();

  const { user } =
    useAuth();

  const [

    loading,

    setLoading

  ]=
    useState(true);

  const [

    channel,

    setChannel

  ]=
    useState<
      StreamChannel | null
    >(null);

  useEffect(()=>{

    if(

      !user ||

      !channelId

    ){

      return;

    }

    if (!user || !channelId) {
        return;
      }

      const currentUser = user;
      const currentChannelId = channelId;

    let mounted=true;

    async function connect(){

      try{

        if(

          streamClient.userID !==
          currentUser.id.toString()

        ){

          try{

            await streamClient.disconnectUser();

          }

          catch{}

          await verifyChannel(
            currentChannelId
          );

          const token =
            await getChatToken();

          await streamClient.connectUser(

            {

              id:
                currentUser.id.toString(),

              name:
                currentUser.username,

            },

            token

          );

        }

        const ch =
          streamClient.channel(

            "messaging",

            currentChannelId

          );

        await ch.watch();

        if(mounted){

          setChannel(ch);

        }

      }

      catch(error){

        console.error(error);

      }

      finally{

        if(mounted){

          setLoading(false);

        }

      }

    }

    connect();

    return ()=>{

      mounted=false;

    };

  },[

    user,

    channelId,

  ]);

  if(loading){

    return(

      <main>

        <h2>

          Cargando chat...

        </h2>

      </main>

    );

  }

  if(!channel){

    return(

      <main>

        <h2>

          No se pudo abrir el chat.

        </h2>

      </main>

    );

  }

  return(

    <Chat

      client={streamClient}

    >

      <Channel

        channel={channel}

      >

        <Window>

          <ChannelHeader/>

          <MessageList/>

          <MessageComposer/>

        </Window>

      </Channel>

    </Chat>

  );

}