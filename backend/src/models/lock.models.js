import mongoose,{Schema} from "mongoose";


const lockedSchema=new Schema(
    {
        show:{
            type:Schema.Types.ObjectId,
            ref:'Show'
        },
        showseat:{
            type:Schema.Types.ObjectId,
            ref:'Showseat'
        },
        enteringtime:{
            type:Date,
            default:Date.now
        }
    },{ timestamps: true }
)
export const Lock=mongoose.model('Lock',lockedSchema)