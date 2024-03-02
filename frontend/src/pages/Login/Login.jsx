import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Footer } from '../../components/Footer';
import './Login.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
// import { useNavigate } from "react-router-dom";


const Login = () => {
    // const navigate = useNavigate()
    const intialCredentials = {
        userName: "",
        password: "",
        role: ""
    }
    const [credentials, setCredentials] = useState(intialCredentials);

    //for show success message for payment
    function showSuccessMessage(message) {
        Swal.fire({
            title: 'Congratulation!',
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
        let endPoint;
        if (credentials.role === "Admin") {
            endPoint = "login-admin"
        } else if (credentials.role === "Customer") {
            endPoint = "login-customer"
        } else if (credentials.role === "Driver") {
            endPoint = "login-driver"
        } else if (credentials.role === "Operator") {
            endPoint = "login-operator"
        }

        console.log(endPoint);
        if (!(credentials.role === "")) {
            axios.post(`${process.env.REACT_APP_SERVER_URL}/${endPoint}`, credentials)
                .then(res => {
                    console.log(res.data);
                    showSuccessMessage("Login Successful!")
                    setCredentials(intialCredentials);
                    if (credentials.role === "Customer") {
                        localStorage.setItem("token", JSON.stringify(res.data.accessToken));
                        // navigate(`/about`);
                        window.location.href = "/"
                    } else {
                        localStorage.setItem("token", JSON.stringify(res.data.accessToken));
                        // navigate(`/dashboard`);
                        window.location.href = "/dashboard"
                    }
                })
                .catch(err => {
                    console.log(err)
                    showErrorMessage(err.response.data.message)
                })
        } else {
            showErrorMessage("Select User Role")
        }
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
                                Login
                            </h3>
                            <p className="text-white link-nav"><a href="/">Home </a> / <span className="lnr lnr-arrow-right"></span>  <span className='current-page'>Login</span></p>
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
                                <h4 className='aligncenter login-head'><span className='high-light'>Ceylon <span>Cabs</span></span> - LOGIN</h4>
                                <hr />
                                <form class="form login-form">
                                    <div className="form-group">
                                        <label htmlFor="role" className='log-label'>Select Role</label>

                                        <div className="radio-inputs">
                                            <label className="radio">
                                                <input type="radio" name="role" value="Admin"
                                                    onChange={handleInputChange} />
                                                <span className="name">Admin</span>
                                            </label>
                                            <label className="radio">
                                                <input type="radio" name="role" value="Operator"
                                                    onChange={handleInputChange} />
                                                <span className="name">Operator</span>
                                            </label>

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
                                        <label className='log-label'>User Name</label>
                                        <input type="text" name="userName" placeholder="Enter your user name"
                                            value={credentials.userName}
                                            onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className='log-label'>Password</label>
                                        <input type="password" name="password" placeholder="Enter your password"
                                            value={credentials.password}
                                            onChange={handleInputChange} />
                                    </div>

                                    <div class="aligncenter">
                                        <button className='btn btn-yellow btn-lg' onClick={handleSubmit}>LOGIN</button>
                                        <div className='dont-acc-text'>You don't have an account?,&nbsp;
                                            <a href="/sign-up">Signup</a>
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

export default Login;