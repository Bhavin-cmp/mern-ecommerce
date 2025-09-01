import Slider from "react-slick";

const sliderImages = [
  "/Slider/slider1.jpg",
  "/Slider/slider2.jpg",
  "/Slider/slider3.jpg",
  "/Slider/slider4.jpg",
  "/Slider/slider5.jpg",
  "/Slider/slider6.jpg",
  "/Slider/slider7.jpg",
  "/Slider/slider8.jpg",
];

const HomeSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {sliderImages.map((img, idx) => (
        <div key={idx} className="homeSlider">
          <img
            src={img}
            alt={`slide-${idx}`}
            className="w-full h-96 object-cover rounded-xl"
          />
        </div>
      ))}
    </Slider>
  );
};

export default HomeSlider;
