import { Schema, model } from "mongoose";

//create the schema
const userSchema = new Schema ({
    userType: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,  
        required: true
    },
    address: {
        type: String, 
        required: true
    },
    contactNumber: {
        type: String,  
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

//create user model:
const User = model("User", userSchema);

export default User;