import { Request  , Response} from "express"
import jwt from "jsonwebtoken"
require("dotenv").config();

export const authentication = async(req : Request , res : Response , next : ()=>{}) =>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({Status : false , error : "Unauthorized"})
    }
    try{
        const user = jwt.verify(token , process.env.JWT_SECRET || "secret");
        req.body.user = user;
        next();
    }catch(error){
        console.log(error);
        return res.status(401).json({Status : false , error : "Unauthorized"})
    }
}