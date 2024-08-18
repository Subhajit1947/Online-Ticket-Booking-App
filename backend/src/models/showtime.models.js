import {Schema} from "mongoose";
const showtimeSchema = new Schema({
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    cinemaHall: {
        type: Schema.Types.ObjectId,
        ref: 'CinemaHall',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    seatsAvailable: {
        type: Number,
        required: true
    },
    seats: [{
        type: Schema.Types.ObjectId,
        ref: 'Seat'
    }]
}, { timestamps: true });

const Showtime = mongoose.model('Showtime', showtimeSchema);
module.exports = Showtime;
