/** @format */

import React from "react";
import Slider from "react-slick";
import "./Carousels.css";
import slider_2 from "../../../assets/images/slider_1.PNG";
import slider_1 from "../../../assets/images/slider_2.PNG";
import slider_3 from "../../../assets/images/slider_3.jpg";

function Carousels() {
  const settings = {
    dots: false,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };
  return (
    <Slider {...settings} className="overflow-hidden w-full h-auto  slick-container" >
      <div>
        <img src={slider_1} alt="" />
      </div>
      <div>
        <img src={slider_2} alt="" />
      </div>
      <div className="">
        <img src={slider_3} alt="" />
      </div>
    </Slider>
  );
}

export default Carousels;
