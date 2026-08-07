import { getStreamClient } from "../providers/stream.provider.js";

const stream =
  getStreamClient();

export async function upsertUser(
  user: {
    id:number;
    username:string;
    fotoPerfil:number;
  }
){

  await stream.upsertUser({

    id:
      user.id.toString(),

    name:
      user.username,

    image:
      user.fotoPerfil.toString(),

  });

}

export function createUserToken(
  userId:number
){

  return stream.createToken(
    userId.toString()
  );

}

export async function createChannel(

  channelId:string,

  clientId:number,

  professionalUserId:number,

){

  const channel =
    stream.channel(

      "messaging",

      channelId,

      {

        created_by_id:
          clientId.toString(),

        members:[

          clientId.toString(),

          professionalUserId.toString(),

        ],

      }

    );

  await channel.create();

  return {

    id:
      channel.id!

  };

}

export async function addMembers(

  channelId:string,

  members:number[]

){

  const channel =
    stream.channel(
      "messaging",
      channelId
    );

  await channel.addMembers(

    members.map(
      member =>
        member.toString()
    )

  );

}

export async function removeMembers(

  channelId:string,

  members:number[]

){

  const channel =
    stream.channel(
      "messaging",
      channelId
    );

  await channel.removeMembers(

    members.map(
      member =>
        member.toString()
    )

  );

}