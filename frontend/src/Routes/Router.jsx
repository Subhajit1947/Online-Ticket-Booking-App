import {Route,Routes} from "react-router-dom"
import { Home } from "../components/Home"
import { MovieDetails } from "../components/MovieDetails"
import { Offers } from "../components/Offers/Offers"
import Cinemahall from "../components/Cinemahall"
import SelectTicket from "../components/SelectTicket"
import { Payment } from "../components/payment"
export const Router=()=>{
    return(
<Routes>
    < Route path="/" element={<Home/>}/>
    < Route path="/movies/:id" element={<MovieDetails/>}/>
    < Route path="/payment/:id" element={<Payment/>}/>
    < Route path="/avaliablehall/:id" element={<Cinemahall/>}/>
    < Route path="/selectticket/:sid" element={<SelectTicket/>}/>
    < Route path="/offers" element={<Offers />}/>
   
</Routes>

    )
}

