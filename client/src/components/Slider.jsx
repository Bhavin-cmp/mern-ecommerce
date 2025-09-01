import React from "react";
import Slider from "react-slick";

const sliderImages = [
  "/images/slider1.jpg",
  "/images/slider2.jpg",
  "/images/slider3.jpg",
];
const HomeSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  const Slider = () => {
    return (
      <Slider {...settings}>
        {sliderImages.map((img, idx) => (
          <div key={idx}>
            <img
              src={img}
              alt={`slide-${idx}`}
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>
        ))}
      </Slider>
    );
  };
};

export default Slider;
