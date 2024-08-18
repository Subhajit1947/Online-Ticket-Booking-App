import mongoose,{Schema} from "mongoose";

const citySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    pincode: {
        type: Number,
        required: true
    },
    
}, { timestamps: true });

const City = mongoose.model('City', citySchema);
export {City}
