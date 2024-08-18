import { BanksCart } from "../BanksCart.jsx/BanksCart";
import { CartBtn } from "../CartBtn/CartBtn";
import { useEffect,useState } from "react";
import "./Offers.css";

export const Offers = () => {
  const [cupon,setcupon]=useState([])
  useEffect(()=>{
    fetchallcupon()
  },[])
  const fetchallcupon=async()=>{
    const allcuponjson=await fetch('http://127.0.0.1:5000/cupon/all')
    if(!allcuponjson.ok){
      console.log('somthing wrong')
    }
    const allcupon=await allcuponjson.json()
    setcupon([...allcupon])
  }
  
  return (
    <div className="Offer_containter">
      <div>
        <input className="inputBox" type="text" placeholder="Search for Offers by Name or Bank" />
        {/* <div className="CartMainDiv">
          <h4>FILTER OFFERS BY</h4>
          <div className="cartDiv">
            <CartBtn />
          </div>
        </div> */}
        <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',padding:'1rem'}}>
          {
            cupon?.map((coupon)=>(
              <div className="coupon-card">
                <div className="coupon-header">
                  <h2 className="coupon-code">{coupon.cuponcode}</h2>
                  <span className={`coupon-status ${coupon.status}`}>{coupon.status}</span>
                </div>
                <div className="coupon-details">
                  <p className="coupon-description">{coupon.description}</p>
                  <p className="coupon-type">
                    Type: <strong>{coupon.cupontype}</strong>
                  </p>
                  <p className="coupon-discount">
                    Discount: <strong>{coupon.cupontype === 'rate' ? `${coupon.discount}%` : `Rs.${coupon.discount}`}</strong>
                  </p>
                  {coupon.cupontype === 'fixed' && coupon.maxdiscount > 0 && (
                    <p className="coupon-max-discount">
                      Max Discount: <strong>Rs.{coupon.maxdiscount}</strong>
                    </p>
                  )}
                  <p className="coupon-dates">
                    Valid from: <strong>{new Date(coupon.starttime).toLocaleDateString()}</strong> to <strong>{new Date(coupon.endtime).toLocaleDateString()}</strong>
                  </p>
                </div>
              </div>
            ))
          }
          
        </div>



      </div>
    </div>
  );
};
