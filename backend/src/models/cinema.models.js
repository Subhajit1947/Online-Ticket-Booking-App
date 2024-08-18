import mongoose,{Schema} from "mongoose";

const cinemaSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    totalhall: {
        type: Number,

    },
    city:{
        type:Schema.Types.ObjectId,
        ref:'City'
    }
    
}, { timestamps: true });

const Cinema = mongoose.model('Cinema', cinemaSchema);
export {Cinema}
