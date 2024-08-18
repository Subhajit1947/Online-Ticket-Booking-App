import mongoose,{Schema} from "mongoose";

const showSchema = new Schema({
    date: {
        type: Date,
    },
    starttime:{
        type:Date
    },
    endtime:{
        type:Date
    },
    movie:{
        type:Schema.Types.ObjectId,
        ref:'movies'
    },
    cinemahall:{
        type:Schema.Types.ObjectId,
        ref:'CinemaHall'
    }
}, { timestamps: true });

const Show = mongoose.model('Show', showSchema);
export {Show}
