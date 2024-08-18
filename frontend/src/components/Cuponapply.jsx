import React,{useState,} from 'react'

const Cuponapply = ({setdiscount,setcuponid}) => {
    const [cuponapply,setcuponapply]=useState()
    const [cuponcode,setcuponcode]=useState('')


    const handleapply=async()=>{
        if(cuponcode!=''){
            const cuponinfojson=await fetch(`http://127.0.0.1:5000/cupon/${cuponcode}`)
            if(cuponinfojson.ok){
                const cuponinfo=await cuponinfojson.json()
                console.log(cuponinfo)
                setdiscount(cuponinfo.discount)
                setcuponapply(cuponinfo)
                setcuponid(cuponinfo._id)
            }
            
        }
        
    }
  return (
    <div style={{height:"10rem",padding:'1rem'}}>
        <div style={{height:"20%",display:'flex'}}>
            <div>offer code</div>
            <div style={{marginLeft:'2rem'}}>
                <span>Credit/</span><span> Debit/</span><span> Netbanking</span>
            </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',height:'80%'}}> 
            {cuponapply?<h2 style={{color:'green'}}>{cuponapply.cuponcode} is cupon applied </h2>:
            <div style={{display:'flex',justifyContent:'center',width:"90%",height:'30%'}}>
                <input onChange={(e)=>setcuponcode(e.target.value)} value={cuponcode} style={{boxShadow:'0 0 10px 0 rgba(0, 0, 0, .5)',border:'1px solid #d1d5db',width:'40%',paddingLeft:'15px',borderRadius:'2px',marginRight:'5px'}} type="text" placeholder="Enter Cupon Code" />
                <button type='button' onClick={handleapply} style={{width:'15%',border:'none',cursor:'pointer'}} className="mmmnnn">Check</button>
            </div>
            }
            <div style={{color:'#969696',fontWeight:'400',fontSize:'10px',marginTop:'1rem'}}>
            Works with</div>
            <div style={{color:'#969696',fontWeight:'400',fontSize:'10px'}}><span style={{color:'#f84464',fontWeight:'400',fontSize:'15px'}}>Movie Money </span>and BMS promocodes
            </div>
        </div>
    </div>
  )
}

export default Cuponapply