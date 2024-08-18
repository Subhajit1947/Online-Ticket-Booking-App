import mongoose,{Schema} from "mongoose";

const paymentSchema = new Schema({
    order_id:{
        type:String
    },
    amount:{
        type:Number,
    },
    payment_id:{
        type:String
    },
    payment_signeture:{
        type:String
    },
    cuponid:{
        type:Schema.Types.ObjectId,
        ref:'Cupon'
    },
    paymentmethod:{
        type:String,
        enum:['netbanking','UPI','debit/credit Card'],
        default:'UPI'
        
    },
    status:{
        type:String,
        enum:['success','failed']
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
    
},{ timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export {Payment}
