import mongoose,{Schema} from "mongoose";

const bookSchema = new Schema({
    numberofseat: {
        type: Number,
    },
    status:{
        type:String,
        enum:['success','fail']
    },
    steats:[{
        type:Schema.Types.ObjectId,
        ref:'Showseat'
    }],
    show:{
        type:Schema.Types.ObjectId,
        ref:'Show'
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    payment:{
        type:Schema.Types.ObjectId,
        ref:'Payment'
    }

}, { timestamps: true });

const Bookseat = mongoose.model('Bookseat', bookSchema);
export {Bookseat}
