import Razorpay from 'razorpay'
import { Payment } from '../models/payment.models.js';
import { Lock } from '../models/lock.models.js';
const instance = new Razorpay({
    key_id:process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_SECRET_KEY,
});
const paymentControllers=async(req,res)=>{
    const {id}=req.params
    const {amount,user_id,arr}=req.body
    if(!id){
        return res.status(404).json({'message':'show id not found'})
    }
    if(!amount){
        return res.status(404).json({'message':'amount not found'})
    }
    if(!user_id){
        return res.status(404).json({'message':'user not found'})
    }
    if(!arr){
        return res.status(404).json({'message':'seats id are not found'})
    }
    try {
        const lockseat=await Lock.find({showseat:{$in:arr}})
        let notavaliable=false
        if(lockseat && lockseat.length>0){
            lockseat.forEach((s)=>{
                const validtime=(new Date(s.enteringtime)).getTime()+(10*60*1000)
                if(validtime>=Date.now()){
                    notavaliable=true
                }
            })
        }
        if(!notavaliable){
            return res.status(300).json({'message':'yoursession expried please try again'})
        }
        var options = {
        amount: amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
        };
        
        try {
            console.log('inside payment')
            instance.orders.create(options,async function(err, order) {
                const orderplace=await Payment.create({order_id:order.id,amount,owner:user_id})
                if(!orderplace){
                    res.status(500).json({'message':'error in order model creation'})
                }
                return res.status(201).json(orderplace)
            });
        } catch (error) {
            res.status(500).json({'message':error.message})
        }
    } catch (error) {
        res.status(500).json({'message':error.message})
    }
}
const paymentsuccessControllers=async(req,res)=>{
    const {id}=req.params
    const {payment_id,payment_signeture,user_id,cuponid=null}=req.body
    if(!id){
        return res.status(404).json({'message':'id not found'})
    }
    
    if(!payment_id){
        return res.status(404).json({'message':'payment id not found'})
    }
    if(!payment_signeture){
        return res.status(404).json({'message':'payment_signeture not found'})
    }
    if(!user_id){
        return res.status(404).json({'message':'user_id not found'})
    }
    try {
        const ufield={
            payment_id,
            payment_signeture,
            status:"success",
        }
        if(cuponid){
            ufield['cuponid']=cuponid
        }
        const orderreceive=await Payment.findByIdAndUpdate(id,
            {
               $set:ufield
            },
            {
                new:true
        })
        if(!orderreceive){
            res.status(500).json({'message':'error in receivedorder'})
        }
        
        return res.status(200).json(
           {'message':'payment successfull'}
        )

    } catch (error) {
        res.status(500).json({'message':'error in order received' || error.message})
    }
}
export {paymentControllers,paymentsuccessControllers}