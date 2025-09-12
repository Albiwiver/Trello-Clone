// src/services/userService.ts
import { api } from "./api"
import { User } from "@/types/user";



export const userService = {
  create:(payload:{fullName:string, email:string, password:string}) =>
    api.post("/users", payload).then(res => res.data),

  login: async(email: string, password: string) =>{
    const {data} = await api.post<User>("/auth/login", { email, password })
    return data
    

     } 
    
};
