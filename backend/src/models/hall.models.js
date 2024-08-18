import mongoose,{Schema} from "mongoose";

const cinemaHallSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    totalseat: {
        type: Number,
        required: true
    },
    cinema:{
        type:Schema.Types.ObjectId,
        ref:'Cinema'
    }
}, { timestamps: true });

const CinemaHall = mongoose.model('CinemaHall', cinemaHallSchema);
export {CinemaHall}
