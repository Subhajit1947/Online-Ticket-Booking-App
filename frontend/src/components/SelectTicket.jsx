import React, { useState,useEffect } from 'react'
import { useParams,useNavigate,Link } from 'react-router-dom'
const SelectTicket = () => {
    const {sid}=useParams()
    const navigate=useNavigate()
    const [movie,setmovie]=useState(JSON.parse(localStorage.getItem('movie'))||null)
    const [hallobj,sethallobj]=useState(JSON.parse(localStorage.getItem('halldetails'))||null)
    const [selecttime,setselecttime]=useState('')
    const [sh,setsh]=useState(null)
    const [seats,setseats]=useState(true)
    const [noseats,takeseat]=useState(2)
    const [sseat,setsseat]=useState([])
    const [tabledata,settabledata]=useState([])
    const [golden,setgolden]=useState([])
    const [silver,setsilver]=useState([])
    const [diamond,setdiamond]=useState({})
    const [showid,setshowid]=useState('')
    const [lockseat,setlockseat]=useState([])
    const [currdate,setcurrdate]=useState()
    const months = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December',
      };
    const getcurrdate=()=>{
        if(selecttime){
            const date = new Date(selecttime);
            const localtime = `${date.getDate()}, ${months[date.getMonth()]}, ${date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })}`;
           
            setcurrdate(localtime)
        }
       
    }
    useEffect(()=>{
        getcurrdate()
    },[selecttime])


    const handlesseat=(ss)=>{
        if(!sseat.includes(ss)){
            setsseat([...sseat,ss])
        }

    }
    useEffect(()=>{
        fetchloackseat()
    },[])
    const fetchloackseat=async()=>{
        const lockseatjson=await fetch(`http://127.0.0.1:5000/check/islock/${sid}`)
        if(!lockseatjson.ok){
            console.log('somthing went to wrong')
        }
        else{
            const lockseat11=await lockseatjson.json()
            console.log('locked seat',lockseat11)
            setlockseat([...lockseat11])
        }
    }
    useEffect(()=>{
        tdatafn()
        getstarttime()
    },[sid])
    const getstarttime=async()=>{
        const tdjson=await fetch(`http://127.0.0.1:5000/currentshow/${sid}`)
        if(tdjson.ok){
            const td=await tdjson.json()
            setselecttime(td.starttime)
        }
        
    }
    const tdatafn=async()=>{
        const tdjson=await fetch(`http://127.0.0.1:5000/showseat/${sid}`)
        const td=await tdjson.json()
        const d={}
        const g={}
        const s={}
        console.log('td',td)
        setsilver(td.gold)
        setgolden(td.silver)
        td.diamond.map((obj)=>{
            if(d[obj.seatdetails.seatrow]){
                d[obj.seatdetails.seatrow]=[...d[obj.seatdetails.seatrow],obj]
            }
            else{
                d[obj.seatdetails.seatrow]=[obj]
            }
        })
        td.gold.map((obj)=>{
            if(g[obj.seatdetails.seatrow]){
                g[obj.seatdetails.seatrow]=[...g[obj.seatdetails.seatrow],obj]
            }
            else{
                g[obj.seatdetails.seatrow]=[obj]
            }
        })
        td.silver.map((obj)=>{
            if(s[obj.seatdetails.seatrow]){
                s[obj.seatdetails.seatrow]=[...s[obj.seatdetails.seatrow],obj]
            }
            else{
                s[obj.seatdetails.seatrow]=[obj]
            }
        })
        setdiamond(d)
        setgolden(g)
        setsilver(s)
    }
    const handlechecklock=async()=>{
        
        const sd={
            arr:sseat
        }
        const csljson=await fetch(`http://127.0.0.1:5000/checklocked/${showid}`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(sd)
        })
        
        if(!csljson.ok){
            const serr=await csljson.json()
            console.error(serr)
        }
        const csl=await csljson.json()
        localStorage.setItem('showseatids',JSON.stringify(sd))
        navigate(`/payment/${showid}`)
    }
    useEffect(()=>{
        while(sseat.length>noseats){
            sseat.shift()
        }
    },[sseat.length])

  return (
    <div>
        {seats ? <div className="ticketdiv">
            <div className="ticketpop">
                <div className="kjvfsfli">Select Seat</div>
                <span style={{cursor:"pointer"}}><span style={noseats==1?{backgroundColor:"#f84464"}:{}} onClick={()=>{
                    takeseat(1)
                }}>1</span><span style={noseats==2?{backgroundColor:"#f84464"}:{}} onClick={()=>{
                    takeseat(2)
                }}>2</span><span style={noseats==3?{backgroundColor:"#f84464"}:{}} onClick={()=>{
                    takeseat(3)
                }}>3</span><span style={noseats==4?{backgroundColor:"#f84464"}:{}} onClick={()=>{
                    takeseat(4)
                }}>4</span><span style={noseats==5?{backgroundColor:"#f84464"}:{}} onClick={()=>{
                    takeseat(5)
                }}>5</span><span style={noseats==6?{backgroundColor:"#f84464"}:{}} onClick={()=>{
                    takeseat(6)
                }}>6</span><span style={noseats==7?{backgroundColor:"#f84464"}:{}} onClick={()=>{
                    takeseat(7)
                }}>7</span><span style={noseats==8?{backgroundColor:"#f84464"}:{}} onClick={()=>{
                    takeseat(8)
                }}>8</span><span style={noseats==9?{backgroundColor:"#f84464"}:{}} onClick={()=>{
                    takeseat(9)
                }}>9</span><span style={noseats==10?{backgroundColor:"#f84464"}:{}} onClick={()=>{
                    takeseat(10)
                }}>10</span></span>
                <div className="kjvfsfla">No seat : {noseats}</div>
                <div onClick={()=>setseats(false)} className="kjvfsfln">Select</div>
            </div>
        </div>:
    <div style={{}}>
        <div style={{position:'sticky'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',margin:'1rem'}}>
                <div style={{display:'flex',justifyContent:'flex-start'}}>
                    <button style={{border:'none',backgroundColor:'#fff'}}>
                        <svg style={{cursor:'pointer'}} onClick={()=>navigate(`/avaliablehall/${movie?movie._id:'#'}`)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <div style={{display:'flex',flexDirection:'column',marginLeft:'1rem'}}>
                        <div>{movie?.original_title}</div>
                        <div>{hallobj?.halldetails?.cinemadetails?.name},{hallobj?.halldetails?.name} {hallobj?.halldetails?.cinemadetails?.location} |{currdate}</div>
                    </div>
                </div>
                <div style={{display:'flex',flexDirection:'flex-end'}}>
                    <div style={{marginRight:'2rem'}}>{noseats} Tickects</div>
                    <div style={{marginRight:'2rem'}}>
                        <svg style={{cursor:'pointer'}} onClick={()=>navigate(`/avaliablehall/${movie?movie._id:'#'}`)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div style={{fontSize:'12px',backgroundColor:'#f5f5fa',display:'flex',justifyContent:'flex-start',padding:'1rem'}}>
                {hallobj.starttime.map((tobj)=>(
                   
                    <div onClick={()=>{
                        navigate(`/selectticket/${tobj._id}`)
                    }} style={selecttime==tobj.time?{color:"white",margin:'1rem',display:'flex',justifyContent:'center',alignItems:'center',height:'2rem',width:'7rem',border:'1px solid #2dc492',borderRadius:'5px',backgroundColor:'#2dc492'}:{cursor:"pointer",margin:'1rem',color:'#2dc492',display:'flex',justifyContent:'center',alignItems:'center',height:'2rem',width:'7rem',border:'1px solid #2dc492',borderRadius:'5px'}}>
                    {/* {`${parseInt(((tobj.time.split('T')[1]).slice(0,5)).split(':')[0])%12}:${parseInt(((tobj.time.split('T')[1]).slice(0,5)).split(':')[1])} ${parseInt(((tobj.time.split('T')[1]).slice(0,5)).split(':')[0])>12?'PM':'AM'}`} */}
                    
                    {(new Date(tobj.time)).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                    })}
                    </div>
                    
                ))}
                
                {/* <div style={{margin:'1rem',color:'#2dc492',display:'flex',justifyContent:'center',alignItems:'center',height:'2rem',width:'7rem',border:'1px solid #2dc492',borderRadius:'5px'}}>
                    09:45 AM
                </div>
                <div style={{margin:'1rem',color:'#2dc492',display:'flex',justifyContent:'center',alignItems:'center',height:'2rem',width:'7rem',border:'1px solid #2dc492',borderRadius:'5px'}}>
                    09:45 AM
                </div>
                <div style={{margin:'1rem',color:'#2dc492',display:'flex',justifyContent:'center',alignItems:'center',height:'2rem',width:'7rem',border:'1px solid #2dc492',borderRadius:'5px'}}>
                    09:45 AM
                </div> */}
            </div>
        </div>
        <div style={{width:'100vw',display:'flex',justifyContent:'center',marginBottom:'2rem'}}>
            <div style={{width:'80%',display:'flex',justifyContent:'center'}}>
            <table>
                <tbody>
                        <tr>
                            <td>
                                <div style={{fontWeight:'bold',marginTop:'2rem',fontSize:'13px'}}>DIAMOND Rs.170</div>
                                
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                        {Object.entries(diamond).map(([key,val])=>(
                            <tr style={{}}>
                                <td>
                                    <div style={{fontSize:'13px'}}>{String.fromCharCode(64+Number(key))}</div>
                                    
                                </td>
                                
                                <td style={{display:'flex'}}>
                                {
                                    val.length>0?val.map((s)=>(
                                        s.status=='b'?(
                                            <div style={{height:'22px',width:'22px',backgroundColor:'#f5f5fa',marginLeft:'3px',marginRight:'3px'}}></div>
                                        ):s.status=='u'?(
                                            // <div onClick={()=>handlesseat(`${obj.name}${s.sn}`)} onMouseEnter={() =>setsh(`${obj.name}${s.sn}`)}  onMouseLeave={() => setsh(null)} style={{cursor:'pointer',backgroundColor:(sseat.includes(`${obj.name}${s.sn}`)||sh==`${obj.name}${s.sn}`)?'#1ea83c':'',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:'2px',margin:'3px',height:'22px',width:'22px',border:'1px solid #1ea83c',fontSize:'10px'}}>{s.sn}</div>
                                            lockseat?.includes(s._id)?
                                            <div style={{height:'22px',width:'22px',backgroundColor:'#f5f5fa',marginLeft:'3px',marginRight:'3px'}}></div>
                                            :
                                            <div onClick={()=>{
                                                handlesseat(s._id)
                                                setshowid(s.show)
                                            }} onMouseEnter={() =>setsh(`${s.seatdetails.seatrow}${s.seatdetails.seatcol}`)}  onMouseLeave={() => setsh(null)} style={{cursor:'pointer',backgroundColor:(sseat.includes(s._id)||sh==`${s.seatdetails.seatrow}${s.seatdetails.seatcol}`)?'#1ea83c':'',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:'2px',marginLeft:'3px',marginRight:'3px',height:'22px',width:'22px',border:'1px solid #1ea83c',fontSize:'10px'}}>{s.seatdetails.seatcol}</div>
                                        ):(
                                            <div style={{marginLeft:'3px',marginRight:'3px',height:'22px',width:'22px'}}></div>  
                                        )
                                    )):<></>
                                }
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td>
                                <div style={{fontWeight:'bold',marginTop:'2rem',fontSize:'13px'}}>Gold Rs.150</div>
                                
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                        {Object.entries(golden).map(([key,val])=>(
                            <tr style={{}}>
                                <td>
                                    <div style={{fontSize:'13px'}}>{String.fromCharCode(64+Number(key))}</div>
                                    
                                </td>
                                
                                <td style={{display:'flex'}}>
                                {
                                    val.length>0?val.map((s)=>(
                                        s.status=='b'?(
                                            <div style={{height:'22px',width:'22px',backgroundColor:'#f5f5fa',marginLeft:'3px',marginRight:'3px'}}></div>
                                        ):s.status=='u'?(
                                            // <div onClick={()=>handlesseat(`${obj.name}${s.sn}`)} onMouseEnter={() =>setsh(`${obj.name}${s.sn}`)}  onMouseLeave={() => setsh(null)} style={{cursor:'pointer',backgroundColor:(sseat.includes(`${obj.name}${s.sn}`)||sh==`${obj.name}${s.sn}`)?'#1ea83c':'',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:'2px',margin:'3px',height:'22px',width:'22px',border:'1px solid #1ea83c',fontSize:'10px'}}>{s.sn}</div>
                                            <div onClick={()=>{
                                                handlesseat(s._id)
                                                setshowid(s.show)
                                            
                                            }} onMouseEnter={() =>setsh(`${s.seatdetails.seatrow}${s.seatdetails.seatcol}`)}  onMouseLeave={() => setsh(null)} style={{cursor:'pointer',backgroundColor:(sseat.includes(`${s._id}`)||sh==`${s.seatdetails.seatrow}${s.seatdetails.seatcol}`)?'#1ea83c':'',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:'2px',marginLeft:'3px',marginRight:'3px',height:'22px',width:'22px',border:'1px solid #1ea83c',fontSize:'10px'}}>{s.seatdetails.seatcol}</div>
                                        ):(
                                            <div style={{marginLeft:'3px',marginRight:'3px',height:'22px',width:'22px'}}></div>  
                                        )
                                    )):<></>
                                }
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td>
                                <div style={{marginTop:'1rem',marginBottom:'10px',fontWeight:'bold',fontSize:'13px'}}>Silver Rs.120</div>
                                
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                        {Object.entries(silver).map(([key,val])=>(
                            <tr style={{}}>
                                <td>
                                    <div style={{fontSize:'13px'}}>{String.fromCharCode(64+Number(key))}</div>
                                    
                                </td>
                                
                                <td style={{display:'flex'}}>
                                {
                                    val?.length>0?val.map((s)=>(
                                        s.status=='b'?(
                                            <div style={{height:'22px',width:'22px',backgroundColor:'#f5f5fa',marginLeft:'3px',marginRight:'3px'}}></div>
                                        ):s.status=='u'?(
                                            // <div onClick={()=>handlesseat(`${obj.name}${s.sn}`)} onMouseEnter={() =>setsh(`${obj.name}${s.sn}`)}  onMouseLeave={() => setsh(null)} style={{cursor:'pointer',backgroundColor:(sseat.includes(`${obj.name}${s.sn}`)||sh==`${obj.name}${s.sn}`)?'#1ea83c':'',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:'2px',margin:'3px',height:'22px',width:'22px',border:'1px solid #1ea83c',fontSize:'10px'}}>{s.sn}</div>
                                            <div onClick={()=>{
                                                handlesseat(s._id)
                                                setshowid(s.show)
                                            }} onMouseEnter={() =>setsh(`${s.seatdetails.seatrow}${s.seatdetails.seatcol}`)}  onMouseLeave={() => setsh(null)} style={{cursor:'pointer',backgroundColor:(sseat.includes(`${s._id}`)||sh==`${s.seatdetails.seatrow}${s.seatdetails.seatcol}`)?'#1ea83c':'',display:'flex',justifyContent:'center',alignItems:'center',borderRadius:'2px',marginLeft:'3px',marginRight:'3px',height:'22px',width:'22px',border:'1px solid #1ea83c',fontSize:'10px'}}>{s.seatdetails.seatcol}</div>
                                        ):(
                                            <div style={{marginLeft:'3px',marginRight:'3px',height:'22px',width:'22px'}}></div>  
                                        )
                                    )):<></>
                                }
                                </td>
                            </tr>
                        ))}
                    
                </tbody>
            </table>
            </div>
        </div>
        {noseats==sseat.length?
        <div style={{width:'100vw',height:'4rem',boxShadow:'0 0 10px 0 rgba(0, 0, 0, .5)',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <div onClick={handlechecklock} style={{cursor:'pointer',width:'20%',height:'35%',backgroundColor:'#f84464',color:'white',textAlign:'center',padding:'10px',borderRadius:'5px'}}>Pay</div>
        </div>:<></>}
    </div>}
    </div>
  )
}

export default SelectTicket