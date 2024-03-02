import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Footer } from '../../components/Footer';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const intialCredentials = {
        email: "",
        phoneNum: 0,
        role: ""
    }
    const [credentials, setCredentials] = useState(intialCredentials);

    //for show success message for payment
    function showSuccessMessage(message) {
        Swal.fire({
            title: 'Register Successful!',
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
        setCredentials({ ...credentials, [name]: value });
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(credentials)
        console.log(process.env.REACT_APP_SERVER_URL)
        
        axios.post(`${process.env.REACT_APP_SERVER_URL}/user-reg`, credentials)
            .then(res => {
                console.log(res.data);
                showSuccessMessage("Find your Login Credentials in your email")
                setCredentials({ ...credentials, email: "", phoneNum: 0 });
                navigate("/log-in")
            })
            .catch(err => {
                console.log(err)
                showErrorMessage(err.response.data.error)
            })

    }

    return (
        <>
            <Layout />
            <section className="breadcrumb-area relative about-banner" id="home">
                <div className="overlay overlay-bg"></div>
                <div className="container">
                    <div className="row d-flex align-items-center justify-content-center">
                        <div className="about-content col-lg-12">
                            <h3 className="text-white">
                                Register
                            </h3>
                            <p className="text-white link-nav"><a href="/">Home </a> / <span className="lnr lnr-arrow-right"></span>  <span className='current-page'>Register</span></p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="lg margin-0" />

            <section id="car-block" className='login-section section-gap'>
                <div className="container">
                    <div className="login-bg-area">
                        <div className="row mx-auto">
                            <div className="col-12 col-md-6 col-lg-6 login-form-area">
                            <h4 className='aligncenter login-head'><span className='high-light'>Ceylon <span>Cabs</span></span> - REGISTER</h4>
                                <hr />
                                <form class="form login-form">
                                    <div className="form-group">
                                        <label htmlFor="role" className='log-label'>Select Role</label>

                                        <div className="radio-inputs">
                                            <label className="radio">
                                                <input type="radio" name="role" value="Customer"
                                                    onChange={handleInputChange} />
                                                <span className="name">Customer</span>
                                            </label>

                                            <label className="radio">
                                                <input type="radio" name="role" value="Driver"
                                                    onChange={handleInputChange} />
                                                <span className="name">Driver</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className='log-label'>E-mail</label>
                                        <input type="email" name="email" placeholder="Enter your email" required 
                                            value={credentials.email}
                                            onChange={handleInputChange} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="mobile" className='log-label'>Mobile Number</label>
                                        <input type="number" name="phoneNum" placeholder="Enter your mobile number" required 
                                            value={credentials.phoneNum}
                                            onChange={handleInputChange} />
                                    </div>

                                    <div class="aligncenter">
                                        <button className='btn btn-yellow btn-lg' onClick={handleSubmit}>SUBMIT</button>
                                        <div className='dont-acc-text'>You already have an account?,&nbsp;
                                            <a href="/log-in">Login</a>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="lg margin-0" />
            <Footer />
        </>
    )
}

export default Register;