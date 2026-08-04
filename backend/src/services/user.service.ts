import * as userRepository from "../repositories/user.repository.js";
import * as professionalRepository from "../repositories/professional.repository.js";

export async function getPublicProfile(
  username:string
){
  const user =
    await userRepository.findPublicProfile(
      username
    );

  if(!user){
    throw new Error("USER_NOT_FOUND");
  }

  return user;
}

export async function getMyProfile(
  id: number
) {

  const user =
    await userRepository.findMyProfile(id);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const professional =
    await professionalRepository.findProfessionalByUserId(id);

  return {
    ...user,
    professional,
  };

}

export async function updateMyProfile(
  id:number,
  data:any
){

  await userRepository.updateProfile(
    id,
    data
  );

  return {
    message:"Perfil actualizado"
  };

}
