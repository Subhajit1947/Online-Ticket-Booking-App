import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String
    },
    phone:{
        type:Number
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export {User}
