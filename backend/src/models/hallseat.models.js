import mongoose,{ Schema } from "mongoose";

// Define the Seat Schema with a status field
const seatSchema = new Schema({
    
    cinemaHall: {
      type: Schema.Types.ObjectId,
      ref: 'CinemaHall',
      required: true
    },
    seatrow:{
      type:Number
    },
    seatcol:{
      type:Number
    },
    type:{
      type: String,
      enum : ['SILVER','GOLD','DIAMOND','NU'],
      default:'GOLD'
    }
    
  }
  , { timestamps: true });

const Seat = mongoose.model('Seat', seatSchema);
export {Seat};
