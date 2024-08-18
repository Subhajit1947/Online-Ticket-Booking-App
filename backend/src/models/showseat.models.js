import mongoose,{Schema} from "mongoose";

const showSchema = new Schema({
    price: {
        type: Number,
    },
    status:{
        type:String,
        enum:['b','u','n'],
        default:'u'
    },
    hallseat:{
        type:Schema.Types.ObjectId,
        ref:'Seat'
    },
    show:{
        type:Schema.Types.ObjectId,
        ref:'Show'
    }
}, { timestamps: true });

const Showseat = mongoose.model('Showseat', showSchema);
export {Showseat}
