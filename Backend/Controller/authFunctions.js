const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require ('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const moment = require('moment');
const registerUser = require("../dataBase/registerUser");
const customer = require("../dataBase/customer");
const driver = require("../dataBase/driver");
const operator = require("../dataBase/operator");
const fromToMoney = require("../dataBase/fromToMoney");
const bookingDetail = require("../dataBase/bookingDetail");
const contactUs = require("../dataBase/contactUs");
const bookingDetailByOperator = require("../dataBase/bookingDetailByOperator"); 

/* create User */
// const createCustomer = async (req, res) => {
    
//     try {
//         const { email, role, phoneNum } = req.body;
//         const userExiest = await registerUser.findOne({ $or: [{ email },  {phoneNum}] })
//         if(userExiest){
//             return res.status(400).json({error:"User Already exiest with this email"});
//         }
//         // Generate a random username
//         const generateRandomUsername = () => {
//             const charsetForUsername = '1234567890';
//             let userNameNum = '';
//             for (let i = 0; i < 3; i++) {
//                 const randomIndex = Math.floor(Math.random() * charsetForUsername.length);
//                 userNameNum += charsetForUsername[randomIndex];
//             }
//             const userNameFront = email.split('@')[0];
//             return userNameFront + userNameNum;
//         };

//         // Generate a random password
//         const generateRandomPassword = () => {
//             const charsetForPassword = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//             let password = '';
//             for (let i = 0; i < 10; i++) { // Increase password length to 10 characters
//                 const randomIndex = Math.floor(Math.random() * charsetForPassword.length);
//                 password += charsetForPassword[randomIndex];
//             }
//             return password;
//         };

//         const userName = generateRandomUsername();
//         const password = generateRandomPassword();

//         const customerId = uuidv4();

//         const newUser = new registerUser({ // Assuming Customer is the mongoose model
//             id: customerId,
//             userName,
//             email,
//             password,
//             phoneNum,
//             role,
//          });
    
//         await newCustomer.save();

//         if(role === "Driver"){
//             const newDriverForHisSchema = new driver({ 
//                 id: customerId,
//                 userName,
//                 email,
//                 phoneNum,
//                 role,
//                 availability:false,
//                 rating:0
//              });
        
//             await newDriverForHisSchema.save();
//         }else if(role === "Customer"){
//             const newCustomerForHisSchema = new customer({ 
//                 id: customerId,
//                 userName,
//                 email,
//                 phoneNum,
//                 role,
//              });

//              await newCustomerForHisSchema.save();
//         }else if(role === "Operator"){
//             const newOperatorForHisSchema = new operator({ 
//                 id: customerId,
//                 userName,
//                 email,
//                 phoneNum,
//                 role,
//              });

//              await newOperatorForHisSchema.save();
//         }
       
//         // Send email to the customer with their username and password
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'demoemail1322@gmail.com',
//                 pass: 'znsdgrmwzskpatwz'
//             }
//         });

//         const mailOptions = {
//             from: 'demoemail1322@gmail.com',
//             to: email,
//             subject: 'Welcome to Our Service',
//             html: `
//             <p>Hello,</p>
//             <p>Welcome to our service! Below are your login details:</p>
//             <p>Username: ${userName}</p>
//             <p>Password: ${password}</p>
//             <p>Please keep this information secure.</p>
//             <p>Thank You!</p>
//             `
//         };

//         transporter.sendMail(mailOptions, function (error, info) {
//             if (error) {
//                 console.error('Email sending error:', error);
//                 return res.status(500).json({ error: 'Failed to send email', newUser:newCustomer });
//             } else {
//                 console.log('Email sent:', info.response);
//                 res.status(201).json({ newUser:newCustomer, emailSent: true });
//             }
//         });
//     } catch (err) {
//         console.error('Error creating customer:', err);
//         return res.status(500).json({ error: 'Failed to create customer', err });
//     }
// };

const createCustomer = async (req, res) => {
    try {
        const { email, role, phoneNum } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email) || phoneNum === 0){
           return res.status(500).json({error:"enter valid email and phn num"});
        }
        const userExists = await registerUser.findOne({ $or: [{ email }, { phoneNum }] });
        
        if (userExists) {
           return  res.status(404).json({error:"User already exists with this email or phone number"});
        }

        // Generate a random username
        const generateRandomUsername = () => {
            const charsetForUsername = '1234567890';
            let userNameNum = '';
            for (let i = 0; i < 3; i++) {
                const randomIndex = Math.floor(Math.random() * charsetForUsername.length);
                userNameNum += charsetForUsername[randomIndex];
            }
            const userNameFront = email.split('@')[0];
            const uniqueIdentifier = Date.now().toString(36); // Unique timestamp-based identifier
            return userNameFront + userNameNum + uniqueIdentifier;
        };
        

        // Generate a random password
        const generateRandomPassword = () => {
            const charsetForPassword = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let password = '';
            for (let i = 0; i < 10; i++) { // Increase password length to 10 characters
                const randomIndex = Math.floor(Math.random() * charsetForPassword.length);
                password += charsetForPassword[randomIndex];
            }
            return password;
        };

        // Generate username, password, and customerId
        const userName = generateRandomUsername();
        const password = generateRandomPassword();
        const customerId = uuidv4();

        // Create new user document
        const newUser = new registerUser({
            id: customerId,
            userName,
            email,
            password,
            phoneNum,
            role,
        });

        await newUser.save();

        // Handle role-specific schema creation
        let newSchema;
        if (role === "Driver") {
            newSchema = new driver({
                id: customerId,
                userName,
                email,
                phoneNum,
                role,
                availability: false,
                rating: 0
            });
        } else if (role === "Customer") {
            newSchema = new customer({
                id: customerId,
                userName,
                email,
                phoneNum,
                role,
            });
        } else if (role === "Operator") {
            newSchema = new operator({
                id: customerId,
                userName,
                email,
                phoneNum,
                role,
            });
        }

        if (newSchema) {
            await newSchema.save();
        }

        // Send email to the customer with their username and password
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'demoemail1322@gmail.com',
                pass: 'znsdgrmwzskpatwz'
            }
        });

        const mailOptions = {
            from: 'demoemail1322@gmail.com',
            to: email,
            subject: 'Welcome to Our Service',
            html: `
            <p>Hello,</p>
            <p>Welcome to our service! Below are your login details:</p>
            <p>Username: ${userName}</p>
            <p>Password: ${password}</p>
            <p>Please keep this information secure.</p>
            <p>Thank You!</p>
            `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Email sending error:', error);
                res.status(500).json({error:'Failed to send email'});
            } else {
                console.log('Email sent:', info.response);
                res.status(201).json({ newUser: newUser, emailSent: true });
            }
        });
    } catch (err) {
        console.error('Error creating customer:', err);
        return res.status(500).json({ error: err.message });
    }
};


/* user login */
const userLogin = async (req, role, res) => {
    try {
        // Destructure username and password from request body
        const { userName, password } = req;

        if (!userName || !password) {
            return res.status(400).json({
                message: "Invalid input. Please provide both username and password.",
            });
        }

        // Check if username or password is missing
        if (!userName || !password) {
            return res.status(400).json({
                message: "Invalid input. Please provide both username and password.",
            });
        }

        // Find user by username
        const user = await registerUser.findOne({ userName });

        // If user not found, return 404
        if (!user) {
            return res.status(404).json({
                message: "User not found. Please register to log in.",
            });
        }

        // Check if the provided role matches user's role
        if (!role.includes(user.role)) {
            return res.status(403).json({
                message: "Unauthorized access. Please log in correct portal.",
            });
        }

        // Check if password matches
        const isPasswordMatch = await registerUser.findOne({password: user.password});

        if (isPasswordMatch) {
            let payload = {
                id: user.id,
                role: user.role,
                userName: user.userName,
                email:user.email,
                phoneNum:user.phoneNum
              };
        
              let result = {
                id: user.id,
                role: user.role,
                userName: user.userName,
                email:user.email,
                phoneNum:user.phoneNum,
                expiresIn: 168
              };
        
              let token = jwt.sign(
                payload,
                process.env.APP_SECRET,
                { expiresIn: "3 days" }
              );

              return res
                .cookie('jwt', token, {
                  httpOnly: true,
                })
                .status(200)
                .json({
                  ...result,
                  accessToken: token,
                  message: "You are now logged in."
                });
        } else {
            return res.status(403).json({
                message: "Incorrect password.",
            });
        }
    } catch (err) {
        // Handle server errors
        res.status(500).json({ error: err.message });
    }
};

/* finding the all users */
const findAllUsersForAdmin = async (req, res) => {
    try {
        // Fetch all users from different collections concurrently using Promise.all()
        const [allDriver, allCustomer, allOperator] = await Promise.all([
            driver.find(),
            customer.find(),
            operator.find()
        ]);

        // Check if any users are found in any of the collections
        if (allDriver.length>0 || allCustomer.length>0 || allOperator.length>0) {
            // Concatenate all users into a single array
            const allUsers = {
                allCustomer:allCustomer,
                allDriver:allDriver,
                allOperator:allOperator
            };
            // Return the concatenated array as JSON response
            return res.status(200).json(allUsers);
        } else {
            // If no users are found in any collection, return a 404 error
            return res.status(404).json({ error: "No users found!" });
        }
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: err.message });
    }
};

/* adding from to route money */
const fromToRouteMoneyAdd = async(req, res) => {
    try{
        let {from, to, money, driverId} = req.body;
        from = from.toLowerCase()
        to = to.toLowerCase()
        const alreadyCreated = await fromToMoney.findOne({from:from, to:to, money:money, driverId:driverId});
        if(alreadyCreated){
            return res.status(400).json({error:"Already this route there for this driverId"});
        }

        const newFromToMoney = new fromToMoney({ 
           ...req.body
         });
    
        await newFromToMoney.save();
        return res.status(201).json(newFromToMoney);

    }catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: err.message });
    }
}

/*find all the drivers by admin or operator */
const findAllDrivers= async (req, res) => {
    try {
        // Fetch all users from different collections concurrently using Promise.all()
        const [allDriver] = await Promise.all([
            driver.find()
        ]);

        // Check if any users are found in any of the collections
        if (allDriver.length>0) {
            
            return res.status(200).json(allDriver);
        } else {
            // If no users are found in any collection, return a 404 error
            return res.status(404).json({ error: "No users found!" });
        }
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: err.message });
    }
};

/* get route detail by customer */
const routeDetail = async (req, res) => {
    try {
        let { from, to } = req.params;
        from = from.toLowerCase();  // Convert to lowercase
        to = to.toLowerCase();  // Convert to lowercase
        const correspondingFromToDetail = await fromToMoney.find({ from, to });

        if (correspondingFromToDetail.length === 0) {
            return res.status(404).json("No data found for the route!");
        }

        const updatedRouteDetail = await Promise.all(correspondingFromToDetail.map(async (routeDetails) => {
            try {
                const correspondingDriverDetail = await driver.findOne({ id: routeDetails.driverId, availability: true });

                if (!correspondingDriverDetail) {
                    return null; // Return null if no driver found for the route
                }

                return {
                    from: routeDetails.from,
                    to: routeDetails.to,
                    money: routeDetails.money,
                    driver: correspondingDriverDetail.toObject() // Convert to plain JavaScript object
                };
            } catch (error) {
                throw new Error(`Error fetching driver details: ${error.message}`);
            }
        }));

        // Filter out null values before sending response
        const filteredRouteDetail = updatedRouteDetail.filter(detail => detail !== null);
        
        res.status(200).json(filteredRouteDetail); // Send response once
    } catch (err) {
        console.error("Error in routeDetail:", err);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
};

/* get all from route */
const getAllCreatedFrom = async (req, res) => {
    try {
        const allFromToDetail = await fromToMoney.find();
        if (allFromToDetail.length === 0) {
            return res.status(404).json({ error: "No data" });
        }
        
        // Convert all 'from' locations to lowercase
        const allFromDatas = allFromToDetail.map(fromTo => fromTo.from.toLowerCase());
        
        // Filter out duplicates
        const uniqueFromDatas = Array.from(new Set(allFromDatas));
        
        res.status(200).json(uniqueFromDatas);
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: err.message });
    }
};

/* get all to route */
const getAllCreatedTo = async (req, res) => {
    try {
        const allFromToDetail = await fromToMoney.find();
        if (allFromToDetail.length === 0) {
            return res.status(404).json({ error: "No data" });
        }
        
        const allToDatas = allFromToDetail.map(fromTo => fromTo.to.toLowerCase());
        const uniqueToDatas = [...new Set(allToDatas)]; // Convert to Set to remove duplicates
        
        res.status(200).json(uniqueToDatas);
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: err.message });
    }
};

const findAlreadyBooking = async(req, res) => {
    try{
        let {from, to, driverId, customerId} = req.body;
        from = from.toLowerCase()
        to = to.toLowerCase()
        const bookingFound = await bookingDetail.findOne({from, to, driverId, customerId, status:"Pending"});
        console.log(bookingFound)
        if(bookingFound){
            res.status(200).json({message:"Already Booked"})
        }else{
            res.status(200).json({message:"Not Booked"})
        }
    }catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: err.message });
    }
}

/* create booking detail */
const createBooking = async (req, res) => {
    try {
        const bookingId = uuidv4();
        // const bookingTime = moment().format('hh:mmA'); // Format time as "10:15PM"
        // const bookingDate = moment().format('DD/MM/YYYY'); // Format date as "dd/mm/yyyy"
        let { driverId, customerId, from, to, money, pickUpLocation, time, date} = req.body;
        from = from.toLowerCase()
        to = to.toLowerCase()
        const alreadyBookedWithStatusPending = await bookingDetail.findOne({from, to, driverId, customerId, status:"Pending"})
        if(alreadyBookedWithStatusPending){
            return res.status(500).json({error:"You have already booked this driver, and the trip is not finished yet."})
        }
        const newBookingDetail = new bookingDetail({
            id:bookingId,
            driverId,
            time,
            date,
            customerId,
            from,
            to,
            money,
            status:"Pending",
            pickUpLocation
        });

        await newBookingDetail.save();
        return res.status(201).json(newBookingDetail);
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: err.message });
    }
}

/* create booking detail by operator*/
const createBookingByOperatorForCustomer = async (req, res) => {
    try {
        const bookingId = uuidv4();
        const customerId = `Cus_${bookingId}`
        // const bookingTime = moment().format('hh:mmA'); // Format time as "10:15PM"
        // const bookingDate = moment().format('DD/MM/YYYY'); // Format date as "dd/mm/yyyy"
        let { driverId, operatorId, from, to, money, pickUpLocation, time, date, customerEmail, customerPhoneNum} = req.body;

        from = from.toLowerCase()
        to = to.toLowerCase()
        const alreadyBookedWithStatusPending = await bookingDetailByOperator.findOne({from, to, driverId, customerEmail, status:"Pending"})
        if(alreadyBookedWithStatusPending){
            return res.status(500).json({error:"You have already booked this driver, and the trip is not finished yet."})
        }

        const alrdyExiestCustomer = await customer.findOne({email:customerEmail});
        if(!alrdyExiestCustomer){
            const newOperatorCustomer = new customer({
                id:customerId,
                userName:`${customerId}_Created By Operator`,
                email:customerEmail,
                phoneNum:customerPhoneNum,
                role:"Customer"
            })
    
            await newOperatorCustomer.save();
        }

        const newBookingDetailByOperator = new bookingDetailByOperator({
            id:bookingId,
            driverId,
            time,
            date,
            operatorId,
            customerId:alrdyExiestCustomer ? alrdyExiestCustomer.id : customerId,
            customerEmail,
            from,
            to,
            money,
            status:"Pending",
            pickUpLocation
        });

        await newBookingDetailByOperator.save();

        const newBookingDetail = new bookingDetail({
            id:bookingId,
            driverId,
            time,
            date,
            customerId:alrdyExiestCustomer ? alrdyExiestCustomer.id : customerId,
            from,
            to,
            money,
            status:"Pending",
            pickUpLocation
        });

        await newBookingDetail.save();

        return res.status(201).json({message:"Booked Successful, Notificatio sent to driver"});
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: err.message });
    }
}

/* get all bookings for driver */
const getAllBookings = async (req, res) => {
    try {
        const { driverId } = req.params;
        const allBookingsForYou = await bookingDetail.find({ driverId });
        
        if (allBookingsForYou.length === 0) {
            return res.status(404).json({ error: "No booking for you!" });
        }
        
        const updatedBookingDetail = await Promise.all(
            allBookingsForYou.map(async booking => {
                const correspondingCustomer = await customer.findOne({ id: booking.customerId });
                return {
                    bookingDetails:booking.toObject(),
                    customerDetatls:correspondingCustomer.toObject()
                };
            })
        );
        
        res.status(200).json(updatedBookingDetail);
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: err.message });
    }
};

/* get all bookings of operator */
const getAllBookingsOfOperator = async (req, res) => {
    try {
        const { operatorId } = req.params;
        const allBookingsForYou = await bookingDetailByOperator.find({ operatorId });
        
        if (allBookingsForYou.length === 0) {
            return res.status(404).json({ error: "No booking for you!" });
        }
        
        const updatedBookingDetail = await Promise.all(
            allBookingsForYou.map(async booking => {
                const correspondingCustomer = await customer.findOne({ id: booking.customerId });
                const correspondingDriver = await driver.findOne({ id: booking.driverId });
                return {
                    bookingDetails:booking.toObject(),
                    customerDetatls:(correspondingCustomer && correspondingCustomer.toObject()),
                    driverDetails:(correspondingDriver && correspondingDriver.toObject())
                };
            })
        );
        
        res.status(200).json(updatedBookingDetail);
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: err.message });
    }
};

/* confirm the booking */
const confirmBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const findTheBooking = await bookingDetail.findOne({ id: bookingId });
        
        if (!findTheBooking) {
            return res.status(404).json({ error: "Booking not found!" });
        }
        
        if (findTheBooking.status === "Completed") {
            return res.status(400).json({ error: "This Booking is already completed!" });
        }

        if (findTheBooking.status === "Rejected") {
            return res.status(400).json({ error: "This Booking is already rejected!" });
        }

        const findTheOperatorBooking = await bookingDetailByOperator.findOne({ id: bookingId });

        if(findTheOperatorBooking){
            // Update booking status to Completed
            await bookingDetailByOperator.findOneAndUpdate(
                { id: bookingId },
                { $set: { status: "Completed" } },
                { new: true }
            );
        }
        
        // Update booking status to Completed
        const updatedBooking = await bookingDetail.findOneAndUpdate(
            { id: bookingId },
            { $set: { status: "Completed" } },
            { new: true }
        );

        const bookingCustomerDetail = await customer.findOne({ id: findTheBooking.customerId });
        
        // Send email to the customer with confirmation
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'demoemail1322@gmail.com',
                pass: 'znsdgrmwzskpatwz'
            }
        });

        const mailOptions = {
            from: 'demoemail1322@gmail.com',
            to: bookingCustomerDetail.email,
            subject: 'Your Booking Confirmed!',
            html: `
            <p>Your Booking has been confirmed!</p>
            <p>Booking ID: ${updatedBooking.id}</p>
            <p>Use the link to pay: https://stripe.com/</p>
            `
        };

        await transporter.sendMail(mailOptions);
        
        // Respond with updated document
        return res.status(200).json({ message: "Booking confirmed successfully!", updatedBooking });
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: err.message });
    }
};

/* reject the booking */
const rejectBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const findTheBooking = await bookingDetail.findOne({ id: bookingId });
        
        if (!findTheBooking) {
            return res.status(404).json({ error: "Booking not found!" });
        }
        
        if (findTheBooking.status === "Completed") {
            return res.status(400).json({ error: "This Booking is already completed!" });
        }

        if (findTheBooking.status === "Rejected") {
            return res.status(400).json({ error: "This Booking is already rejected!" });
        }

        const findTheOperatorBooking = await bookingDetailByOperator.findOne({ id: bookingId });

        if(findTheOperatorBooking){
            // Update booking status to Completed
            await bookingDetailByOperator.findOneAndUpdate(
                { id: bookingId },
                { $set: { status: "Rejected" } },
                { new: true }
            );
        }
        
        // Update booking status to Completed
        const updatedBooking = await bookingDetail.findOneAndUpdate(
            { id: bookingId },
            { $set: { status: "Rejected" } },
            { new: true }
        );

        const bookingCustomerDetail = await customer.findOne({ id: findTheBooking.customerId });
        
        // Send email to the customer with confirmation
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'demoemail1322@gmail.com',
                pass: 'znsdgrmwzskpatwz'
            }
        });

        const mailOptions = {
            from: 'demoemail1322@gmail.com',
            to: bookingCustomerDetail.email,
            subject: 'Sorry, Your Booking Rejected!',
            html: `
            <p>Sorry, Your Booking has been rejected!</p>
            <p>Booking ID: ${updatedBooking.id}</p>
            <p>Status: ${updatedBooking.status}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        
        // Respond with updated document
        return res.status(200).json({ message: "Booking Rejected!", updatedBooking });
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: err.message });
    }
};

/* get al booking of customers */
const getAllBookingsCustomer = async (req, res) => {
    try{
        const {customerId} = req.params;
        const allBookingsForYou = await bookingDetail.find({customerId});
        if(allBookingsForYou.length===0){
            return res.status(404).json({error:"No booking for you!"})
        }

        const updatedBookingDetail = await Promise.all(
            allBookingsForYou.map(async booking => {
                const correspondingDriver = await driver.findOne({ id: booking.driverId });
                return {
                    bookingDetails:booking.toObject(),
                    driverDetails:correspondingDriver.toObject()
                };
            })
        );

        res.status(200).json(updatedBookingDetail)
    }catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: err.message });
    }
}

/* rate the driver */
const giveRating = async (req, res) => {
    try {
        const { driverId, ratingNum } = req.body;

        // Assuming you've properly imported the `driver` model
        const updatedDriver = await driver.findOneAndUpdate(
            { id: driverId },
            { $set: { rating: ratingNum } },
            { new: true } // This ensures the updated document is returned
        );

        if (!updatedDriver) {
            return res.status(404).json({ error: "Driver not found!" });
        }

        return res.status(200).json({ message: "Rating Updated", driver: updatedDriver });
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: err.message });
    }
};

/* change the availability of driver */
const changingAvailability = async (req, res) => {
    try {
        const { driverId } = req.body;
        const correspondingDriver = await driver.findOne({ id: driverId });

        if (!correspondingDriver) {
            return res.status(404).json({ error: "Driver detail not found!" });
        }

        // Assuming you've properly imported the `driver` model

        // Toggle the availability boolean value
        const updatedAvailability = !correspondingDriver.availability;

        const changedAvailability = await driver.findOneAndUpdate(
            { id: driverId },
            { $set: { availability: updatedAvailability } },
            { new: true } // This ensures the updated document is returned
        );

        return res.status(201).json({ message: "Availability Updated", changedAvailability });
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: err.message });
    }
};

/* get all bookings  */
const getAllBookingsForAdmin = async (req, res) => {
    try {
        // const { driverId } = req.params;
        const allBookingsForYou = await bookingDetail.find();
        
        if (allBookingsForYou.length === 0) {
            return res.status(404).json({ error: "No booking for you!" });
        }
        
        const updatedBookingDetail = await Promise.all(
            allBookingsForYou.map(async booking => {
                const correspondingCustomer = await customer.findOne({ id: booking.customerId });
                const correspondingDriver = await driver.findOne({ id: booking.driverId });
                return {
                    bookingDetails:booking.toObject(),
                    customerDetatls:(correspondingCustomer && correspondingCustomer.toObject()),
                    driverDetails:(correspondingDriver && correspondingDriver.toObject())
                };
            })
        );
        
        res.status(200).json(updatedBookingDetail);
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: err.message });
    }
};

/* get all from route */
const getAllRoutesForDriver = async (req, res) => {
    try {
        const {driverId} = req.params;
        const allRoutesForDriver = await fromToMoney.find({driverId});
        if (allRoutesForDriver.length === 0) {
            return res.status(404).json({ error: "No data" });
        }
        
        res.status(200).json(allRoutesForDriver);
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: err.message });
    }
};

/* edit route detail */
const editRoute = async (req, res) => {
    try {
        const {id} = req.params;
        const routeToBeEdited = await fromToMoney.findById(id);
        if(!routeToBeEdited){
            return res.status(404).json({error:"Route detail not found!"})
        }
        const updatedRouteDetail = await fromToMoney.findByIdAndUpdate(
            { _id:id },
            {
              $set: {
                from:req.body.from.toLowerCase(),
                to:req.body.to.toLowerCase(),
                money:req.body.money,
              },
            },
            { new: true }
          );
          return res.status(200).json({ updatedRouteDetail });
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: err.message });
    }
};

/* delete route detail */
const deleteRoute = async (req, res) => {
    try{
        const {id} = req.params;
        const routeToBeDeleted = await fromToMoney.findById(id);
    
        if (!routeToBeDeleted) {
          return res.status(404).json({ error: 'Route detail not found!' });
        }
    
        const deletedRouteDetail = await fromToMoney.deleteOne({_id:id});
    
        if (deletedRouteDetail.deletedCount === 1) {
          return res.status(204).json({ message: 'Route detail deleted successfully' });
        } else {
          return res.status(500).json({ error: 'Failed to delete' });
        } 
        
      }catch(err) {
        res.status(500).json({error: err.message})
      }
};

/* contact us form data create */
const contactUsCreate = async (req, res) => {
    try {
        // Extracting necessary data from request body
        const { name, email, msg } = req.body;

        // Creating a new document instance
        const newContact = new contactUs({
            name,
            email,
            msg
        });

        // Saving the new document to the database
        const savedContact = await newContact.save();

        // Sending success response
        res.status(201).json(savedContact);
    } catch (err) {
        // Sending error response
        res.status(500).json({ error: err.message });
    }
};

/* find the all contact us documents*/
const getAllContactUsDocuments = async (req, res) => {
    try {
        // Fetching all documents from the contactUs collection
        const allContactUsDocuments = await contactUs.find();

        // Sending success response with the retrieved documents
        res.status(200).json(allContactUsDocuments);
    } catch (err) {
        // Sending error response if any error occurs
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createCustomer,
    userLogin,
    findAllUsersForAdmin,
    fromToRouteMoneyAdd,
    findAllDrivers,
    routeDetail,
    getAllCreatedFrom,
    getAllCreatedTo,
    findAlreadyBooking,
    createBooking,
    createBookingByOperatorForCustomer,
    getAllBookings,
    getAllBookingsOfOperator,
    confirmBooking,
    rejectBooking,
    getAllBookingsCustomer,
    giveRating,
    changingAvailability,
    getAllBookingsForAdmin,
    getAllRoutesForDriver,
    editRoute,
    deleteRoute,
    contactUsCreate,
    getAllContactUsDocuments,
}