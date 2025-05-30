import mongoose from "mongoose";
import { type } from "os";

const ClientSchema = new mongoose.Schema({
    nombre:{
        type: String,
    },
    descripcion:{
        type: String,
    },
    telefono:{
        type: String,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
   timestamps:true 
})

export default mongoose.model('Client', ClientSchema)