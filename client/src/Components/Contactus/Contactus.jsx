import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Contactus.css"; // Add your custom styling here
import contact from "../../Assests/images/Contact/newcon.webp";
const Contact = () => {
  return (
    <section className="call_us" style={{backgroundImage: `url(${contact})`, // Inline style for background image
    backgroundSize: "cover", // Cover the entire section
    backgroundPosition: "center", // Center the image
    backgroundRepeat: "no-repeat",}}>
      <Container>
        <Row className="align-items-center">
          <Col md="8">
            <h5 className="title">CALL TO ACTION</h5>
            <h2 className="heading">
              READY FOR UNFORGETTABLE TRAVEL. REMEMBER US!
            </h2>
            <p className="text">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
          </Col>
          <Col md="4" className="text-center mt-3 mt-md-0">
            <a href="tel:6398312365" className="secondary_btn bounce">
              Contact Us!
            </a>
          </Col>
        </Row>
      </Container>
      <div className="overlay"></div>
    </section>
  );
};

export default Contact;
