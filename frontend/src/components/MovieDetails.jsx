import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"

import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
// import{addToken} from '../Reducers/tokenkey/action'
// import { useDispatch,useSelector } from "react-redux";

export const MovieDetails = () => {
	const navigate = useNavigate();

	const {id} = useParams();
	const [movie, setMovie] = useState({})

	useEffect(() => {
		getMovies();
},[])

const getMovies =async() => {
	const res=await fetch(`http://127.0.0.1:5000/${id}`)
	if(!res.ok){
		console.log('invalid response')
	}
	if(res.status!=200){
		console.log((await res.json()).message)
	}
	
	const data=await res.json()
	setMovie({...data})
}
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
  
// const tokens=useSelector((store)=>
// store.token.token
// )
const Left = styled.div`
	height: 80%;
	width: 20%;
	margin-left: 70px;
	margin-top: 40px
`

const MovieImg = styled.img`
	height: 100%;
	width: 100%;
	border-radius: 10px
`
const Right = styled.div`
	height: 90%;
	width: 50%;
	margin-left: 30px;
	margin-top: 40px
`

const About = styled.div`
	height: 150px;
	width: 65%;
	margin-left: 70px;
`

const Ratings= styled.div`
	background-color: #333333;
	height: 90px;
	width: 450px;
	border-radius: 10px;
	display: flex;
	justify-content: space-evenly
`
	
 	return(
		<>{Object.keys(movie).length==0?
			<Stack spacing={1}>
      {/* For variant="text", adjust the height via font-size */}
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />

      {/* For other variants, adjust the size with `width` and `height` */}
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rectangular" width={210} height={60} />
      <Skeleton variant="rounded" width={210} height={60} />
    </Stack>
		:
		<div>
			<div style={{height: "500px",position:'relative',width:"100%"}}>
			<div style={{zIndex:'-1',filter:'brightness(50%)',backgroundRepeat: 'no-repeat',backgroundSize:'cover',height:'100%',width:'100%',position:'absolute',top: 0,left: 0,
					backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})`,}}>

				</div>
			<div style={{ 
				display:"flex",height:'100%',width:'100%',position:'absolute'
			}}>
			
			<Left>
				<MovieImg style={{zIndex:10}} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}/>
			</Left>
			<Right style={{color: "white",zIndex:10}}>
				<h1 > {movie.title} </h1>
				<div style={{ display: "flex"}}>
					<FontAwesomeIcon icon={faHeart} style={{color: "#eb4e62", fontSize: "30px"}}/>
					<h4>{movie.vote_average} ratings</h4>
				</div>
				<Ratings>
					<div style={{color: "white"}}>
						<p style={{fontSize:"20px", fontWeight:"bold"}}>Add your rating & review</p>
						<p>Your ratings matter</p>
					</div>
					<button style={{margin: "25px 0px", borderRadius: "10px", border: "none"}}>Rate Now</button>
				</Ratings>
				<div style={{height: "30px", width: "300px", backgroundColor: "white", marginTop: "20px", borderRadius: "3px", fontWeight:"bold", color:"black"}}>2D</div>
				<div style={{height: "30px", width: "350px", backgroundColor: "white", marginTop: "20px", borderRadius: "3px", fontWeight:"bold", color:"black"}}>{languages[movie.original_language]}</div>

					<p style={{fontWeight: "bold", color: "white"}}>{movie.duration} {movie.type} . {movie.movieType} . {movie.release}</p>
					<button onClick={()=>{
						navigate(`/avaliablehall/${movie._id}`)
						localStorage.setItem('movie',JSON.stringify(movie))
					}}  style={{cursor:"pointer",width:"200px", height:"50px", borderRadius:"10px", border: "none", backgroundColor:"#eb4e62", color:"white", fontSize:"15px", fontWeight:"bold"}}>Book Tickets</button>
				
			</Right>
			
			{/* backgroundRepeat: 'no-repeat',backgroundSize:'cover',
				backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})`, */}
			
			</div>
				
			</div>
		<About>
			<h2>About the Movie</h2>
			<p>{movie.overview}</p>
			<hr style={{color:"gray"}}></hr>
		</About>
		
		</div>}</>
)}