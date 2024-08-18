import { useRef } from "react";
import { useParams } from "react-router-dom"
import axios from "axios";
import { useState,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { addMovie } from "../Redux/action";
import { useNavigate } from "react-router-dom";
import db from '../db.json'
import Cuponapply from "./Cuponapply";
import useRazorpay from "react-razorpay";
import { useReactToPrint } from 'react-to-print';
import { height } from "@fortawesome/free-solid-svg-icons/fa0";
import Userhistory from "./Userhistory";
import Alert from '@mui/material/Alert';

export const Payment=()=>{
    let navigate = useNavigate();
    const {id} = useParams();
    const [movie, setMovie] = useState({})
    const [sseat,setsseat]=useState(JSON.parse(localStorage.getItem('showseatids')))
    const [discount,setdiscount]=useState(0)
    const [seatinfo,setseatinfo]=useState({})
    const [ofd,setofd]=useState(false)
    const lk=Math.floor(Math.random() * 10) + 20
    const [email,setemail]=useState('')
    const [ph,setph]=useState('')
    const [user,setuser]=useState()
    const [cuponid,setcuponid]=useState('')
    const [succ,setsucc]=useState('')
    const [showp,setshowp]=useState(true)
    const [Razorpay] = useRazorpay();
    const [uhis,setuhis]=useState(false)
    const componentRef = useRef();
    const [pageerror,setpageerror]=useState([])
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    // useEffect(()=>{
    //     const locakseat=async()=>{
    //         const lockseat11json=await fetch(`http://127.0.0.1:5000/lockseat/${id}`) 
    //         if(lockseat11json.status!=200){
    //             navigate('/')
    //         }
    //         else{
    //             navigate('/')
    //         }
    //     }
    //     locakseat()
    // },[])
    useEffect(() => {
		getMovies();
        
    },[])
    const getMovies =async() => {
        const moviejson=await fetch(`http://127.0.0.1:5000/fetchmovie/${id}`)
        if(!moviejson.ok){
            const errmovie=await moviejson.json()
            setpageerror([...pageerror,errmovie.message])
            setTimeout(()=>{
                setpageerror([])
            },2*1000)
        }
        else{
            const movie11=await moviejson.json()	
            setMovie({...movie11})
        }
        const seatjson=await fetch('http://127.0.0.1:5000/fetchseat/price',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(sseat)
        })
        if(!seatjson.ok){
            const errseat=await moviejson.json()
            setpageerror([...pageerror,errseat.message])
            setTimeout(()=>{
                setpageerror([])
            },2*1000)
        }
        else{
            const seatprice=await seatjson.json()
            setseatinfo({...seatprice})
        }

    
    }
    let genreid = {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation ',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        14: 'Fantasy',
        36: 'History',
        27: 'Horror',
        10402: ' Music',
        9648: 'Mystery',
        10749: 'Romance ',
        878: 'Science Fiction',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War ',
        37: 'Western'
      };
    const languages={
        "en": "English",
        "es": "Spanish",
        "fr": "French",
        "de": "German",
        "it": "Italian",
        "zh": "Chinese (Simplified)",
        "ja": "Japanese",
        "ko": "Korean",
        "pt": "Portuguese",
        "ru": "Russian",
        "hi": "Hindi",
        "ar": "Arabic"
    }
    
    

    const bookmovie=async(amount)=>{
        if(!user){
            setpageerror([...pageerror,'user required'])
            setTimeout(()=>{
                setpageerror([])
                navigate(`/payment/${id}`)
            },5*1000)
            
        }
        const resjson=await fetch(`http://127.0.0.1:5000/payment/pay/${id}`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({amount,user_id:user._id,arr:sseat?.arr})
        })
        if(resjson.ok){
            const apires=await resjson.json()
            console.log(apires)
            const options = {
                key: "rzp_test_aSfNVwnDJfDZ92", // Enter the Key ID generated from the Dashboard
                order_id:apires.order_id, //This is a sample Order ID. Pass the `id` obtained in the response of createOrder().
                handler:async(response)=>{
                    const d={
                        payment_id:response.razorpay_payment_id,
                        payment_signeture:response.razorpay_signature,
                        user_id:user._id,
                        cuponid,
                    }
                    const paymentsuccjson=await fetch(`http://127.0.0.1:5000/payment/check/${apires._id}`,{
                        method:'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body:JSON.stringify(d)
                    })
                    if(paymentsuccjson.ok){
                        const d11={payment:apires._id,user:user._id,show:id,steats:sseat,numberofseat:seatinfo?.ticket}
                        const bookstatus=await fetch('http://127.0.0.1:5000/book/status',{
                            method:"POST",
                            headers:{
                                "Content-Type":"application/json"
                            },
                            body:JSON.stringify(d11)
                        })
                        if(bookstatus.ok){
                            const bookinfo=await bookstatus.json()
                            setsucc('payment successfull please downloadyour ticket')
                            setshowp(false)
                        }
                        else{
                            const bserr=await bookstatus.json()
                            setpageerror([...pageerror,bserr.json()])
                            setTimeout(()=>{
                                setpageerror([])
                            },2*1000)
                        }
                    }
                    else{
                        const pserr=await paymentsuccjson.json()
                        setpageerror([...pageerror,pserr.json()])
                        setTimeout(()=>{
                            setpageerror([])
                        },2*1000)
                    }
                    
                },
                prefill: {
                    name: "Piyush Garg",
                    email: "youremail@example.com",
                    contact: "9999999999",
                },
                notes: {
                    address: "Razorpay Corporate Office",
                },
                theme: {
                    color: "#3399cc",
                },
                };
            
            const rzp1 = new Razorpay(options);
        
            rzp1.on("payment.failed", function (response) {
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
            });
        
            rzp1.open();
        }
        else{
            const apierr=await resjson.json()
            setpageerror([...pageerror,apierr.message])
            setTimeout(()=>{
                setpageerror([])
                navigate(`/selectticket/${id}`)
            },2*1000)
            
        } 
    }
    const caldate=(date)=>{
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const d = new Date(date);
        const dayName = days[d.getDay()];
        const day = d.getDate();
        const monthName = months[d.getMonth()];
        const year = d.getFullYear();
        return `${dayName}, ${day} ${monthName}, ${year}`;
    
    }
    const handleuser=async()=>{
        if(!email && !ph){
            setpageerror([...pageerror,'email and phone number required'])
            setTimeout(()=>{
                setpageerror([])
                navigate(`/payment/${id}`)
            },5*1000)
            
        }
        const userjson=await fetch('http://127.0.0.1:5000/user/createuser',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({email,ph})
        })
        if(userjson.ok){
            const nuser=await userjson.json()
            setuser(nuser)
        }
        else{
            const usererror=await userjson.json()
            setpageerror([...pageerror,usererror.message])
            setTimeout(()=>{
                setpageerror([])
            },5*1000)
        }
    }
    
    useEffect(()=>{
        getbookstatus()
    },[user,sseat])
    const getbookstatus=async()=>{
        if(user && sseat){
            const bsjson=await fetch('/book/isbooked',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({user_id:user._id,arr:sseat?.arr})
            })
            if(bsjson.ok){
                setshowp(false)
            }
            else{
                setshowp(true)
            }
        }
    }
    return(
        
        <div>
            {succ!=''?
                <Alert severity="success">{succ}</Alert>:<></>}

            <div style={{display:"flex",flexDirection:'column',justifyContent:'center'}}>
                
                {pageerror.length>0?pageerror.map((m)=>{
                    <Alert severity="error">{m}</Alert>
                }):<></>}
            </div>
            <div  className="Maindivpayment" >
                
                <div  className="firstdivpayment">
                    <div style={{display:'flex',justifyContent:'flex-start',alignItems:'center',padding:'10px',backgroundColor:'#f84464',color:'white',fontWeight:'bold',fontWeight:'400',fontSize:'15px',height:'35px'}}>
                        <span > <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="dropdown-icon"
                            viewBox="0 0 16 16"
                            >
                            <path d="M1.5 5.5L8 12l6.5-6.5" />
                            </svg>
                        </span>
                        <span className="textv"><p>Share your Contact Details</p></span>
                    </div>
                    <div className="mmnjuu">
                        {user?<h3 style={{color:'green'}}>wellcome {user.email}</h3>:
                        <div style={{display:'flex',justifyContent:'space-between',width:"90%"}}>
                            <input onChange={(e)=>setemail(e.target.value)} style={{height:'2rem',paddingLeft:'15px',border:'1px solid #d6181f',width:'30%',borderRadius:'5px'}} type="text" placeholder="Email address" />
                            <input onChange={(e)=>setph(e.target.value)} style={{paddingLeft:'15px',border:'1px solid #d6181f',width:'30%',borderRadius:'5px'}} type="text" placeholder="+91"/>
                            <button onClick={handleuser} type="button" style={{width:'30%',border:'none',cursor:'pointer'}} className="mmmnnn">Continue</button>
                        </div>}
                    </div>
                    <div>
                    <div onClick={()=>setofd(!ofd)} style={{cursor:'pointer',border:'1px solid #d1d5db',margin:'5px',display:'flex',justifyContent:'flex-start',alignItems:'center',paddingLeft:'10px',fontWeight:'bold',backgroundColor:ofd?'#f84464':'#ebebeb',color:ofd?'white':'#56585e',fontWeight:'400',fontSize:'15px'}}>
                        <span > <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="dropdown-icon"
                            viewBox="0 0 16 16"
                            >
                            <path d="M1.5 5.5L8 12l6.5-6.5" />
                            </svg>
                        </span>
                        <span className="textv"><p>Unlock offers or Apply Promocodess</p></span>
                    </div> 
                    {ofd?
                    <Cuponapply setcuponid={setcuponid} setdiscount={setdiscount}/>
                    :<></>}
                    
                    {/* <div style={{cursor:'pointer',border:'1px solid #d1d5db',margin:'5px',display:'flex',justifyContent:'flex-start',alignItems:'center',paddingLeft:'10px',fontWeight:'bold',backgroundColor:"#ebebeb",color: '#56585e',fontWeight:'400',fontSize:'15px'}}>
                        <span > <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="dropdown-icon"
                            viewBox="0 0 16 16"
                            >
                            <path d="M1.5 5.5L8 12l6.5-6.5" />
                            </svg>
                        </span>
                        <span className="textv"><p>More Payment options</p></span>
                    </div>  */}
                    
                    {/* <div style={{display:'flex',justifyContent:'flex-start',alignItems:'center',padding:'10px',fontWeight:'bold',backgroundColor:"#f7f7f7",color: '#56585e',fontWeight:'400',fontSize:'20px'}} >
                        <form action="">
                            <input type="checkbox" />
                            <label htmlFor="Earn Loyalty points">Earn Loyalty points</label>
                        </form>
                    </div> */}
                    
                        <div onClick={()=>setuhis(!uhis)} style={{cursor:'pointer',border:'1px solid #d1d5db',margin:'5px',display:'flex',justifyContent:'flex-start',alignItems:'center',paddingLeft:'10px',fontWeight:'bold',backgroundColor:uhis?'#f84464':'#ebebeb',color:uhis?'white':'#56585e',fontWeight:'400',fontSize:'15px'}}>
                            <span > <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="dropdown-icon"
                                viewBox="0 0 16 16"
                                >
                                <path d="M1.5 5.5L8 12l6.5-6.5" />
                                </svg>
                            </span>
                            <span className="textv"><p>User History</p></span>
                        </div> 
                    </div>
                    {uhis?
                        <Userhistory/>
                    :<></>

                    }
                
                
                </div>
                
                <div  className="seconddivpayment"  >
                    <div ref={componentRef} style={{margin:'1rem'}}>
                        <div className="oghyt">
                            <div style={{display:'flex'}}>
                                <div>
                                    <p>ORDER SUMMARY</p>
                                    <p>{movie?.movie_details?.title}  ({movie?.movie_details?.genre_ids?.map((gid)=>(<span>{genreid[gid]}</span>))})<h4>Tickets :{seatinfo?.ticket}</h4></p>
                                    <p>{languages[movie?.movie_details?.original_language]}</p>
                                    <p>{movie?.hall_details?.cinema_details?.name} {movie?.hall_details?.cinema_details?.location} {movie?.hall_details?.name}</p>
                                </div>
                                <div style={{height:'10rem',width:'40%'}}>
                                <img style={{height:'100%',width:'100%'}} src={`https://image.tmdb.org/t/p/w500${movie?.movie_details?.poster_path}`}/>
                                </div>
                            </div>
                        {/* <p>(AUDI 04)</p> */}
                        <p>Ticket INFO</p>
                        <div>
                        {
                            seatinfo?.seats?.map((si)=>(
                                <p>{si}</p>
                            ))
                        }
                        </div>
                        <p>{caldate(movie.starttime)}</p>
                        <p>{`${parseInt(((movie?.starttime?.split('T')[1])?.slice(0,5))?.split(':')[0])%12}:${parseInt(((movie.starttime?.split('T')[1])?.slice(0,5))?.split(':')[1])} ${parseInt(((movie.starttime?.split('T')[1])?.slice(0,5))?.split(':')[0])>12?'PM':'AM'}`}</p>
                        </div>
                        <p style={{width:'100%'}}>----------------------------------------------------</p>
                        <div className="">
                            <div>
                                <div style={{display:'flex', justifyContent:'space-between',marginleft:'20px',marginRight:'20px'}}>
                                    <p>Sub Total</p>
                                    <p>Rs.{seatinfo?.price}</p>
                                </div>
                                <div style={{display:'flex', justifyContent:'space-between',marginleft:'20px',marginRight:'20px'}}>
                                    <p>Convenience fees</p>
                                    <p>Rs.{lk}</p>
                                </div>
                                <div style={{display:'flex', justifyContent:'space-between',marginleft:'20px',marginRight:'20px'}}>
                                    <p>Discount</p>
                                    <p>Rs.{discount}</p>
                                </div>
                            </div>
                        
                        {/* <p>Show tax break  V</p>
                        <div className="ghdsj">
                            <div>
                                <p>Contribution to <br /> BookASmile</p>
                                <p>(₹1 per ticket has been added)</p>
                                <p>View T&C</p>
                            </div>
                            <div>
                                <p>Re. 1</p>
                                <p>Remove</p>
                            </div>
                        </div> */}
                            <div className="lkhyty">
                                <span>{!showp?'Paid Amount':'Amount Payable'}</span>
                                <span>Rs.{(seatinfo?.price)+lk-discount}</span>
                            </div>
                            {showp?
                            <div style={{cursor:'pointer'}} className="uidsfiugf" onClick={(e)=>bookmovie((seatinfo?.price)+lk-discount)}>Pay amount</div>
                            :<></>}
                        </div>
                    
                    
                    </div>
                    {!showp?
                    <button onClick={handlePrint}>Print this out!</button>:<></>}
                </div>
                
            
            
            </div>
            <div className="payfooter">
                <p>Note:</p>
                <p> 1.You can cancel the tickets 4 hour(s) before the show. Refunds will be done according to Cancellation Policy.</p>
                <p>2.In case of Credit/Debit Card bookings, the Credit/Debit Card and Card holder must be present at the ticket counter while collecting the ticket(s).</p>
            <p>© Bigtree Entertainment Pvt. Ltd. Privacy Policy | Contact Us </p>
            <img className="uoiuo" src="//in.bmscdn.com/webin/payment/pcci.png"/>
            
            </div>
        </div>
        
    )
}