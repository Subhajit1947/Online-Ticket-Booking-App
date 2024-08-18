import express from 'express'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import 'dotenv/config'
import mongoose, { Mongoose } from 'mongoose';
import dbconnect from './src/db/index.js'
import cors from 'cors'
import { CinemaHall } from './src/models/hall.models.js';
import { Seat } from './src/models/hallseat.models.js';
import { Cinema } from './src/models/cinema.models.js';
import { City } from './src/models/city.models.js';
import {seat} from './seatdb.js'
import { Show } from './src/models/show.model.js';
import { Showseat } from './src/models/showseat.models.js';
import { Bookseat } from './src/models/bookseat.models.js';
import { Cupon } from './src/models/cupon.models.js';
import { User } from './src/models/user.models.js';
import { Lock } from './src/models/lock.models.js';
import { paymentControllers, paymentsuccessControllers } from './src/controllers/payment.controllers.js';
import { bookcontrollers } from './src/controllers/book.controllers.js';
import { hallseatcontrollers } from './src/controllers/hallseat.controllers.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(cors({origin:process.env.CORS_ORIGIN}))
const hdata=[
    {
        "name": "PVR Cinemas - South City Mall",
        "location": "South City Mall, Kolkata",
        "numberOfSeats": 250
    },
    {
        "name": "INOX - Quest Mall",
        "location": "Quest Mall, Kolkata",
        "numberOfSeats": 280
    },
    {
        "name": "Cinepolis - City Centre 1",
        "location": "City Centre 1, Kolkata",
        "numberOfSeats": 200
    },
    {
        "name": "Movie Time Cinema",
        "location": "Mani Square, Kolkata",
        "numberOfSeats": 180
    },
    {
        "name": "PVR Cinemas - Ampa Skywalk",
        "location": "Ampa Skywalk Mall, Kolkata",
        "numberOfSeats": 220
    },
    {
        "name": "INOX - 21st Century",
        "location": "21st Century Tower, Kolkata",
        "numberOfSeats": 240
    },
    {
        "name": "Star Theatre",
        "location": "Kolkata",
        "numberOfSeats": 300
    },
    {
        "name": "The Regal Cinema",
        "location": "Kolkata",
        "numberOfSeats": 150
    },
    {
        "name": "Jaya Cinema",
        "location": "Kolkata",
        "numberOfSeats": 170
    },
    {
        "name": "Ajanta Cinema",
        "location": "Kolkata",
        "numberOfSeats": 160
    },
    {
        "name": "Globus Cinema",
        "location": "Kolkata",
        "numberOfSeats": 190
    },
    {
        "name": "Alambazar Cinema",
        "location": "Alambazar, Kolkata",
        "numberOfSeats": 130
    },
    {
        "name": "Roxy Cinema",
        "location": "Kolkata",
        "numberOfSeats": 200
    },
    {
        "name": "New Empire Cinema",
        "location": "Kolkata",
        "numberOfSeats": 220
    },
    {
        "name": "Menoka Cinema",
        "location": "Kolkata",
        "numberOfSeats": 180
    },
    {
        "name": "Shyam Sundar Talkies",
        "location": "Kolkata",
        "numberOfSeats": 140
    },
    {
        "name": "Pride Cinema",
        "location": "Kolkata",
        "numberOfSeats": 210
    },
    {
        "name": "Satyam Cinema",
        "location": "Kolkata",
        "numberOfSeats": 250
    },
    {
        "name": "Kolkata Cinema House",
        "location": "Kolkata",
        "numberOfSeats": 160
    },
    {
        "name": "Cineworld - Big Cinemas",
        "location": "Kolkata",
        "numberOfSeats": 230
    }
]

// app.get('/hall/allhall',hallseatcontrollers)

app.get('/:id?',async(req,res)=>{
    const {id}=req.params
    
    try {
        const db = mongoose.connection.db;
        const collection = db.collection('movies');
        if(!id){
            try {
                const allDocuments = await collection.find({}).toArray();
                return res.status(200).json({'movies':allDocuments})
            } catch (error) {
                return res.status(500).json({'message':error.message})
            }
        }
        try {
                const oneDocuments = await collection.findOne({_id:new mongoose.Types.ObjectId(id)});
                return res.status(200).json(oneDocuments)
        } catch (error) {
            return res.status(500).json({'message':error.message})    
        }
        
    } catch (error) {
        return res.status(500).json({'message':`somthing went to wrong ${error.message}`})
    }
})
app.get('/currentshow/:id',async(req,res)=>{
    const {id}=req.params
    if(!id){
        return res.status(404).json({"message":"show id not found"})
    }
    const showd=await Show.findById(id)
    return res.status(200).json(showd)
})
app.get('/show/:id',async(req,res)=>{
    const {id}=req.params
    const allshow=await Show.aggregate([
        {
            $match:{
                movie:new mongoose.Types.ObjectId(id)
            }
        },
        {$lookup:
            {
                from:"cinemahalls",
                localField:'cinemahall',
                foreignField:'_id',
                as:'halldetails',
                pipeline:[
                    {$lookup:
                        {
                            from:"cinemas",
                            localField:'cinema',
                            foreignField:'_id',
                            as:'cinemadetails',
                            pipeline:[
                                {
                                    $project:{
                                        name:1,
                                        location:1,
                                        city:1
                                    } 
                                }
                            ]
                        }

                    },
                    {
                        $addFields:{
                            cinemadetails:{$first:"$cinemadetails"}
                        }
                    },
                    {
                        $project:{
                            name:1,
                            cinemadetails:1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                halldetails:{$first:"$halldetails"}
            }
        },
    ])
    const arr={}
    allshow.map((onesw)=>{
        if(arr[onesw.cinemahall]){
            arr[onesw.cinemahall]['starttime']=[arr[onesw.cinemahall]['starttime'],{_id:onesw._id,time:onesw.starttime}]
        }
        else{
            arr[onesw.cinemahall]=onesw
            arr[onesw.cinemahall]['starttime']={_id:onesw._id,time:arr[onesw.cinemahall]['starttime']}
        }
    })
    const res11=[]
    for(let key in arr){
        res11.push(arr[key])
    }


    return res.json(res11)
})

app.get('/showseat/:id',async(req,res)=>{
    const {id}=req.params
    const allseat=await Showseat.aggregate([
        {
            $match:{
                show:new mongoose.Types.ObjectId(id)
            }
        },
        {$lookup:
            {
                from:"seats",
                localField:'hallseat',
                foreignField:'_id',
                as:'seatdetails',
                pipeline:[
                    {
                        $project:{
                            seatrow:1,
                            seatcol:1,
                            type:1
                        } 
                    }
                ]
            }
        },
        {
            $addFields:{
                seatdetails:{$first:"$seatdetails"}
            }
        }

    ])
   
    const arr={}
    allseat.map((seat)=>{
        if(seat.seatdetails.seatrow<6){
            if(arr['diamond']){
                arr['diamond']=[...arr['diamond'],seat]
            }
            else{
                arr['diamond']=[seat]
            }
        }
        else if(seat.seatdetails.seatrow>6 && seat.seatdetails.seatrow<10){
            if(arr['gold']){
                arr['gold']=[...arr['gold'],seat]
            }
            else{
                arr['gold']=[seat]
            }
        }
        else{
            if(arr['silver']){
                arr['silver']=[...arr['silver'],seat]
            }
            else{
                arr['silver']=[seat]
            }
        }

    })
    for(let i in arr){
        arr[i].sort((a,b)=>parseInt(`${a.seatdetails.seatrow}${a.seatdetails.seatcol}`)-parseInt(`${b.seatdetails.seatrow}${b.seatdetails.seatcol}`))
    }
    return res.json(arr)
})
app.post('/checklocked/:id',async(req,res)=>{
    const {id}=req.params
    const {arr}=req.body
   
    
    if(!id){
        return res.status(404).json({'message':'show id not found'})
    }
    try {
        const show=await Show.findById(id)
        if(!show){
            return res.status(400).json({'message':'invalid show id'})
        }
        if(!arr){
            return res.status(404).json({"message":"seat ids not found"})
        }
        try {
            const lockseat=await Lock.find({showseat: { $in: arr }})
            if(lockseat && lockseat.length>0){
                console.log('inside lockseat')
                let notavaliable=false
                lockseat.forEach((s)=>{
                    const validtime=(new Date(s.enteringtime)).getTime()+(10*60*1000)
                    if(validtime>=Date.now()){
                        notavaliable=true
                    }
                })
                if(notavaliable){
                    return res.status(300).json({'message':'currently this seat is not avaliable'})
                }
            }
            const ld=[]
            arr.map((ssd)=>{
                ld.push({show:id,showseat:ssd})
            })
            const lockseat11=await Lock.insertMany(ld)
            return res.status(200).json({'message':'success'})
        } catch (error) {
            return res.status(500).json({"message":`${error.message}`})
        }
    } catch (error) {
        return res.status(500).json({"message":`${error.message}`})
    }
})

app.get('/check/islock/:id',async(req,res)=>{
    const {id}=req.params
    if(!id){
        return res.status(404).json({'message':'show id not found'})
    }
    try {
        const lockseats=await Lock.find({show:id})
        if(!lockseats){
            return res.status(500).json({'message':'somthing went to wrong'})
        }
        // const lseats=lockseats.filter((s)=>(new Date(s.enteringtime)+(10*60*1000))>Date.now())
        const lseats=[]
        lockseats.map((s)=>{
            const validtime=(new Date(s.enteringtime)).getTime()
            if((validtime+(10*60*1000))>Date.now()){
                lseats.push(s.showseat)
            }
        })
        return res.status(200).json(lseats)
    } catch (error) {
        return res.status(500).json({"message":`error-------------${error.message}`})
    }
})


app.get('/fetchmovie/:id',async(req,res)=>{
    const {id}=req.params
    if(!id){
        return res.status(404).json({'message':'show id not found'})
    }
    try {
        const show_details=await Show.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup:{
                    from:"movies",
                    localField:'movie',
                    foreignField:'_id',
                    as:'movie_details',
                }
            },
            {
                $addFields:{
                    movie_details:{$first:"$movie_details"}
                }
            },
            {
                $lookup:{
                    from:"cinemahalls",
                    localField:'cinemahall',
                    foreignField:'_id',
                    as:'hall_details',
                    pipeline:[
                        {
                            $lookup:{
                                from:"cinemas",
                                localField:'cinema',
                                foreignField:'_id',
                                as:'cinema_details',
                            }
                        },
                        {
                            $addFields:{
                                cinema_details:{$first:'$cinema_details'}
                            }
                        }
                    ]
                },
                
            },
            {
                $addFields:{
                    hall_details:{$first:'$hall_details'}
                }
            }
        ])
        return res.status(200).json(show_details[0])
    } catch (error) {
        return res.status(500).json({'message':`error----${error.message}`})
    }
})

app.post('/fetchseat/price',async(req,res)=>{
    const {arr}=req.body
    
    if(!arr){
        return res.status(404).json({'message':'seat details are not found'})
    }
    try {
       
        const seatprice=arr.map(async(ssid)=>{
            
            const sdetails=await Showseat.aggregate([
                {
                    $match:{
                        _id:new mongoose.Types.ObjectId(ssid)
                    }
                },
                {
                    $lookup:{
                        from:"seats",
                        localField:'hallseat',
                        foreignField:'_id',
                        as:'seat_details'
                    }
                },
                {
                    $addFields:{
                        seat_details:{$first:'$seat_details'}
                    }
                }
            ])
            
            return sdetails[0]
        })
        
        const seatprice11=await Promise.all(seatprice)
        const sprice=[...seatprice11]
        const apires={
            ticket:0,
            price:0,
            seats:[]
        }
        sprice.map((p)=>{
            apires.ticket+=1
            apires.price+=p.price
            const s12=`${p?.seat_details?.type} ${String.fromCharCode(64+(p?.seat_details?.seatrow))} ${p?.seat_details?.seatcol}`
            apires.seats.push(s12)
        })
        return res.status(200).json(apires)
    } catch (error) {
        return res.status(500).json({'message':`error------${error.message}`})
    }
})
app.get('/cupon/all',async(req,res)=>{
    try {
        const allcupon=await Cupon.find()
        return res.status(200).json(allcupon)
    } catch (error) {
        return res.status(500).json({'message':`error-------${error.message}`})
    }
})
app.get('/cupon/:code',async(req,res)=>{
    const {code}=req.params
    if(!code){
        return res.status(404).json({'message':'cupon code not found'})
    }
    try {
        const cuponinfo=await Cupon.findOne({cuponcode:code.toUpperCase(),status:'active'})
        return res.status(200).json(cuponinfo)
    } catch (error) {
        return res.status(500).json({'message':`error-----${error.message}`})
    }
})
function generatePassword(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = (Math.floor(Math.random() *100))%characters.length;
      password += characters[randomIndex];
    }
    return password
}
app.post('/user/createuser',async(req,res)=>{
    const {email,ph}=req.body
    if(!email){
        return res.status(404).json({'message':'email not found'})
    }
    if(!ph){
        return res.status(404).json({'message':'phone number not found'})
    }
    try {
        const existuser=await User.findOne({email})
        if(existuser){
            return res.status(200).json(existuser)
        }
        const password=generatePassword()
        const newu=await User.create({email,password,phone:ph})
        return res.status(201).json(newu)
    } catch (error) {
        return res.status(500).json({'message':`error--------${error.message}`})
    }
})
app.post('/payment/pay/:id',paymentControllers)
app.post('/payment/check/:id',paymentsuccessControllers)

app.post('/book/status',bookcontrollers)
app.post('/book/isbooked',async(req,res)=>{
    const {user_id,arr}=req.body
    if(!user_id){
        return res.status(404).json({'message':'user not found'})
    }
    if(!arr){
        return res.status(404).json({'message':'seats not found'})
    }
    try {
        const isbook=await Bookseat.find({user:user_id,steats:{$all:arr}})
        if(!isbook){
            return res.status(500).json({'message':'somthing went wrong'})
        }
        return res.status(200).json(isbook)
    } catch (error) {
        return res.status(500).json({'message':`somthing went wrong ${error.message}`})
    }
})
app.get('userhistory/:id',async(req,res)=>{
    const {id}=req.params
    if(!id){
        return res.status(404).json({'message':'user not found'})
    }
    try {
        const ud=await Bookseat.aggregate([
            {
                $match:{
                    user:new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup:{
                    from:'shows',
                    localField:'show',
                    foreignField:'_id',
                    as:'showdetails',
                    pipeline:[
                        {
                            $lookup:{
                                from:'movies',
                                localField:'movie',
                                foreignField:'_id',
                                as:'moviedetails',
                            }
                        }
                    ]
                }
            }
        ])
        return res.status(200).json(ud)
    } catch (error) {
        return res.status(500).json({'message':`errors---------${error.message}`})
    }
})
// app.get('/hall/create',async(req,res)=>{
//     const hall=await CinemaHall.insertMany(hdata)
//     return res.json(hall)
// })

const seatdata={
        cinemaHall:new mongoose.Types.ObjectId('669f4624f7b9ef17b8f7a4bf'),
        movie:new mongoose.Types.ObjectId('669f0de76c97103c8d39c8b8'),
        showtime:["10:00 PM","06:00 PM"],
        seatdetails:[
            {
                name:'Rs. 170 DIAMOND',
                seats:[] 
            },
            {
                name:'A',
                seats:[
                    {status:'u',sn:1},{status:'u',sn:2},{status:'u',sn:3},{status:'u',sn:4},{status:'u',sn:5},{status:'u',sn:6},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'u',sn:15},{status:'u',sn:16},{status:'u',sn:17},{status:'u',sn:18},{status:'u',sn:19},{status:'u',sn:20}
                ]
            },
            {
                name:'B',
                seats:[
                    {status:'u',sn:1},{status:'u',sn:2},{status:'u',sn:3},{status:'u',sn:4},{status:'u',sn:5},{status:'u',sn:6},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'u',sn:15},{status:'u',sn:16},{status:'u',sn:17},{status:'u',sn:18},{status:'u',sn:19},{status:'u',sn:20}
                ]
            },
            {
                name:'C',
                seats:[
                    {status:'u',sn:1},{status:'u',sn:2},{status:'u',sn:3},{status:'u',sn:4},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'n'},{status:'u',sn:17},{status:'u',sn:18},{status:'u',sn:19},{status:'u',sn:20}
                ]
            },
            {
                name:'D',
                seats:[
                    {status:'u',sn:1},{status:'u',sn:2},{status:'u',sn:3},{status:'u',sn:4},{status:'n'},{status:'u',sn:5},{status:'u',sn:6},{status:'u',sn:7},{status:'u',sn:8},{status:'u',sn:9},{status:'u',sn:10},{status:'u',sn:11},{status:'u',sn:12},{status:'u',sn:13},{status:'u',sn:14},{status:'u',sn:15},{status:'u',sn:16},{status:'n'},{status:'u',sn:17},{status:'u',sn:18},{status:'u',sn:19},{status:'u',sn:20}
                ]
            },
            {
                name:'E',
                seats:[
                    {status:'u',sn:1},{status:'u',sn:2},{status:'u',sn:3},{status:'u',sn:4},{status:'n'},{status:'u',sn:5},{status:'u',sn:6},{status:'u',sn:7},{status:'u',sn:8},{status:'u',sn:9},{status:'u',sn:10},{status:'u',sn:11},{status:'u',sn:12},{status:'u',sn:13},{status:'u',sn:14},{status:'u',sn:15},{status:'u',sn:16},{status:'n'},{status:'u',sn:17},{status:'u',sn:18},{status:'u',sn:19},{status:'u',sn:20}
                ]
            },
            {
                name:'F',
                seats:[
                    {status:'u',sn:1},{status:'u',sn:2},{status:'u',sn:3},{status:'u',sn:4},{status:'n'},{status:'u',sn:5},{status:'u',sn:6},{status:'u',sn:7},{status:'u',sn:8},{status:'u',sn:9},{status:'u',sn:10},{status:'u',sn:11},{status:'u',sn:12},{status:'u',sn:13},{status:'u',sn:14},{status:'u',sn:15},{status:'u',sn:16},{status:'n'},{status:'u',sn:17},{status:'u',sn:18},{status:'u',sn:19},{status:'u',sn:20}
                ]
            },
            {
                name:'G',
                seats:[
                    {status:'u',sn:1},{status:'u',sn:2},{status:'u',sn:3},{status:'u',sn:4},{status:'n'},{status:'u',sn:5},{status:'u',sn:6},{status:'u',sn:7},{status:'u',sn:8},{status:'u',sn:9},{status:'u',sn:10},{status:'u',sn:11},{status:'u',sn:12},{status:'u',sn:13},{status:'u',sn:14},{status:'u',sn:15},{status:'u',sn:16},{status:'n'},{status:'u',sn:17},{status:'u',sn:18},{status:'u',sn:19},{status:'u',sn:20}
                ]
            },
            {
                name:'H',
                seats:[
                    {status:'u',sn:1},{status:'u',sn:2},{status:'u',sn:3},{status:'u',sn:4},{status:'n'},{status:'u',sn:5},{status:'u',sn:6},{status:'u',sn:7},{status:'u',sn:8},{status:'u',sn:9},{status:'u',sn:10},{status:'u',sn:11},{status:'u',sn:12},{status:'u',sn:13},{status:'u',sn:14},{status:'u',sn:15},{status:'u',sn:16},{status:'n'},{status:'u',sn:17},{status:'u',sn:18},{status:'u',sn:19},{status:'u',sn:20}
                ]
            },
            {
                name:'Rs. 130 GOLD',
                seats:[] 
            },
            {
                name:'I',
                seats:[
                    {status:'u',sn:1},{status:'u',sn:2},{status:'u',sn:3},{status:'u',sn:4},{status:'n'},{status:'u',sn:5},{status:'u',sn:6},{status:'u',sn:7},{status:'u',sn:8},{status:'u',sn:9},{status:'u',sn:10},{status:'u',sn:11},{status:'u',sn:12},{status:'u',sn:13},{status:'u',sn:14},{status:'u',sn:15},{status:'u',sn:16},{status:'n'},{status:'u',sn:17},{status:'u',sn:18},{status:'u',sn:19},{status:'u',sn:20}
                ]
            },
            {
                name:'J',
                seats:[
                    {status:'u',sn:1},{status:'u',sn:2},{status:'u',sn:3},{status:'u',sn:4},{status:'n'},{status:'u',sn:5},{status:'u',sn:6},{status:'u',sn:7},{status:'u',sn:8},{status:'u',sn:9},{status:'u',sn:10},{status:'u',sn:11},{status:'u',sn:12},{status:'u',sn:13},{status:'u',sn:14},{status:'u',sn:15},{status:'u',sn:16},{status:'n'},{status:'u',sn:17},{status:'u',sn:18},{status:'u',sn:19},{status:'u',sn:20}
                ]
            },
            {
                name:'K',
                seats:[
                    {status:'u',sn:1},{status:'u',sn:2},{status:'u',sn:3},{status:'u',sn:4},{status:'n'},{status:'u',sn:5},{status:'u',sn:6},{status:'u',sn:7},{status:'u',sn:8},{status:'u',sn:9},{status:'u',sn:10},{status:'u',sn:11},{status:'u',sn:12},{status:'u',sn:13},{status:'u',sn:14},{status:'u',sn:15},{status:'u',sn:16},{status:'n'},{status:'u',sn:17},{status:'u',sn:18},{status:'u',sn:19},{status:'u',sn:20}
                ]
            },
            {
                name:'L',
                seats:[
                    {status:'u',sn:1},{status:'u',sn:2},{status:'u',sn:3},{status:'u',sn:4},{status:'n'},{status:'u',sn:5},{status:'u',sn:6},{status:'u',sn:7},{status:'u',sn:8},{status:'u',sn:9},{status:'u',sn:10},{status:'u',sn:11},{status:'u',sn:12},{status:'u',sn:13},{status:'u',sn:14},{status:'u',sn:15},{status:'u',sn:16},{status:'n'},{status:'u',sn:17},{status:'u',sn:18},{status:'u',sn:19},{status:'u',sn:20}
                ]
            },
            {
                name:'M',
                seats:[
                    {status:'u',sn:1},{status:'u',sn:2},{status:'u',sn:3},{status:'u',sn:4},{status:'n'},{status:'u',sn:5},{status:'u',sn:6},{status:'u',sn:7},{status:'u',sn:8},{status:'u',sn:9},{status:'u',sn:10},{status:'u',sn:11},{status:'u',sn:12},{status:'u',sn:13},{status:'u',sn:14},{status:'u',sn:15},{status:'u',sn:16},{status:'n'},{status:'u',sn:17},{status:'u',sn:18},{status:'u',sn:19},{status:'u',sn:20}
                ]
            },
            {
                name:'N',
                seats:[
                    {status:'u',sn:1},{status:'u',sn:2},{status:'u',sn:3},{status:'u',sn:4},{status:'n'},{status:'u',sn:5},{status:'u',sn:6},{status:'u',sn:7},{status:'u',sn:8},{status:'u',sn:9},{status:'u',sn:10},{status:'u',sn:11},{status:'u',sn:12},{status:'u',sn:13},{status:'u',sn:14},{status:'u',sn:15},{status:'u',sn:16},{status:'n'},{status:'u',sn:17},{status:'u',sn:18},{status:'u',sn:19},{status:'u',sn:20}
                ]
            },
            {
                name:'Rs. 130 SILVER',
                seats:[] 
            },
            {
                name:'O',
                seats:[
                    {status:'u',sn:1},{status:'u',sn:2},{status:'u',sn:3},{status:'u',sn:4},{status:'n'},{status:'u',sn:5},{status:'u',sn:6},{status:'u',sn:7},{status:'u',sn:8},{status:'u',sn:9},{status:'u',sn:10},{status:'u',sn:11},{status:'u',sn:12},{status:'u',sn:13},{status:'u',sn:14},{status:'u',sn:15},{status:'u',sn:16},{status:'n'},{status:'u',sn:17},{status:'u',sn:18},{status:'u',sn:19},{status:'u',sn:20}
                ]
            },
            {
                name:'P',
                seats:[
                    {status:'u',sn:1},{status:'u',sn:2},{status:'u',sn:3},{status:'u',sn:4},{status:'n'},{status:'u',sn:5},{status:'u',sn:6},{status:'u',sn:7},{status:'u',sn:8},{status:'u',sn:9},{status:'u',sn:10},{status:'u',sn:11},{status:'u',sn:12},{status:'u',sn:13},{status:'u',sn:14},{status:'u',sn:15},{status:'u',sn:16},{status:'n'},{status:'u',sn:17},{status:'u',sn:18},{status:'u',sn:19},{status:'u',sn:20}
                ]
            }
        
        ]
}

const cinemas = [
    {
        name: 'PVR Cinemas',
        location: 'New Market, Kolkata',
        totalhall: 2,
        city: new mongoose.Types.ObjectId('66a33c2eb21e1a4e9bd47c92') // Reference to Kolkata
    },
    {
        name: 'Inox',
        location: 'South City, Kolkata',
        totalhall: 3,
        city:new mongoose.Types.ObjectId('66a33c2eb21e1a4e9bd47c92') // Reference to Durgapur
    },
    {
        name: 'Nandan',
        location: 'Kolkata',
        totalhall: 2,
        city:new mongoose.Types.ObjectId('66a33c2eb21e1a4e9bd47c92') // Reference to Durgapur
    },
    {
        name: 'Cinepolis',
        location: 'City Center, Kolkata',
        totalhall: 3,
        city: new mongoose.Types.ObjectId('66a33c2eb21e1a4e9bd47c92') // Reference to Siliguri
    }
]

const cities = [
    {
        name: 'Kolkata',
        state: 'West Bengal',
        pincode: '700001'
    },
    {
        name: 'Durgapur',
        state: 'West Bengal',
        pincode: '713201'
    },
    {
        name: 'Siliguri',
        state: 'West Bengal',
        pincode: '734001'
    },
    {
        name: 'Asansol',
        state: 'West Bengal',
        pincode: '713301'
    },
    {
        name: 'Bardhaman',
        state: 'West Bengal',
        pincode: '713101'
    },
    {
        name: 'Howrah',
        state: 'West Bengal',
        pincode: '711101'
    },
    {
        name: 'Haldia',
        state: 'West Bengal',
        pincode: '721605'
    },
    {
        name: 'Malda',
        state: 'West Bengal',
        pincode: '732101'
    },
    {
        name: 'Jalpaiguri',
        state: 'West Bengal',
        pincode: '735101'
    },
    {
        name: 'Kalyani',
        state: 'West Bengal',
        pincode: '741235'
    }
];

// app.get('/createcity',async(req,res)=>{
//     const city=await City.insertMany(cities)
//     return res.json(city)
// })
// app.get('/createcinema',async(req,res)=>{
//     const cinema=await Cinema.insertMany(cinemas)
//     return res.json(cinema)
// })

// app.get('/hall/createseat',async(req,res)=>{
//     const creates=await Seat.create(seatdata)
//     return res.json(creates)
// })
// app.get('/hall/gethalls/:id',async(req,res)=>{
//     const {id}=req.params
    
//     const halls=await Seat.find({movie:new mongoose.Types.ObjectId(id)})

// })
const hallsdata = [
    {
        name: 'Hall 1',
        totalseat: 150,
        cinema: new mongoose.Types.ObjectId('66a33e8eb04d0512f53effd8') // Reference to PVR Cinemas, Kolkata
    },
    {
        name: 'Hall 2',
        totalseat: 200,
        cinema: new mongoose.Types.ObjectId('66a33e8eb04d0512f53effd8')// Reference to PVR Cinemas, Kolkata
    },
    {
        name: 'Hall 3',
        totalseat: 120,
        cinema: new mongoose.Types.ObjectId('66a33e8eb04d0512f53effd8') // Reference to Inox, Durgapur
    },
    
    {
        name: 'Screen 1',
        totalseat: 250,
        cinema: new mongoose.Types.ObjectId('66a33e8eb04d0512f53effd9') // Reference to Cinepolis, Siliguri
    },
    {
        name: 'Screen 2',
        totalseat: 150,
        cinema: new mongoose.Types.ObjectId('66a33e8eb04d0512f53effd9')// Reference to Cinepolis, Siliguri
    }
];
// const seats = [
//     // Seats for Hall 1 in PVR Cinemas, Kolkata
//     {
//         cinemaHall: new mongoose.Types.ObjectId('66a341f7b2a952d2aa50d8b4'),
//         seatrow: 1,
//         seatcol: 1,
//         type: 'VIP'
//     },

    

// app.get('/createhall',async(req,res)=>{
//     const newhall=await CinemaHall.insertMany(hallsdata)
//     return res.json(newhall)
// })

// app.get('/createseat',async(req,res)=>{
//     const s=await Seat.insertMany(seat)
//     return res.json(s)
// })
// const show_data=[
//     {
//         "date": "2024-07-27T00:00:00Z",
//         "starttime": "2024-07-27T14:30:00Z",
//         "endtime": "2024-07-27T16:30:00Z",
//         "movie": "669f0de76c97103c8d39c8c5",  
//         "cinemahall": "66a341f7b2a952d2aa50d8b4"
//     },
//     {
//         "date": "2024-07-27T00:00:00Z",
//         "starttime": "2024-07-27T07:30:00Z",
//         "endtime": "2024-07-27T09:30:00Z",
//         "movie": "669f0de76c97103c8d39c8c5",  
//         "cinemahall": "66a341f7b2a952d2aa50d8b4"
//     },
//     {
//         "date": "2024-07-27T00:00:00Z",
//         "starttime": "2024-07-27T10:30:00Z",
//         "endtime": "2024-07-27T12:30:00Z",
//         "movie": "669f0de76c97103c8d39c8c7",  
//         "cinemahall": "66a341f7b2a952d2aa50d8b4"
//     },
//     {
//         "date": "2024-07-27T00:00:00Z",
//         "starttime": "2024-07-27T18:30:00Z",
//         "endtime": "2024-07-27T20:30:00Z",
//         "movie": "669f0de76c97103c8d39c8c7",  
//         "cinemahall": "66a341f7b2a952d2aa50d8b4"
//     }
// ]

// app.get('/createshow',async(req,res)=>{
//     const s_d=await Show.insertMany(show_data)
//     return res.json(s_d)
// })


// app.get('/cupon/create',async(req,res)=>{
//     const cupondata=[
//         {
//           "cuponcode": "SUMMER2024",
//           "cupontype": "fixed",
//           "starttime": "2024-08-02T00:00:00Z",  // Current date and time in UTC
//           "endtime": "2024-08-31T23:59:59Z",
//           "status": "active",
//           "description": "Summer Sale 2024",
//           "discount": 50,
//           "maxdiscount": 100
//         },
//         {
//           "cuponcode": "FALL20",
//           "cupontype": "rate",
//           "starttime": "2024-08-02T00:00:00Z",  // Current date and time in UTC
//           "endtime": "2024-11-30T23:59:59Z",
//           "status": "inactive",
//           "description": "Fall 20% off",
//           "discount": 20,
//           "maxdiscount": 0
//         },
//         {
//           "cuponcode": "WINTER2024",
//           "cupontype": "fixed",
//           "starttime": "2024-08-02T00:00:00Z",  // Current date and time in UTC
//           "endtime": "2024-12-31T23:59:59Z",
//           "status": "active",
//           "description": "Winter Holiday Special",
//           "discount": 75,
//           "maxdiscount": 150
//         }
//     ]
//     try {
//         const cc=await Cupon.insertMany(cupondata)
//         return res.status(201).json(cc)
//     } catch (error) {
//         return res.status(500).json({'message':`error---------${error.message}`})
//     }
      
// })
app.get('/seat/show/createshowseat',async(req,res)=>{
    const showid='66a487bb071db19635ad923c'
    const allseat=await Seat.find({cinemaHall:'66a341f7b2a952d2aa50d8b4'})
    allseat.map(async(ones)=>{
        let price=ones.type=='DIAMOND'?170:ones.type=='GOLD'?150:120
        let status=ones.type=='NU'?'n':'u'
        let hallseat=ones._id
        await Showseat.create({price:price,status:status,hallseat:hallseat,show:showid})
    })
    return res.json({'message':'created'})
})

dbconnect()
.then(()=>{
    app.listen(process.env.PORT||5000,()=>{
        console.log('server is listen at port',process.env.PORT||5000)
    })
    
})
.catch((err)=>{
    console.log('mongodb connection error',err)
})