import {Request, Response} from "express"
import { ProfileUserService } from "../services/ProfileUserService";

class ProfileUserController{
  async handler(request:Request, response:Response){
    const { user_id } = request 
    const service = new  ProfileUserService();
    try{
      const result = await service.execute(user_id);
      return response.json(result);
    }catch(err){
      return response.json({error:err.message})
    }
  }
}
export { ProfileUserController }