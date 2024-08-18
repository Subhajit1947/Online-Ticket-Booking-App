import Reac,{useEffect, useState} from 'react'
import hall from './hall.json'
import { useParams,useNavigate } from "react-router-dom"
import { width } from '@fortawesome/free-solid-svg-icons/fa0';
const Cinemahall = () => {
  const {id} = useParams();
	const [chall, setchall] = useState([])
  const [moviename,setmoviename]=useState(JSON.parse(localStorage.getItem("movie"))||'')
  const navigate=useNavigate()
  useEffect(()=>{
    gethall()
  },[id]) 
  const gethall=async()=>{
    // const arr=[]
    // hall?.map((h)=>{
    //   h.ongoing_movies.map((m)=>{
    //     if(m.movieId==id){
    //       const obj={}
    //       obj['mid']=m.movieId
    //       obj['hid']=h.hallId
    //       obj['hallName']=h.hallName
    //       obj['title']=m.title
    //       obj['showtime']=m.showtime
    //       if(obj){
    //         setmoviename(m.title)
    //         arr.push(obj)
    //       }
          
    //     }
    //   })
    // })
    // setchall([...arr])
    const allshowjson=await fetch(`http://127.0.0.1:5000/show/${id}`)
    const allshow=await allshowjson.json()
    setchall([...allshow])
    
  }
  return (
    <div>
      <section style={{position: 'relative',
    textAlign: 'left',display: 'inline-block',width: '100%',boxSizing: 'border-box',background:' #fff',
    color: '#999',
    zIndex: '3'}}>
        <div style={{fontSize: '100%',
    fontWeight: 'bold',padding: '30px 20px 15px'}}>
          
        <h1>{moviename.original_title}</h1>										
        </div>
        <div style={{padding: '30px 20px 15px',borderTop:'1px solid #94a3b8', display:'flex',justifyContent:'flex-start'}}>
        <button style={{border:'none',backgroundColor:'#fff'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </button>
          <div style={{color: '#fff',marginLeft:'1rem',fontSize:'13px',
    fontWeight: '500',height:'50px',width:'40px',backgroundColor:'#f84464',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:'5px',borderRadius:'6px'}}>
            <div style={{height:'30%'}}>SAT</div>
            <div style={{height:'30%'}}>20</div>
            <div style={{height:'30%'}}>JUL</div>
          </div>
          <div style={{color: '#fff',marginLeft:'1rem',fontSize:'13px',
    fontWeight: '500',height:'50px',width:'40px',backgroundColor:'#f84464',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:'5px',borderRadius:'6px'}}>
            <div style={{height:'30%'}}>SAT</div>
            <div style={{height:'30%'}}>20</div>
            <div style={{height:'30%'}}>JUL</div>
          </div>
          <div style={{color: '#fff',marginLeft:'1rem',fontSize:'13px',
    fontWeight: '500',height:'50px',width:'40px',backgroundColor:'#f84464',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:'5px',borderRadius:'6px'}}>
            <div style={{height:'30%'}}>SAT</div>
            <div style={{height:'30%'}}>20</div>
            <div style={{height:'30%'}}>JUL</div>
          </div>
          <div style={{color: '#fff',marginLeft:'1rem',fontSize:'13px',
    fontWeight: '500',height:'50px',width:'40px',backgroundColor:'#f84464',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:'5px',borderRadius:'6px'}}>
            <div style={{height:'30%'}}>SAT</div>
            <div style={{height:'30%'}}>20</div>
            <div style={{height:'30%'}}>JUL</div>
          </div>
          <button style={{border:'none',backgroundColor:'#fff',marginLeft:'1rem'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

        </div>
      </section>
      <div style={{width:'100%',backgroundColor:'#e5e7eb',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <div style={{marginTop:'1rem',marginBottom:'1rem',width:'95%',height:'95%',backgroundColor:'#fff'}}>
              <div style={{fontSize: '10px',color:'#6b7280',display:'flex',justifyContent:'flex-end',height:'3rem',width:'100%'}}>
                
                  <div style={{display:'flex',justifyContent:'center',alignItems:'center',marginRight:'1rem'}}>
                    <div style={{marginRight:'5px',height:'10px',width:'10px',borderRadius:'50%',backgroundColor:'green'}}></div>
                    <div>AVAILABLE</div>
                  </div>
                  <div style={{display:'flex',justifyContent:'center',alignItems:'center',marginRight:'1rem'}}>
                    <div style={{marginRight:'5px',height:'10px',width:'10px',borderRadius:'50%',backgroundColor:'red'}}></div>
                    <div>FAST FILLING</div>
                  </div>
                  {/* <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <div style={{marginRight:'2px',height:'10px',width:'10px',borderRadius:'50%',backgroundColor:'green'}}></div>
                    <div>avaliable</div>
                  </div> */}
                
              </div>
              {chall?.map((obj)=>(
                  <div key={obj._id} style={{marginBottom:'1rem',borderTop:'1px solid #e5e7eb',width:'100%',display:'flex',justifyContent:'space-between'}}>
                  <div style={{height:'100%',width:'40%'}}>
                    <div style={{display:'flex',alignItems:'center',height:'30%',marginLeft:'1rem'}}>
                    <div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                    </div>
                    <div style={{marginLeft:'10px',fontWeight: '700',color: '#333'}}>{obj.halldetails.cinemadetails.name},{obj.halldetails.name} {obj.halldetails.cinemadetails.location} 
                    </div>
                    </div>
                  </div>
                  <div style={{height:'100%',width:'60%'}}>
                    <div style={{height:'80%',width:'100%',display:'flex',justifyContent:'flex-start',flexWrap:'wrap'}}>
                      {obj.starttime.map((tobj)=>(
                        // const time=((tobj.time.split('T')[1]).slice(0,5)).split(':')
                          <div key={tobj._id} onClick={()=>{
                            navigate(`/selectticket/${tobj._id}`)
                            localStorage.setItem('halldetails',JSON.stringify(obj))
                            localStorage.setItem('selecttime',JSON.stringify(tobj.time))
                            }} style={{cursor:'pointer',margin:'1rem',color:'#4abd5d',display:'flex',justifyContent:'center',alignItems:'center',height:'2rem',width:'7rem',border:'1px solid #9ca3af',borderRadius:'5px'}}>
                            {/* {`${parseInt(((tobj.time.split('T')[1]).slice(0,5)).split(':')[0])%12}:${parseInt(((tobj.time.split('T')[1]).slice(0,5)).split(':')[1])} ${parseInt(((tobj.time.split('T')[1]).slice(0,5)).split(':')[0])>12?'PM':'AM'}`} */}
                            {(new Date(tobj.time)).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                    })}
                        </div>
                      ))}
                      {/* <div onClick={()=>navigate(`/selectticket/${obj.hid}/${obj.mid}`)} style={{cursor:'pointer',margin:'1rem',color:'#4abd5d',display:'flex',justifyContent:'center',alignItems:'center',height:'2rem',width:'7rem',border:'1px solid #9ca3af',borderRadius:'5px'}}>
                          {obj.showtime}
                      </div> */}
                      
                      
                    </div>
                    <div style={{display:'flex',justifyContent:'flex-start',alignItems:'center'}}>
                        <div style={{marginRight:'5px',height:'8px',width:'8px',borderRadius:'50%',backgroundColor:'yellow'}}></div>
                        <div style={{fontSize:'12px'}}>Non-cancellable</div>
                  </div>
                  </div>
            </div>
              ))}
              

              
              
            </div>
            
      </div>
    </div>
  )
}

export default Cinemahall