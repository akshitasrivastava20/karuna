import { PhoneNumber } from '@clerk/nextjs/server';
import {Schema,model,models} from 'mongoose';

const UserSchema=new Schema({
    clerkId:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user"
    },
    phonenumber:{
        type:Number,
        required:true
    }

})

const User=models?.User||model("User",UserSchema);

export default User;