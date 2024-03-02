import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Footer } from '../../components/Footer';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';



const Contact = () => {

    const initialContactDetail = {
        name: "",
        email: "",
        msg: ""
    }
    const [contactDetail, setContactDetail] = useState(initialContactDetail)

    //for show success message for payment
    function showSuccessMessage(message) {
        Swal.fire({
            title: 'Success',
            text: message,
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK',
        });
    }

    //for show error message for payment
    function showErrorMessage(message) {
        Swal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK',
        });
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setContactDetail({ ...contactDetail, [name]: value });
    }

    const handleSend = () => {
        axios.post(`${process.env.REACT_APP_SERVER_URL}/contact-us`, contactDetail)
            .then(res => {
                console.log(res.data);
                showSuccessMessage("Your message will be sent to the admin, and they will contact you.")
                setContactDetail(initialContactDetail)
            })
            .catch(err => {
                console.log(err)
                showErrorMessage(err.response.data.error)
                setContactDetail(initialContactDetail)
            })
    }

    return (
        <>
            <Layout />
            <section className="breadcrumb-area relative about-banner contact-area" id="home">
                <div className="overlay overlay-bg"></div>
                <div className="container">
                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="about-content col-lg-12">
                            <h3 className="text-white">
                                Contact Us
                            </h3>
                            <p className="text-white link-nav"><a href="/">Home </a> / <span className="lnr lnr-arrow-right"></span>  <span className='current-page'>Contact Us</span></p>
                        </div>
                    </div>
                </div>
            </section>
            <hr className="lg margin-0" />

            <section id="page-contacts" className='contact-area'>
                <div class="container">
                    <div class="row">
                        <div class="col-lg-6 col-md-6">
                            <div class="row">
                                <div class="col-lg-12 col-md-12 col-sm-6">

                                    <h2 class="spanned">Contact Us</h2>
                                    <p>Got a question or need assistance? Don't hesitate to reach out to our friendly customer support team at Ceylon Cabs. Whether you have inquiries about our services, need to make changes to your booking, or require assistance during your journey, we're here to help. You can contact us via phone, email, or visit our physical location. Our team is available 24/7 to ensure that you receive prompt and reliable assistance whenever you need it. Experience personalized service and seamless travel arrangements with Ceylon Cabs – your trusted transportation partner in Sri Lanka.</p>
                                </div>
                                <div class="col-lg-12 col-md-12 col-sm-6">
                                    <ul class="address">
                                        <li class="large"><span class="fa fa-phone"></span>077-243-2547</li>
                                        <li><span class="fa fa-map-marker"></span>39/2 2nd Cross Street, 11, Colombo, Sri Lanka.</li>
                                        <li><span class="fa fa-envelope"></span>info.ceyloncabs@gmail.com</li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 contact-form">

                            <form class="form form-sm">
                                <h3 class="aligncenter">Send Message</h3>
                                <div class="form-group">
                                    <label>Your name <span class="red">*</span></label>
                                    <input type="text" id="name" name="name" placeholder="Enter your name" required
                                        value={contactDetail.name}
                                        onChange={handleInputChange} />
                                </div>
                                <div class="form-group">
                                    <label>E-mail <span class="red">*</span></label>
                                    <input type="text" id="email" name="email" placeholder="Enter your E-mail" required
                                        value={contactDetail.email}
                                        onChange={handleInputChange} />
                                </div>
                                <div class="form-group">
                                    <label>Message <span class="red">*</span></label>
                                    <textarea id="text" name="msg" placeholder="Enter the message" required
                                        value={contactDetail.msg}
                                        onChange={handleInputChange}></textarea>
                                </div>
                                <button type="button" className='btn btn-yellow aligncenter btn-lg'
                                    onClick={handleSend}>
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="lg margin-0" />
            <Footer />
        </>
    )
}

export default Contact;