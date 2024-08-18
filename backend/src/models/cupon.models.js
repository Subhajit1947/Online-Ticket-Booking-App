import mongoose,{Schema} from "mongoose";

const cuponSchema = new Schema({
    cuponcode: {
        type: String,
    },
    cupontype:{
        type:String,
        enum:['fixed','rate']
    },
    starttime:{
        type:Date
    },
    endtime:{
        type:Date
    },
    status:{
        type:String,
        enum:['active','inactive']
    },
    description:{
        type:String,
    },
    discount:{
        type:Number
    },
    maxdiscount:{
        type:Number
    }
}, { timestamps: true });

const Cupon = mongoose.model('Cupon', cuponSchema);
export {Cupon}
