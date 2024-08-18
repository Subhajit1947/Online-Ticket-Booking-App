import { CinemaHall } from "../models/hall.models.js"
import { Seat } from "../models/hallseat.models.js"


const hallseatcontrollers=async(req,res)=>{
    const allhall=await CinemaHall.find()
    const result=[]
    for(let i in allhall){
        const seatfound=await Seat.find({cinemaHall:allhall[i].id})
        if(seatfound.length>0){
            console.log('seat already created')
        }
        else{
            for(let j=1;j<=12;j++){
                for(let k=1;k<=22;k++){
                    const d={"cinemaHall":allhall[i].id, "seatrow": j, "seatcol": k,
                        "type":(j<=5 && j>0
                            ?(j < 4 && ( k > 6 && k < 17 ) ? "NU" : ( j>3 &&j<6 && (k == 5 || k == 18) ? "NU" : "DIAMOND"))
                            :(k==5||k==18?"NU":(j>5&&j<=8?"GOLD":"SILVER")))
                        }
                    
                    result.push(d)
                }
            }
        }
    }
    const seres=await Seat.insertMany(result)
    return res.status(200).json(seres)
}

export {hallseatcontrollers}