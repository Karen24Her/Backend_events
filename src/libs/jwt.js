import { resolve } from "path";
import { TOKEN_SECRET } from "../config.js";
import jwt from 'jsonwebtoken'
import { rejects } from "assert";

export function createAccessToken(payLoad){
    //onjeto global de node
    return new Promise((resolve,reject)=>{
        jwt.sign(
            payLoad,
            TOKEN_SECRET,
            {
                //dura un dia el token si pasan 24 horas se cierra sesion
                expiresIn: "1d",
            },
            (err, token) =>{
                if(err) reject(err)
                    resolve(token)
            }
        )
    })
}