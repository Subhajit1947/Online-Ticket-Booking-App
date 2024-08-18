import { useEffect, useState } from "react";

import styled from "styled-components";
import { Link } from "react-router-dom";
import Carousel from "react-elastic-carousel";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';


export const Home = () => {
  const [recommended, setRecommended] = useState([]);
  useEffect(() => {
    getMovies();
  
  }, []);

  const getMovies =async() => {
    const respons=await fetch('http://localhost:5000/')
    if(!respons.ok){
      console.log('invalid response')
    }
    if(respons.status!=200){
      console.log((await respons.json()).message)
    }
    const data=await respons.json()
    setRecommended([...recommended,...data.movies])
  };

  const Home = styled.div`
    width: 100%;
    margin: auto;
  `;

  const Recommended = styled.div`
    display: flex;
    width: 95%;
    height: 500px;
    margin: auto;
  `;

  const Wrapper = styled(Link)`
    width: 250px;
    height: 100%;
    margin-left: 30px;
    color: black;
    text-decoration: none;
  `;

  const Image = styled.img`
    width: 210px;
    height: 350px;
    border-radius: 10px;
  `;

  const AdImg = styled.img`
    width: 93%;
    height: 100px;
    margin-left: 50px;
  `;

  const Entertainment = styled.div`
    width: 97%;
    margin: auto;
  `;
  const Img = styled.img`
    width: 210px;
    height: 210px;
    border-radius: 10px;
    margin: 25px;
    cursor:pointer;
  `;
  
  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 350, itemsToShow: 2 },
    { width: 600, itemsToShow: 3 },
    { width: 850, itemsToShow: 4 },
    { width: 1050, itemsToShow: 5 },
  ];
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

  return (
    <>
    {recommended.length==0?
      <Stack spacing={1} style={{width:'100vw',height:'100vh'}}>
        {/* For variant="text", adjust the height via font-size */}
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />

        {/* For other variants, adjust the size with `width` and `height` */}
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" width={210} height={60} />
        <Skeleton variant="rounded" width={210} height={60} />
      </Stack>
    
    :
      <Home>
        <h2 style={{ marginLeft: "75px" }}>Recommended Movies</h2>
        <Recommended>
          <Carousel breakPoints={breakPoints}>
            {recommended.map((el) => {
              return (
                <Wrapper to={`/movies/${el._id}`} key={el._id}>
                  <Image src={`https://image.tmdb.org/t/p/w500${el.poster_path}`} />
                  <h4>{el.title}</h4>
                  <p style={{ color: "gray" }}>{el.genre_ids.map((gid)=><span>{genreid[gid]} </span>)}</p>
                </Wrapper>
              );
            })}
          </Carousel>
        </Recommended>

        <AdImg src="https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-1440,h-120:q-80/lead-in-v3-collection-202102040828.png" />

        <Entertainment>
          <h2 style={{textAlign:"center"}}>The Best Of Entertainment</h2>
          <div style={{marginLeft:'1rem',display:'flex',flexWrap:'wrap',justifyContent:'center',marginBottom:'1rem'}}>
            {recommended.map((el) => {
              return <Link to={`/movies/${el._id}`}><Img key={el._id} src={`https://image.tmdb.org/t/p/w500${el.poster_path}`} /></Link>;
            })}
          </div>
        </Entertainment>

      </Home>}
    </>
  );
};
