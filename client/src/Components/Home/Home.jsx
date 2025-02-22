import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import homeVideo from "../../Assests/videos/home-video.mp4";
import adventureVideo from "../../Assests/videos/adventure-video.mp4";
import v1 from "../../Assests/videos/v1.mp4";
import hv1 from "../../Assests/videos/hv1.mp4";
import "./Home.css";

// Custom Arrow Component
const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow prev-arrow`}
      style={{ ...style }}
      onClick={onClick}
    >
      ❮
    </div>
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow next-arrow`}
      style={{ ...style }}
      onClick={onClick}
    >
      ❯
    </div>
  );
};

const VideoSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: false,
    fade: true,
    adaptiveHeight: true,
    prevArrow: <CustomPrevArrow />, // Add custom left arrow
    nextArrow: <CustomNextArrow />, // Add custom right arrow
  };

  const slides = [
    {
      videoSrc: hv1,
      title: "Explore the World",
      text: "Discover breathtaking destinations with us.",
    },
    {
      videoSrc: adventureVideo,
      title: "Adventure Awaits",
      text: "Embark on unforgettable journeys.",
    },
    {
      videoSrc: v1,
      title: "Luxury Travel",
      text: "Experience comfort like never before.",
    },
  ];

  return (
    <div className="video-slider">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="slide">
            <video
              src={slide.videoSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="slider-video"
            />
            <div className="overlay">
              <h1>{slide.title}</h1>
              <p>{slide.text}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default VideoSlider;
