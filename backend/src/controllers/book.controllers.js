import { Bookseat } from "../models/bookseat.models.js"
import { Showseat } from "../models/showseat.models.js"


const bookcontrollers=async(req,res)=>{
    const {payment,user,show,steats,numberofseat}=req.body
    if(!payment){
        return res.status(404).json({'message':'payment id not found'})
    }
    if(!user){
        return res.status(404).json({'message':'user id not found'})
    }
    if(!show){
        return res.status(404).json({'message':'show not found'})
    }
    if(!steats){
        return res.status(404).json({'message':'steats not found'})
    }
    if(!numberofseat){
        return res.status(404).json({'message':'numberofseat not found'})
    }
    try {
        // { arr: [ '66ab2dedfbb50d6fe6e7c102', '66ab2dedfbb50d6fe6e7c103' ] }  steats gives
        const newbook=await Bookseat.create({payment,user,show,steats:steats?.arr,numberofseat,status:'success'})
        if(!newbook){
            return res.status(500).json({'message':'somthing went to wrong'})
        }
        steats?.arr.map(async(ssid)=>{
            await Showseat.findByIdAndUpdate(ssid,
                {
                    $set:{
                        status:'b'
                    }
                }
            )
        })
        return res.json(newbook)
    } catch (error) {
        return res.status(500).json({'message':`errors---------${error.message}`})
    }
}

export {bookcontrollers}