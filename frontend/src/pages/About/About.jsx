import React from 'react';
import Layout from '../../components/Layout';
import { Footer } from '../../components/Footer';

import './About.css';

const Home = () => {

    return (
        <>
            <Layout />
            <section className="breadcrumb-area relative about-banner" id="home">
                <div className="overlay overlay-bg"></div>
                <div className="container">
                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="about-content col-lg-12">
                            <h3 className="text-white">
                                About Us
                            </h3>
                            <p className="text-white link-nav"><a href="/">Home </a> / <span className="lnr lnr-arrow-right"></span>  <span className='current-page'> About Us</span></p>
                        </div>
                    </div>
                </div>
            </section>
            <hr className="lg margin-0" />

            <section id="car-block">
                <div className="car-right animation-block about">
                    <img src="./images/taxi-img.png" alt="Car" />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <h4 className="yellow">About Us</h4>
                            <h2 className="h1 margin-0">Empowering Your Journeys</h2>
                        </div>
                        <div className="col-md-7">
                            <h6 className='margin-top-0'>The Ceylon Cabs Story</h6>
                            <p>
                                Welcome to CeylonCabs, your premier choice for hassle-free transportation services in Sri Lanka. Established with a commitment to providing reliable and convenient travel solutions, CeylonCabs strives to elevate your journey across the enchanting island nation.
                            </p>
                            <p>
                                At CeylonCabs, we understand the importance of safe and comfortable travel, whether you're a local resident or a visitor exploring the wonders of Sri Lanka. With a focus on professionalism, transparency, and exceptional customer service, we aim to exceed your expectations and make your travel experience memorable.
                            </p>
                            <p>
                                Our fleet of vehicles caters to diverse needs, ensuring that you find the perfect ride for every occasion. From solo travelers to families and groups, we have a wide range of vehicles equipped to meet your requirements.
                            </p>
                            <p>
                                Backed by a team of experienced and courteous drivers, we ensure that you reach your destination safely and on time. Our drivers are trained to navigate Sri Lanka's roads efficiently while prioritizing your comfort and safety throughout the journey.
                            </p>
                            <p>
                                Transparency is at the core of our operations, reflected in our fair and transparent pricing policy. With no hidden fees or surprises, you can trust CeylonCabs to provide you with upfront pricing and reliable service.
                            </p>

                            <p>
                                At CeylonCabs, we are committed to excellence in every aspect of our service. Whether you're heading to the airport, exploring cultural landmarks, or embarking on a scenic tour, trust CeylonCabs to make your travel experience seamless and enjoyable. Experience the difference with CeylonCabs and let us be your trusted partner for transportation in Sri Lanka.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="lg margin-0" />
            <section className="home-calltoaction-area relative">
                <div className="container">
                    <div className="overlay overlay-bg"></div>
                    <div className="row align-items-center section-gap">
                        <div className="col-lg-12">
                            <h2 className='text-center bottom-title'><span className='highlight'>Ceylon <span>Cabs</span></span> - Your Premier Transportation Solution in Sri Lanka</h2>
                            <p className='text-center'>
                                Welcome to Ceylon Cabs, your ultimate transportation partner in Sri Lanka. Whether you're a local resident or a visitor exploring the island's beauty, Ceylon Cabs is here to provide you with reliable, convenient, and comfortable travel solutions. From rapid city transfers to seamless airport pickups, booking hotels, and handling baggage transport, we offer a range of services designed to elevate your travel experience. With professional drivers, a diverse fleet of vehicles, transparent pricing, and 24/7 customer support, Ceylon Cabs is committed to ensuring that you reach your destination safely and stress-free. Experience the difference with Ceylon Cabs and make your journey across Sri Lanka truly memorable.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default Home;