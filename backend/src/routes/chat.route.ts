import { FastifyInstance } from "fastify";

import * as service from "../services/chat.service.js";

export async function chatRoutes(

  fastify:FastifyInstance

){

  fastify.get(

    "/token",

    async(request,reply)=>{

      try{

        const payload =
          await request.jwtVerify<{
            id:number;
          }>();

        return await service.generateToken(
          payload.id
        );

      }

      catch{

        return reply
          .status(401)
          .send({

            message:
              "No autorizado."

          });

      }

    }

  );

  fastify.post(

    "/channel",

    async(request,reply)=>{

      try{

        const payload =
          await request.jwtVerify<{
            id:number;
          }>();

        const{

          professionalUserId,

        }=
          request.body as{

            professionalUserId:number;

          };

        return await service.createChannel(

          payload.id,

          professionalUserId

        );

      }

      catch(error){

        if(

          error instanceof Error &&

          error.message==="CHAT_NOT_ALLOWED"

        ){

          return reply
            .status(403)
            .send({

              message:
                "No tienes acceso a este chat."

            });

        }

        if(

          error instanceof Error &&

          error.message==="CHAT_DISABLED"

        ){

          return reply
            .status(403)
            .send({

              message:
                "El chat está deshabilitado."

            });

        }

        if(

          error instanceof Error &&

          error.message==="USER_NOT_FOUND"

        ){

          return reply
            .status(404)
            .send({

              message:
                "Usuario no encontrado."

            });

        }

        console.error(error);

        return reply
          .status(500)
          .send({

            message:
              "Error interno."

          });

      }

    }

  );

  fastify.get(
    "/channel/:channelId",

    async(request,reply)=>{

      try{

        const payload =
          await request.jwtVerify<{
            id:number;
          }>();

        const {

          channelId,

        }=
          request.params as{

            channelId:string;

          };

        return await service.verifyChannelAccess(

          payload.id,

          channelId

        );

      }

      catch(error){

        if(

          error instanceof Error &&

          (

            error.message==="CHAT_NOT_ALLOWED" ||

            error.message==="CHAT_DISABLED"

          )

        ){

          return reply
            .status(403)
            .send({

              message:
                "No autorizado."

            });

        }

        return reply
          .status(500)
          .send({

            message:
              "Error interno."

          });

      }

    }

  );

}