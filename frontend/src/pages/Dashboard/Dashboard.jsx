import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Footer } from '../../components/Footer';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

const Dashboard = () => {
    const [token, setToken] = useState("");
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const [allBookings, setAllBookings] = useState([]);
    const [bookingUserDetail, setBookinguserDetail] = useState();
    const [allUsers, setAllUsers] = useState([]);
    const [responseUsers, setResponseUsers] = useState();
    const [selecteValue, setSelecteValue] = useState("Customer");
    const [allRoutes, setAllRoutes] = useState([]);

    const [viewModalIsOpen, setViewIsOpen] = React.useState(false);
    const [createModalIsOpen, setCreateIsOpen] = React.useState(false);
    const [bookingModalIsOpen, setBookingIsOpen] = React.useState(false);

    const [editingRouteDetail, setEditingRouteDetail] = useState();
    const [contactUs, setContactUs] = useState([]);

    const initialRouteDetail = {
        fromLocation: "",
        toLocation: "",
        amount: ""
    }
    const [routeDetail, setRouteDetail] = useState(initialRouteDetail)

    /* ..........operator booking ............*/
    const [selectedDate, setSelectedDate] = useState(null);
    const [toLocations, setToLocations] = useState([]);
    const [fromLocations, setFromLocations] = useState([]);

    const [filteredLocations, setFilteredLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');

    const [filteredToLocations, setFilteredToLocations] = useState([]);
    const [selectedToLocation, setSelectedToLocation] = useState('');

    const [driverRouteDetail, setDriverRouteDetail] = useState([]);
    const [searching, setSearching] = useState(true);
    const [showDateAndTime, setShowDateAndTime] = useState(false);

    const [extractedDate, setExtractedDate] = useState('');
    const [extractedTime, setExtractedTime] = useState('');
    const [pickUpLocation, setPickUpLocation] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhoneNum, setCustomerPhoneNum] = useState("");
    const [to, setTo] = useState("");
    const [from, setFrom] = useState("");
    const [driverId, setDriverId] = useState("");
    const [money, setMoney] = useState("");
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [bookingButtonStatus, setBookingButtonStatus] = useState(false);
    const [modalIsOpen, setIsOpen] = React.useState(false);

    const handleChange = date => {
        setSelectedDate(date);
    };

    useEffect(() => {
        const dateTime = new Date(selectedDate);
        const extractedDate = dateTime.toDateString(); // Extracting date
        const extractedTime = dateTime.toLocaleTimeString(); // Extracting time

        setExtractedDate(extractedDate);
        setExtractedTime(extractedTime);
    }, [selectedDate]);

    const handleFromInputChange = (event) => {
        const inputValue = event.target.value;
        if (inputValue) {
            setSelectedLocation(inputValue); // Update selectedLocation state
            const filtered = fromLocations.filter(location =>
                location.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredLocations(filtered);
        } else {
            setSelectedLocation("")
            setFilteredLocations([])
        }

    };

    // Function to handle click on filtered location
    const handleLocationClick = (location) => {
        setSelectedLocation(location);
        setFilteredLocations([]);
    };

    const handleToInputChange = (event) => {
        const inputValue = event.target.value;
        if (inputValue) {
            setSelectedToLocation(inputValue); // Update selectedLocation state
            const filtered = toLocations.filter(location =>
                location.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredToLocations(filtered);
        } else {
            setSelectedToLocation("")
            setFilteredToLocations([])
        }

    };

    // Function to handle click on filtered location
    const handleToLocationClick = (location) => {
        setSelectedToLocation(location);
        setFilteredToLocations([]);
    };

    useEffect(() => {

        axios.get(`${process.env.REACT_APP_SERVER_URL}/find-from-routes`)
            .then(res => {
                console.log(res.data)
                setFromLocations(res.data);
            })
            .catch(err => {
                console.log(err)
            })

        axios.get(`${process.env.REACT_APP_SERVER_URL}/find-to-routes`)
            .then(res => {
                console.log(res.data)
                setToLocations(res.data);
            })
            .catch(err => {
                console.log(err);
            })

    }, [])

    const handleRouteDetail = () => {
        setIsOpen(true);
        setSearching(true);
        setDriverRouteDetail([]);
        setSelectedRowIndex(null);
        setDriverId("");
        axios.get(`${process.env.REACT_APP_SERVER_URL}/route-detail/${selectedLocation}/${selectedToLocation}`)
            .then(res => {
                console.log(res.data);
                setDriverRouteDetail(res.data);
                setSearching(false)
            })
            .catch(err => {
                console.log(err)
                setSearching(false)
            })
    }

    const handleBooking = async () => {
        const bookingData = {
            driverId,
            time: extractedTime,
            date: extractedDate,
            operatorId: user.id,
            from,
            to,
            money,
            pickUpLocation,
            customerEmail,
            customerPhoneNum
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/create-new-booking-by-operator`, bookingData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });

            console.log(response.data);
            showSuccessMessage("Booking Notification sent to Driver");

            const bookings = await GetBookings(`booking-of-operator/${user.id}`);
            console.log(bookings);
            setAllBookings(bookings);
        } catch (error) {
            console.log(error);
            showErrorMessage(error.response.data.error);
        }
    };

    /*........................................................... */

    function closeViewModal() {
        setViewIsOpen(false);
    }

    function closeCreateModal() {
        setCreateIsOpen(false);
    }

    function closeBookModal() {
        setBookingIsOpen(false);
        setDriverRouteDetail([]);
        setSelectedLocation("");
        setSelectedToLocation("");
        setIsOpen(false);
        setShowDateAndTime(false);
        setCustomerEmail("");
        setCustomerPhoneNum("");
        setPickUpLocation("");
        setSelectedDate(null);
        setDriverId("");
        setSelectedRowIndex(null);
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete the Route Detail!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${process.env.REACT_APP_SERVER_URL}/delete-route/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    }
                })
                    .then(res => {
                        if (res.status === 204) {
                            Swal.fire('Success!', 'Route detail deleted successfully', 'success');
                            setTimeout(() => {
                                window.location.reload();
                            }, 3000);
                        } else {
                            Swal.fire('Error!', res.data.error, 'error');
                        }
                    })
                    .catch(err => {
                        Swal.fire('Error!', err.response.data.error, 'error');
                    });
            }
        });
    }


    const handleEdit = (detail) => {
        setCreateIsOpen(true);
        setEditingRouteDetail(detail);
    }

    const handleOperatorBook = (detail) => {
        setBookingIsOpen(true);
    }


    useEffect(() => {
        if (editingRouteDetail) {

            setRouteDetail({
                ...routeDetail,
                fromLocation: editingRouteDetail?.from,
                toLocation: editingRouteDetail?.to,
                amount: editingRouteDetail?.money
            })
        }

    }, [editingRouteDetail])

    useEffect(() => {
        if (!createModalIsOpen) {
            setEditingRouteDetail();
            setRouteDetail(initialRouteDetail);
        }

    }, [createModalIsOpen])

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRouteDetail({ ...routeDetail, [name]: value });
    }

    const handleRouteCreate = (event) => {
        setCreateIsOpen(false);
        event.preventDefault();
        const data = {
            from: routeDetail.fromLocation,
            to: routeDetail.toLocation,
            money: routeDetail.amount,
            driverId: user?.id
        };

        let endpoint;
        let method; // Define method variable to hold the HTTP method
        if (editingRouteDetail) {
            endpoint = `edit-route/${editingRouteDetail?._id}`;
            method = 'PATCH'; // Set method to PATCH if editingRouteDetail is present
        } else {
            endpoint = `create-new-route-for-driver`;
            method = 'POST'; // Set method to POST if editingRouteDetail is not present
        }

        axios({
            method, // Use the method variable to specify the HTTP method
            url: `${process.env.REACT_APP_SERVER_URL}/${endpoint}`,
            data,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        })
            .then(res => {
                console.log(res.data);
                showSuccessMessage(editingRouteDetail ? "Route detail Updated" : "New Route Created");
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            })
            .catch(err => {
                console.log(err);
                showErrorMessage(err.response.data.error);
            });
    };

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

    const getProtectedData = async (accessToken) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/protected`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        const storedToken = JSON.parse(localStorage.getItem('token'));
        if (storedToken) {
            setToken(storedToken);
        } else {
            setLoading(false); // No token, so stop loading
            navigate('/log-in'); // Navigate to login page
        }
    }, [])

    useEffect(() => {
        if (token) {
            const fetchData = async () => {
                try {
                    const user = await getProtectedData(token);
                    console.log(user);
                    setUser(user);
                    setLoading(false)
                } catch (error) {
                    console.log(error);
                    setLoading(false)
                }
            };

            fetchData();
        }
    }, [token]);

    const GetBookings = async (endPoint) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/${endPoint}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });
            return response.data;

        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                if (user?.role === "Driver") {
                    const bookings = await GetBookings(`booking/${user.id}`);
                    console.log(bookings);
                    setAllBookings(bookings)
                } else if (user?.role === "Customer") {
                    const bookings = await GetBookings(`bookings-customer/${user.id}`);
                    console.log(bookings);
                    setAllBookings(bookings)
                } else if (user?.role === "Operator") {
                    const bookings = await GetBookings(`booking-of-operator/${user.id}`);
                    console.log(bookings);
                    setAllBookings(bookings)
                } else if (user?.role === "Admin") {
                    const bookings = await GetBookings(`all-bookings-with-customer-driver-details`);
                    console.log(bookings);
                    setAllBookings(bookings)
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchBookings();
    }, [user]);

    const handleBookingUser = (Customer, Driver) => {
        setBookinguserDetail({
            Customer,
            Driver
        })
        setViewIsOpen(true);
    }

    const renderStars = (numStars) => {
        const stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push(<i key={i} className='fa fa-star rate'></i>);
        }
        for (let i = numStars; i < 5; i++) {
            stars.push(<i key={i} className='fa fa-star'></i>);
        }
        return stars;
    };

    const handleRating = (id, num) => {
        console.log(id, num)

        const driverId = id
        const ratingNum = num

        axios.patch(`${process.env.REACT_APP_SERVER_URL}/update-driver-rating`, { driverId, ratingNum }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        })
            .then(res => {
                console.log(res.data)
                showSuccessMessage("Rating Sent");
                setTimeout(() => {
                    window.location.reload()
                }, 3000)
            })
            .catch(err => {
                console.log(err)
                showErrorMessage(err.response.data.error);
            })
    }

    const handleConfirm = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Confirm the Booking!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.patch(`${process.env.REACT_APP_SERVER_URL}/confirm-booking/${id}`, { id }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    }
                })
                    .then(res => {
                        console.log(res.data)
                        showSuccessMessage("Booking confirmed")
                        setTimeout(() => {
                            window.location.reload()
                        }, 3000)
                    })
                    .catch(err => {
                        console.log(err)
                        showErrorMessage(err.response.data.error);
                    })
            }
        });
    }

    const handleReject = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Reject the Booking!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.patch(`${process.env.REACT_APP_SERVER_URL}/reject-booking/${id}`, { id }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    }
                })
                    .then(res => {
                        console.log(res.data)
                        showSuccessMessage("Booking rejected!")
                        setTimeout(() => {
                            window.location.reload()
                        }, 3000)
                    })
                    .catch(err => {
                        console.log(err)
                        showErrorMessage(err.response.data.error);
                    })
            }
        });
    }

    const handleChangeAvailability = (driverId) => {
        axios.patch(`${process.env.REACT_APP_SERVER_URL}/changing-availability-driver`, { driverId }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        })
            .then(res => {
                console.log(res.data)
                showSuccessMessage("Availability Status Changed")
                setTimeout(() => {
                    window.location.reload()
                }, 3000)
            })
            .catch(err => {
                console.log(err)
                showErrorMessage(err.response.data.error)
            })
    }

    useEffect(() => {
        if (user?.role === "Admin") {
            axios.get(`${process.env.REACT_APP_SERVER_URL}/all-users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res.data)
                    setResponseUsers(res.data)
                    if (selecteValue === "Customer") {
                        setAllUsers(res.data?.allCustomer)
                    }
                })
                .catch(err => {
                    console.log(err)
                })

            axios.get(`${process.env.REACT_APP_SERVER_URL}/contact-us`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res.data)
                    setContactUs(res.data)

                })
                .catch(err => {
                    console.log(err)
                })


        }

    }, [user])

    useEffect(() => {
        if (user?.role === "Driver") {
            axios.get(`${process.env.REACT_APP_SERVER_URL}/all-routes-driver/${user?.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            })
                .then(res => {
                    console.log(res.data)
                    setAllRoutes(res.data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [user])

    useEffect(() => {
        if (selecteValue === "Customer") {
            setAllUsers(responseUsers?.allCustomer)
        } else if (selecteValue === "Driver") {
            setAllUsers(responseUsers.allDriver)
        } else if (selecteValue === "Operator") {
            setAllUsers(responseUsers.allOperator)
        }
    }, [selecteValue])

    return (
        <>
            {loading ? <div className="dot-spinner-area">
                <div className="dot-spinner">
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                </div>
            </div> :
                (user ? <>
                    <Layout />
                    <section className="breadcrumb-area relative about-banner" id="home">
                        <div className="overlay overlay-bg"></div>
                        <div className="container">
                            <div className="row d-flex align-items-center justify-content-center">
                                <div className="about-content col-lg-12">
                                    <h3 className="text-white">
                                        Dashboard
                                    </h3>
                                    <p className="text-white link-nav"><a href="/">Home </a> / <span className="lnr lnr-arrow-right"></span>  <span className='current-page'> Dashboard</span></p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <hr className="lg margin-0" />

                    <section id="car-block" className='login-section section-gap'>
                        <div className="container">
                            <div className="row login-form-section">
                                <div className="col-sm-12 login-form-area custom-margin">
                                    <div className="">
                                        <h4 className='text-center mb-4 margin-0 font-weight-700'>PROFILE</h4>
                                        {/* <button className='text-center mb-4'
                                        onClick={()=>navigate(-1)}>back</button> */}
                                        <hr />
                                        <div className="row">
                                            <div className="col-sm-12 col-lg-12">
                                                <div className="row p-2">
                                                    <div className="col-sm-5">
                                                        <h6 className='margin-0'>User Name</h6>
                                                    </div>
                                                    <div className="col-sm-7">
                                                        <h6 className='margin-0 text-secondary sub-text'>{user.userName}</h6>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row p-2">
                                                    <div className="col-sm-5">
                                                        <h6 className='margin-0'>E-Mail</h6>
                                                    </div>
                                                    <div className="col-sm-7">
                                                        <h6 className='margin-0 text-secondary sub-text'>{user.email}</h6>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row p-2">
                                                    <div className="col-sm-5">
                                                        <h6 className='margin-0'>Mobile</h6>
                                                    </div>
                                                    <div className="col-sm-7">
                                                        <h6 className='margin-0 text-secondary sub-text'>{user.phoneNum}</h6>
                                                    </div>
                                                </div>
                                                {user?.role === "Driver" &&
                                                    <>
                                                        <hr />
                                                        <div className="row p-2">
                                                            <div className="col-sm-5">
                                                                <h6 className='margin-0'>Current Rating</h6>
                                                            </div>
                                                            <div className="col-sm-7">
                                                                <div className="current-rating">
                                                                    {renderStars(user?.rating)}
                                                                </div>
                                                            </div>

                                                        </div>

                                                        <hr />
                                                        <div className="row p-2">
                                                            <div className="col-sm-5">
                                                                <h6 className='margin-0'>Availability</h6>
                                                            </div>
                                                            <div className="col-sm-7 d-flex justify-content-between align-items-end gap-10">
                                                                <div className="radio-inputs">
                                                                    <label className="radio">
                                                                        <input type="radio" name="role" value="true" checked={user?.availability} />
                                                                        <span className="name success">Available</span>
                                                                    </label>

                                                                    <label className="radio">
                                                                        <input type="radio" name="role" value="false" checked={!(user?.availability)} />
                                                                        <span className="name danger">Not Available</span>
                                                                    </label>
                                                                </div>
                                                                <hr />
                                                                <div className='text-right'>
                                                                    <button type='button' className='btn btn-success change-status-btn'
                                                                        onClick={() => handleChangeAvailability(user?.id)}>Change</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {allBookings?.length > 0 ?
                                    <div className="col-sm-12 login-form-area custom-margin">
                                        <div className="">
                                            <h4 className='text-center mb-4 margin-0 font-weight-700'>BOOKINGS</h4>
                                            {user?.role === "Operator" && <button className='btn btn-sm btn-success'
                                                onClick={() => setBookingIsOpen(true)}
                                            >
                                                <i className='fa fa-plus mr-2'></i>&nbsp;
                                                Create Booking
                                            </button>}
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div class="inner-two-col">
                                                        <div class="text-page">
                                                            <div className="book-table-area table-responsive">
                                                                <table className='table margin-bottom-0'>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>No.</th>
                                                                            <th>Date</th>
                                                                            <th>Time</th>
                                                                            <th>From</th>
                                                                            <th>To</th>
                                                                            <th>Amount</th>
                                                                            <th className='text-center'>Status</th>
                                                                            <th className='text-center'>Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {allBookings.map((book, index) => {
                                                                            const cusDetail = book?.customerDetatls;
                                                                            const driverDeta = book?.driverDetails;

                                                                            return (
                                                                                <tr>
                                                                                    <td>{index + 1}.</td>
                                                                                    <td>{book?.bookingDetails?.date}</td>
                                                                                    <td>{book?.bookingDetails?.time}</td>
                                                                                    <td>{book?.bookingDetails?.from}</td>
                                                                                    <td>{book?.bookingDetails?.to}</td>
                                                                                    <td>{book?.bookingDetails?.money}</td>
                                                                                    <td className='text-center'>
                                                                                        {/* <span className="booking-status pending">Pending</span> */}
                                                                                        <span className={`booking-status ${book?.bookingDetails?.status == "Completed" ? "completed" : "pending"}`}>{book?.bookingDetails?.status}</span>
                                                                                    </td>
                                                                                    <td className='text-center'>
                                                                                        <button className='btn view-btn margin-bottom-0'
                                                                                            onClick={() => handleBookingUser(cusDetail, driverDeta)}
                                                                                        >
                                                                                            <i className='fa fa-eye'></i>
                                                                                        </button>

                                                                                        {(user?.role === "Driver" && book?.bookingDetails?.status == "Pending") &&
                                                                                            <>
                                                                                                <button className='btn view-btn btn-success ml-2 margin-bottom-0'
                                                                                                    onClick={() => handleConfirm(book?.bookingDetails?.id)}>
                                                                                                    Confirm
                                                                                                </button>
                                                                                                <button className='btn view-btn btn-danger ml-2'
                                                                                                    onClick={() => handleReject(book?.bookingDetails?.id)}
                                                                                                >
                                                                                                    Reject
                                                                                                </button>
                                                                                            </>
                                                                                        }
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })}

                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="no-data-created-area custom-margin">
                                        <div className='no-data-created'>
                                            {user?.role === "Operator" && <button className='btn btn-sm btn-success'
                                                onClick={() => setBookingIsOpen(true)}
                                            >
                                                <i className='fa fa-plus mr-2'></i>&nbsp;
                                                Create Booking
                                            </button>}
                                            <div className='no-data-text'>No Bookings Found!</div>
                                        </div>
                                    </div>
                                }

                                {(user?.role === "Admin") &&
                                    <div className="col-sm-12 login-form-area mt-4 custom-margin">
                                        <div className="">
                                            <h4 className='text-center mb-4 margin-0 font-weight-700'>USERS</h4>
                                            <hr />
                                            <div className="bg-white p-3 mb-3">
                                                <div className="row custom-margin">
                                                    <div className="col-sm-7 my-auto">
                                                        <h6 className='text-dark margin-0'>Select User:</h6>
                                                    </div>
                                                    <div className="col-sm-5">
                                                        <select className='form-control light-theme' value={selecteValue}
                                                            onChange={(e) => setSelecteValue(e.target.value)}>
                                                            {/* <option value="">-- Select User --</option> */}
                                                            <option value="Customer" selected>Customer</option>
                                                            <option value="Driver">Driver</option>
                                                            <option value="Operator">Operator</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            {allUsers?.length > 0 && <div className="row">
                                                <div className="col-sm-12">

                                                    <div class="inner-two-col">
                                                        <div class="text-page">
                                                            <div className="book-table-area table-responsive">
                                                                <table className='table margin-bottom-0'>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>No.</th>
                                                                            <th>Name</th>
                                                                            <th>E-Mail</th>
                                                                            <th>Mobile</th>
                                                                            <th>Role</th>
                                                                            {selecteValue === "Driver" &&
                                                                                <>
                                                                                    <th className='text-center'>Availability</th>
                                                                                    <th>Rating</th>
                                                                                </>}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {allUsers.map((user, index) => {
                                                                            return (
                                                                                <tr>
                                                                                    <td>{index + 1}.</td>
                                                                                    <td>{user?.userName}</td>
                                                                                    <td>{user?.email}</td>
                                                                                    <td>{user?.phoneNum}</td>
                                                                                    <td>{user?.role}</td>
                                                                                    {user?.role === "Driver" &&
                                                                                        <>
                                                                                            <td className='text-center'>
                                                                                                {user?.availability ? <span className="booking-status completed">Available</span> :
                                                                                                    <span className="booking-status pending">Not Available</span>}
                                                                                            </td>
                                                                                            <td>
                                                                                                <div className="current-rating">
                                                                                                    {renderStars(user?.rating)}
                                                                                                </div>
                                                                                            </td>
                                                                                        </>}

                                                                                </tr>
                                                                            )
                                                                        })}

                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>}
                                        </div>
                                    </div>}
                                {(user?.role === "Admin" && allUsers?.length === 0) &&
                                    <div className="no-data-created-area custom-margin">
                                        <div className='no-data-created'>
                                            <div className='no-data-text'>No {selecteValue} Found!</div>
                                        </div>
                                    </div>
                                }


                                {(user?.role === "Admin") &&
                                    <>
                                        <div className="col-sm-12 login-form-area mt-4">
                                            <div className="">
                                                <h4 className='text-center mb-4 margin-0 font-weight-700'>CONTACT US MESSAGES</h4>
                                                {/* <div className="bg-white p-3 mb-3">
                                                <div className="row">
                                                    <div className="col-sm-7 m-auto">
                                                        <h6 className='text-dark mb-0'>Select User:</h6>
                                                    </div>
                                                    <div className="col-sm-5">
                                                        <select className='form-control' value={selecteValue}
                                                            onChange={(e) => setSelecteValue(e.target.value)}>
                                                            <option value="">-- Select User --</option>
                                                            <option value="Customer" selected>Customer</option>
                                                            <option value="Driver">Driver</option>
                                                            <option value="Operator">Operator</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div> */}
                                                <hr />
                                                {contactUs?.length > 0 &&
                                                    <div className="row">
                                                        <div className="col-sm-12">

                                                            <div class="inner-two-col">
                                                                <div class="text-page">
                                                                    <div className="book-table-area table-responsive">
                                                                        <table className='table margin-bottom-0'>
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>No.</th>
                                                                                    <th>Name</th>
                                                                                    <th>E-Mail</th>
                                                                                    {/* <th>Mobile</th> */}
                                                                                    <th>Message</th>

                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {contactUs.map((msg, index) => {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td>{index + 1}.</td>
                                                                                            <td>{msg?.name}</td>
                                                                                            <td>{msg?.email}</td>
                                                                                            {/* <td>{msg?.phoneNum}</td> */}
                                                                                            <td>{msg?.msg}</td>
                                                                                        </tr>
                                                                                    )
                                                                                })}

                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>}
                                            </div>
                                        </div>
                                    </>
                                }
                                {(user?.role === "Admin" && contactUs?.length === 0) && <div className="no-data-created-area">
                                    <div className='no-data-created'>
                                        <div className='no-data-text'>No Contact Message Found!</div>
                                    </div>
                                </div>}


                                {(user.role === "Driver") &&
                                    <>
                                        {/* <hr className='lg margin-0' /> */}
                                        <div className="col-sm-12 login-form-area mt-4">
                                            <div className="">
                                                <div className="d-flex align-items-center justify-content-between mb-3">
                                                    <h4 className='text-center mb-0 font-weight-700 margin-0'>ROUTE CHARGES</h4>
                                                    <hr />
                                                    <button className='btn btn-sm btn-success custom-margin'
                                                        onClick={() => setCreateIsOpen(true)}
                                                    >
                                                        <i className='fa fa-plus mr-2'></i>&nbsp;
                                                        Create New
                                                    </button>
                                                </div>

                                                <div className="row">
                                                    <div className="col-sm-12">

                                                        <div class="inner-two-col">
                                                            <div class="text-page">
                                                                <div className="book-table-area table-responsive">
                                                                    <table className='table margin-bottom-0'>
                                                                        <thead>
                                                                            <tr>
                                                                                <th>No.</th>
                                                                                <th>From</th>
                                                                                <th>To</th>
                                                                                <th>Amount</th>
                                                                                <th>Action</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {allRoutes?.length > 0 ?
                                                                            <tbody>
                                                                                {allRoutes?.map((routesCharge, index) => {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td>{index + 1}.</td>
                                                                                            <td>{routesCharge?.from}</td>
                                                                                            <td>{routesCharge?.to}</td>
                                                                                            <td>{routesCharge?.money}</td>
                                                                                            <td><>
                                                                                                <button className='btn view-btn btn-success ml-2 margin-bottom-0'
                                                                                                    onClick={() => handleEdit(routesCharge)}>
                                                                                                    Edit
                                                                                                </button>
                                                                                                <button className='btn view-btn btn-danger ml-2 mb-0'
                                                                                                    onClick={() => handleDelete(routesCharge?._id)}
                                                                                                >
                                                                                                    Delete
                                                                                                </button>
                                                                                            </></td>
                                                                                        </tr>
                                                                                    )
                                                                                })}

                                                                            </tbody> :
                                                                            <tr>
                                                                                <td colSpan={4} className='text-center text-secondary'>No Data found!</td>
                                                                            </tr>
                                                                        }

                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </section>

                    <Footer />

                    {/* view modal here */}
                    <Modal
                        isOpen={viewModalIsOpen}
                        onRequestClose={closeViewModal}
                        style={customStyles}
                        contentLabel="View Modal"
                    >
                        <div className="modal--header">
                            <h6>User Information</h6>
                            <button className='btn close-button' onClick={closeViewModal}>&times;</button>
                        </div>

                        <div className="modal--body">
                            {bookingUserDetail?.Customer &&
                                <div className='modal--content'>
                                    <h6 className='pb-3 text-success margin-0'>Customer Information</h6>
                                    <hr />
                                    <div className='bg-white pt-4 pb-4 pl-3 pr-3'>
                                        <div className="row">
                                            <div className="col-sm-12 col-lg-12">
                                                <div className="row">
                                                    <div className="col-sm-5">
                                                        <h6 className='margin-0'>UserName</h6>
                                                    </div>
                                                    <div className="col-sm-7">
                                                        <h6 className='margin-0 text-secondary sub-text'>{bookingUserDetail?.Customer?.userName}</h6>
                                                    </div>
                                                </div>
                                                <hr className="cus-hr-line" />
                                                <div className="row">
                                                    <div className="col-sm-5">
                                                        <h6 className='margin-0'>E-Mail</h6>
                                                    </div>
                                                    <div className="col-sm-7">
                                                        <h6 className='margin-0 text-secondary sub-text'>{bookingUserDetail?.Customer?.email}</h6>
                                                    </div>
                                                </div>
                                                <hr className="cus-hr-line" />
                                                <div className="row">
                                                    <div className="col-sm-5">
                                                        <h6 className='margin-0'>Mobile</h6>
                                                    </div>
                                                    <div className="col-sm-7">
                                                        <h6 className='margin-0 text-secondary sub-text'>{bookingUserDetail?.Customer?.phoneNum}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            <hr />
                            {bookingUserDetail?.Driver &&
                                <div className='modal--content'>
                                    <h6 className='pb-3 text-info margin-0'>Driver Information</h6>
                                    <hr />
                                    <div className='bg-white'>
                                        <div className="row">
                                            <div className="col-sm-12 col-lg-12">
                                                <div className="row">
                                                    <div className="col-sm-5">
                                                        <h6 className='margin-0 '>UserName</h6>
                                                    </div>
                                                    <div className="col-sm-7">
                                                        <h6 className='margin-0 text-secondary sub-text'>{bookingUserDetail?.Driver?.userName}</h6>
                                                    </div>
                                                </div>
                                                <hr className="cus-hr-line" />
                                                <div className="row">
                                                    <div className="col-sm-5">
                                                        <h6 className='margin-0 '>E-Mail</h6>
                                                    </div>
                                                    <div className="col-sm-7">
                                                        <h6 className='margin-0 text-secondary sub-text'>{bookingUserDetail?.Driver?.email}</h6>
                                                    </div>
                                                </div>
                                                <hr className="cus-hr-line" />
                                                <div className="row">
                                                    <div className="col-sm-5">
                                                        <h6 className='margin-0 '>Mobile</h6>
                                                    </div>
                                                    <div className="col-sm-7">
                                                        <h6 className='margin-0 text-secondary sub-text'>{bookingUserDetail?.Driver?.phoneNum}</h6>
                                                    </div>
                                                </div>
                                                <hr className="cus-hr-line" />
                                                <div className="row">
                                                    <div className="col-sm-5">
                                                        <h6 className='margin-0 '>Availability</h6>
                                                    </div>
                                                    <div className="col-sm-7">
                                                        {(bookingUserDetail?.Driver?.availability) ? <h6 className='margin-0 text-success sub-text'>Available</h6> :
                                                            <h6 className='margin-0 text-warning sub-text'>Not Available</h6>}

                                                    </div>
                                                </div>
                                                <hr className="cus-hr-line" />
                                                <div className="row">
                                                    <div className="col-sm-5">
                                                        <h6 className='margin-0 '>Current Rating</h6>
                                                    </div>
                                                    <div className="col-sm-7">
                                                        <div className="current-rating">
                                                            {renderStars(bookingUserDetail?.Driver?.rating)}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <hr className="cus-hr-line" />
                                    <div className="row pl-2 pr-2">
                                        <div className="col-sm-12 col-md-6 my-auto">
                                            <h6 className='margin-0'>Rating</h6>
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            <div className="form-group mt-2">
                                                <div class="rating">
                                                    <input value="5" name="rate" id="star5" type="radio"
                                                        onChange={() => handleRating(bookingUserDetail?.Driver?.id, 5)} />
                                                    <label title="text" for="star5"></label>
                                                    <input value="4" name="rate" id="star4" type="radio"
                                                        onChange={() => handleRating(bookingUserDetail?.Driver?.id, 4)} />
                                                    <label title="text" for="star4"></label>
                                                    <input value="3" name="rate" id="star3" type="radio"
                                                        onChange={() => handleRating(bookingUserDetail?.Driver?.id, 3)} />
                                                    <label title="text" for="star3"></label>
                                                    <input value="2" name="rate" id="star2" type="radio"
                                                        onChange={() => handleRating(bookingUserDetail?.Driver?.id, 2)} />
                                                    <label title="text" for="star2"></label>
                                                    <input value="1" name="rate" id="star1" type="radio"
                                                        onChange={() => handleRating(bookingUserDetail?.Driver?.id, 1)} />
                                                    <label title="text" for="star1"></label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>

                        <div className="modal--footer">
                            <button type="button" class="btn btn-secondary modal-btn" onClick={closeViewModal}>Close</button>
                        </div>

                    </Modal>
                    {/*  */}


                    {/* route charges modal here */}
                    <Modal
                        isOpen={createModalIsOpen}
                        onRequestClose={closeCreateModal}
                        style={customStyles}
                        contentLabel="Create Modal"
                    >

                        <div className="modal--header">
                            <h6>Create</h6>
                            <button className='btn close-button' onClick={closeCreateModal}>&times;</button>
                        </div>

                        <div className="modal--body">
                            <form>
                                <div className='book-form-area'>
                                    <div class="form-group row mb-4">
                                        <label for="from_location" class="col-sm-2 col-form-label text-orange font-weight-500">From :</label>
                                        <div class="col-sm-10">
                                            <input type="text" name='fromLocation' className='form-control dark-theme' placeholder='Enter Location'
                                                value={routeDetail.fromLocation}
                                                onChange={handleInputChange} />
                                        </div>
                                    </div>

                                    <div class="form-group row mb-4">
                                        <label for="to_location" class="col-sm-2 col-form-label text-orange font-weight-500">To :</label>
                                        <div class="col-sm-10">
                                            <input type="text" name='toLocation' className='form-control dark-theme' placeholder='Enter Location'
                                                value={routeDetail.toLocation}
                                                onChange={handleInputChange} />
                                        </div>
                                    </div>

                                    <div class="form-group row margin-bottom-0">
                                        <label for="amount" class="col-sm-2 col-form-label text-orange font-weight-500">Amount : <br />(LKR)</label>
                                        <div class="col-sm-10">
                                            <input type="text" name='amount' className='form-control dark-theme' placeholder='Enter Amount'
                                                value={routeDetail.amount}
                                                onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="modal--footer">
                            <button type="button" class="btn btn-secondary modal-btn" onClick={closeCreateModal}>Close</button>
                            <button type="button" class="btn btn-success modal-btn"
                                onClick={handleRouteCreate}
                                disabled={routeDetail.fromLocation == "" || routeDetail.toLocation == "" || routeDetail.amount == ""}>
                                {editingRouteDetail ? "Update" : "Create"}
                            </button>
                        </div>

                    </Modal>
                    {/*  */}


                    {/* booking modal here */}
                    <Modal
                        isOpen={bookingModalIsOpen}
                        onRequestClose={closeBookModal}
                        style={customStyles}
                        contentLabel="Booking Modal"
                    >
                        <div className="modal--header">
                            <h6>Booking</h6>
                            <button className='btn close-button' onClick={closeBookModal}>&times;</button>
                        </div>

                        <div className="modal--body">
                            <div className="selected-location-area custom">
                                <div className="row">
                                    <div className="col-lg-5">
                                        <div className="form-group">
                                            <label htmlFor="" className='form-label absolute text-orange'>From&nbsp;<span className='form-required'>*</span></label>
                                            <input type="text" className='form-control dark-theme' placeholder='From'
                                                value={selectedLocation}
                                                onChange={handleFromInputChange} />

                                            <div className='search-result-data-area custom'>
                                                {filteredLocations.map((location, index) => (
                                                    <div
                                                        key={index}
                                                        className='search-result-data'
                                                        onClick={() => handleLocationClick(location)}>
                                                        {location}
                                                    </div>
                                                ))}
                                            </div>

                                            {!selectedLocation && <small className='form-required'>This field is required</small>}
                                        </div>
                                    </div>
                                    <div className="col-lg-5">
                                        <div className="form-group">
                                            <label htmlFor="" className='form-label absolute text-orange'>To&nbsp;<span className='form-required'>*</span></label>
                                            <input type="text" className='form-control dark-theme' placeholder='To'
                                                value={selectedToLocation}
                                                onChange={handleToInputChange} />

                                            <div className='search-result-data-area custom'>
                                                {filteredToLocations.map((location, index) => (
                                                    <div
                                                        key={index}
                                                        className='search-result-data'
                                                        onClick={() => handleToLocationClick(location)}
                                                    >
                                                        {location}
                                                    </div>
                                                ))}
                                            </div>

                                            {!selectedToLocation && <small className='form-required'>This field is required</small>}
                                        </div>
                                    </div>
                                    <div className="col-lg-2">
                                        <div className="form-group">
                                            <button type="button" class="btn btn-success modal-btn w-100 btn-margin"
                                                onClick={handleRouteDetail}
                                                disabled={!(selectedLocation && selectedToLocation)}>Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {modalIsOpen && <div class="inner-two-col">
                                <div class="text-page">
                                    <div className="book-table-area table-responsive">
                                        <table className='table margin-bottom-0'>
                                            <thead>
                                                <tr>
                                                    <th>No.</th>
                                                    <th>Driver Name</th>
                                                    <th>Mobile No.</th>
                                                    <th>Amount</th>
                                                    <th>Rating</th>
                                                    <th className='text-center'>Select</th>
                                                </tr>
                                            </thead>

                                            {driverRouteDetail.length > 0 ?
                                                <tbody>
                                                    {driverRouteDetail.map((rout, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}.</td>
                                                            <td>{rout?.driver?.userName}</td>
                                                            <td>{rout?.driver?.phoneNum}</td>
                                                            <td>{rout?.money}</td>

                                                            <td className='verical-align-middle'>
                                                                <div className="current-rating">
                                                                    {renderStars(rout?.driver?.rating)}
                                                                </div>
                                                            </td>


                                                            <td className='text-center'>
                                                                <button
                                                                    className='btn modal-btn view-btn btn-success'
                                                                    onClick={() => {
                                                                        setSelectedRowIndex(index);
                                                                        setShowDateAndTime(true);
                                                                        setDriverId(rout?.driver?.id);
                                                                        setTo(rout?.to);
                                                                        setFrom(rout?.from);
                                                                        setMoney(rout?.money);
                                                                    }}
                                                                    disabled={selectedRowIndex === index}
                                                                >
                                                                    <i className='fa fa-check mr-2'>&nbsp;{selectedRowIndex === index ? "Selected" : "Select"}</i>
                                                                </button>
                                                            </td>

                                                        </tr>
                                                    ))}
                                                </tbody> :
                                                <tr>
                                                    <td colSpan={6} className='text-center text-secondary'>{searching ? "Searching..." : "No Driver Details!"}</td>
                                                </tr>}
                                        </table>
                                    </div>
                                </div>
                            </div>}

                            {showDateAndTime &&
                                <form action="">
                                    <div className='book-form-area'>
                                        <div className="row">
                                            <div className="col-12 col-lg-6">
                                                <div className="form-group">
                                                    <label htmlFor="" className='form-label absolute text-orange'>Pickup Location&nbsp;<span className='form-required'>*</span></label>
                                                    <input type="text" className='form-control dark-theme' placeholder='Enter your pickup location'
                                                        value={pickUpLocation}
                                                        onChange={(e) => setPickUpLocation(e.target.value)} />
                                                    {!pickUpLocation && <small className='form-required'>This field is required</small>}
                                                </div>
                                            </div>

                                            <div className="col-12 col-lg-6">
                                                <div className="form-group">
                                                    <label htmlFor="" className='form-label absolute text-orange'>Date & Time&nbsp;<span className='form-required'>*</span></label>
                                                    <div className='w-100 date-picker-custom'>
                                                        <DatePicker
                                                            className='form-control dark-theme'
                                                            placeholderText='Select Date and Time'
                                                            selected={selectedDate}
                                                            onChange={handleChange}
                                                            showTimeSelect
                                                            dateFormat="MMMM d, yyyy h:mm aa"
                                                        />
                                                    </div>
                                                    {!selectedDate && <small className='form-required'>This field is required</small>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="book-form-title">Customer Detail</div>
                                        <div className="row">
                                            {/* <div className="col-12 col-lg-4">
                                            <div className="form-group">
                                                <label htmlFor="" className='form-label absolute text-orange'>Name</label>
                                                <input type="text" className='form-control dark-theme' placeholder='Enter name' />
                                            </div>
                                        </div> */}

                                            <div className="col-12 col-lg-4">
                                                <div className="form-group">
                                                    <label htmlFor="" className='form-label absolute text-orange'>Email&nbsp;<span className='form-required'>*</span></label>
                                                    <input type="email" className='form-control dark-theme' placeholder='Enter email'
                                                        value={customerEmail}
                                                        onChange={(e) => setCustomerEmail(e.target.value)} />
                                                    {!customerEmail && <small className='form-required'>This field is required</small>}
                                                </div>
                                            </div>

                                            <div className="col-12 col-lg-4">
                                                <div className="form-group">
                                                    <label htmlFor="" className='form-label absolute text-orange'>Mobile&nbsp;<span className='form-required'>*</span></label>
                                                    <input type="number" className='form-control dark-theme' placeholder='Enter mobile no.'
                                                        value={customerPhoneNum}
                                                        onChange={(e) => setCustomerPhoneNum(e.target.value)} />
                                                    {!customerPhoneNum && <small className='form-required'>This field is required</small>}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </form>}
                        </div>

                        <div className="modal--footer">
                            <button type="button" class="btn btn-secondary modal-btn" onClick={closeBookModal}>Close</button>
                            <button type="button" class="btn btn-orange modal-btn"
                                onClick={() => handleBooking()}
                                disabled={driverRouteDetail.length === 0 || selectedDate === null || pickUpLocation === "" || customerEmail === "" || customerPhoneNum === "" || !showDateAndTime || !driverId}>Book</button>
                        </div>
                    </Modal>
                    {/*  */}


                </> :
                    <div className="dot-spinner-area">
                        <div className="dot-spinner">
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                        </div>
                    </div>
                )}

        </>

    )
}

export default Dashboard;