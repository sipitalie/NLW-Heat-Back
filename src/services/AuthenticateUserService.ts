import axios from "axios";
import prismaClient from '../prisma';
import { sign } from 'jsonwebtoken'

interface IAccessTokenResponse{
  access_token:string
}
interface IUserResponse{
  login: string,
  id: number,
  avatar_url:string,
  name: string,
}

class AuthenticateUserService{
  async execute(code:string){
    const url = 'https://github.com/login/oauth/access_token';
   
    const {data:accessTokenResponse} = await axios.post<IAccessTokenResponse>(url,null,{
      params:{
        client_id:process.env.GITHUB_CLIENT_ID,
        client_secret:process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      headers:{
        Accept: "application/json",
      },
    }) 
    const response = await axios.get<IUserResponse>('https://api.github.com/user',{
      headers:{
        authorization:` Bearer ${accessTokenResponse.access_token}`
      }
    })
    const { login, id, avatar_url, name } = response.data

    let user =  await prismaClient.user.findFirst({
      where:{
        github_id:id
      }
    })
    if(!user){
      user = await prismaClient.user.create({
        data:{
          github_id:id,
          name: name,
          avatar_url:avatar_url,
          login:login,
        }
      })
    }
    const token =sign(
      {
        user:{
          name:user.name,
          avatar_url:user.avatar_url,
          id:user.id
        }
      },
      process.env.HASH_CREAT_TOKEN_JWT_SECRET,
      {
        subject:user.id,
        expiresIn:"2d"
      }
    )
    return { token, user };

  }
}
export {AuthenticateUserService}