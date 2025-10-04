import User from "../modules/user.js";
import bcrypt from "bcrypt"; 
import jwd from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import e from "express";
dotenv.config();

// This function saves a new user to the database
export function saveUser(req, res) {
    if (req.body.role == "admin") {
        if (req.user == null) {
            return res.status(403).json({
                message: "Please login as an admin to create a new admin user"
            });
            return;
        }
        if (req.user.role != "admin") {
            return res.status(403).json({
                message: "You are not authorized to create a new admin user"
            });
            return;
        }
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user =new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword,
        role: req.body.role || "user", // Default role is 'user'
        phoneNumber: req.body.phoneNumber || "Not given", // Default phoneNumber to "Not given"
        isDisable: req.body.isDisable || false, // Default isDisable to false
        isEmailVerified: req.body.isEmailVerified || false // Default isEmailVerified to false
    })


    user.save().then(()=> {
        res.json({
            message: "User created successfully"
        })
    }).catch((err) => {
        console.error("Error creating user:", err);
        res.status(500).json({
            message: "Error creating user",
            error: err.message
        });
    })
}

// This function logs in a user by checking their email and password
export function loginUser(req, res){
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email : email
    }).then((user) => {
        if (user == null) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        else {
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (isPasswordValid) {
                // Generate a JWT token
                const userData ={
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    phoneNumber: user.phoneNumber,
                    isDisable: user.isDisable,
                    isEmailVerified: user.isEmailVerified
                }
                const token = jwd.sign(userData,process.env.JWT_KEY,{
                    expiresIn: "48hrs" // Token
                })
                res.json({
                    message: "Login successfully",
                    token: token,
                    user: userData
                })

            } else {
                res.status(401).json({
                    message: "Invalid password"
                });
            }
        }
    })
}

export async function googleLogin(req, res) {
    const accessToken = req.body.accessToken;
    try {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log(response);
        const user = await User.findOne({ email: response.data.email });
        if (user == null) {
            const newUser = new User({
                email: response.data.email,
                firstName: response.data.given_name,
                lastName: response.data.family_name,
                password: accessToken,
                isEmailVerified : true
            });
            await newUser.save();
            
            const userData = {
                email: response.data.email,
                firstName: response.data.given_name,
                lastName: response.data.family_name,
                role: "user",
                phoneNumber: "Not given",
                isDisable: false,
                isEmailVerified: true
            }

            const token = jwd.sign(userData,process.env.JWT_KEY,{
                expiresIn: "48hrs" // Token
            })
            res.json({
                message: "Login successfully",
                token: token,
                user: userData
            })
        }
        else {
            const userData = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                phoneNumber: user.phoneNumber,
                isDisable: user.isDisable,
                isEmailVerified: user.isEmailVerified
            }

            const token = jwd.sign(userData,process.env.JWT_KEY,{
                expiresIn: "48hrs" // Token
            })
            res.json({
                message: "Login successfully",
                token: token,
                user: userData
            })
        }
    }
    catch (error) {
        console.error("Error during Google login:", error);
        res.status(500).json({
            message: "Error during Google login",
            error: error.message
        });
    }
}

export function getCurrentUser(req, res) {
    if (req.user == null) {
        res.status(403).json({
            message: "You need to login first"
        });
        return;
    }
    res.json({
        user: req.user});
}   