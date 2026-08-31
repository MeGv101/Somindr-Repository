import * as chatRepository from "../repositories/chat.repository.js";
import * as userRepository from "../repositories/user.repository.js";
import * as professionalRepository from "../repositories/professional.repository.js";

export async function syncUser(
  userId:number
){

  const user =
    await userRepository.findMyProfile(
      userId
    );

  if(!user){
    throw new Error(
      "USER_NOT_FOUND"
    );
  }

  await chatRepository.upsertUser({

    id:user.id,

    username:user.username,

    fotoPerfil:user.fotoPerfil,

  });

}

export async function generateToken(
  userId:number
){

  await syncUser(
    userId
  );

  return{

    token:
      await chatRepository.createUserToken(
        userId
      )

  };

}

export async function createChannel(

  clientId:number,

  professionalUserId:number

){

  const relation =
    await professionalRepository.findProfessionalClient(

      clientId,

      professionalUserId

    );

  if(!relation){

    throw new Error(
      "CHAT_NOT_ALLOWED"
    );

  }

  if(!relation.active){

    throw new Error(
      "CHAT_DISABLED"
    );

  }

  await syncUser(
    clientId
  );

  await syncUser(
    professionalUserId
  );

  const channelId =
    `dm_${relation.id}`;

  await chatRepository.createChannel(

    channelId,

    clientId,

    professionalUserId

  );

  return{

    channelId

  };

}

export async function verifyChannelAccess(

  userId:number,

  channelId:string

){

  if(

    !channelId.startsWith("dm_")

  ){

    throw new Error(
      "INVALID_CHANNEL"
    );

  }

  const relationId =
    Number(

      channelId.replace(
        "dm_",
        ""
      )

    );

  const relation =
    await professionalRepository
      .findProfessionalClientById(
        relationId
      );

  if(

    !relation

  ){

    throw new Error(
      "CHAT_NOT_ALLOWED"
    );

  }

  if(

    !relation.active

  ){

    throw new Error(
      "CHAT_DISABLED"
    );

  }

  if(

    relation.clientId !== userId &&

    relation.professionalUserId !== userId

  ){

    throw new Error(
      "CHAT_NOT_ALLOWED"
    );

  }

  return{

    allowed:true

  };

}