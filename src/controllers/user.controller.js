import { createAccessToken } from "../libs/jwt.js";
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from "../config.js";

export const register = async(req, res)=>{
    const {username, email, password} = req.body;

    try{
        const userFound = await User.findOne({email})
        if (userFound)
            return res.status(400).json(["el email ya esta en uso"])

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({
            username, email, password: passwordHash
        })
        //guardar documento en la base de datos
        const saveUser = await newUser.save();
        // utilizar token
        const token = await createAccessToken({id:saveUser._id})
        //crear una cookie en el navegador o cliente con express
        res.cookie("token", token)
        //respesta cliente
        res.json({
            email: saveUser.email,
            username: saveUser.username,
            id: saveUser.id
        })
    }catch(error){
        res.status(500).json([error.message])
    }
}

export const login = async(req, res)=>{
    const {email, password} = req.body;

    try{
        const userFound = await User.findOne({email})
        if (!userFound) return res.status(400).json(["User no found"])

        //verificar password 
        const isMatch = await bcrypt.compare(password, userFound.password)
        if  (!isMatch) return res.status(400).json(["Incorrect password"])

        //utilizar el token
        const token = await createAccessToken({id:userFound._id})
        //generar en el navegador o en el cliente una cookie donde guarde en la variable token el token
        res.cookie("token",token)

        //respuesta al cliente
        res.json({
            email:userFound.email,
            username: userFound.username,
            id: userFound.id,
            createAt : userFound.createdAt
        })
    }catch(error){
        res.status(400).json({message:error.message})
    }
}

// resetear la sesion del usuario, guarde la misma variable pero que la resete a vacio
export const logout = (req,res)=>{
    res.cookie("token", "",{
        expires: new Date(0),
    });
    return res.sendStatus(200)
}

export const profile = async (req,res)=>{
    //obtener el usuario y lo busca por id
    const userFound = await User.findById(req.user.id)

    if(!userFound) return res.status(400).json(["Usuario no encontrado"]);

    return res.json({
        id: userFound._id,
        usename: userFound.username,
        email: userFound.email,
    })
}