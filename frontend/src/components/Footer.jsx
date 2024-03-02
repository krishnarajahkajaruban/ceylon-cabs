import React from 'react';
import './index.css'

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <section id="block-footer">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-5 col-md-6 col-sm-6 col-xs-12 col-ms-6">
                            <div className='footer-image-container'>
                                <img src="./images/logo-inner.png" alt="Ceylon Cabs" />
                            </div>
                            <p className='footer-desc'>Explore Sri Lanka with confidence and convenience with Ceylon Cabs. Our dedicated team is committed to providing you with seamless transportation solutions, whether you're heading to the airport, booking a hotel, or embarking on a sightseeing excursion. With our professional drivers, diverse fleet of vehicles, transparent pricing, and 24/7 customer support, we strive to make your travel experience hassle-free and memorable. Contact us today to discover the difference with Ceylon Cabs.</p>

                            {/* <div class="social-small social-yellow">
                                <a href="#" class="fa fa-twitter"></a>
                                <a href="#" class="fa fa-facebook"></a>
                                <a href="#" class="fa fa-instagram"></a>
                                <a href="#" class="fa fa-google-plus"></a>
                                <a href="#" class="fa fa-pinterest"></a>
                            </div> */}
                        </div>
                        <div class="col-lg-4 col-md-5 hidden-md hidden-sm hidden-xs hidden-ms">
                            <h4>Explore</h4>
                            <div class="row">
                                <div class="col-md-12">
                                    <ul class="nav navbar-nav">
                                        <li><a href="/about">About Us</a></li>
                                        <li><a href="/services">Services</a></li>
                                        <li><a href="/contact-us">Contact Us</a></li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                        <div class="col-lg-3 col-md-6 col-sm-6 col-ms-6">
                            <h4>Contact Us</h4>
                            <p><span class="yellow">Address : </span>39/2 2nd Cross Street, 11, Colombo, Sri Lanka.</p>

                            <ul class="address">
                                <li><span class="fa fa-phone"></span>077-243-2547</li>
                                <li><span class="fa fa-envelope"></span><a href="#">info.ceyloncabs@gmail.com</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <footer>
                <div class="container">
                    <a href="#">Ceylon Cabs</a> {currentYear} © All Rights Reserved
                    <a href="#" class="go-top hidden-xs hidden-ms"></a>
                </div>
            </footer>
            
        </>
    )
}

export default Footer;