const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    industryType:{
        type:String,
        required: true,
        min: 3,
        max: 20
    },
    name:{
        type:String,
        required: true,
        trim: true,
        min: 3,
        max: 20
    },
    contactPerson:{
        type:String,
        required: true,
        trim: true,
    },
    responsibilities:{
        type:String,
        required: true,
        trim: true,
    },
    organization:{
        type:String,
        required: true,
        trim: true,
    },
    webLink:{
        type:String,
        trim: true,
    },
    mobile:{
        type: Number,
        required: true,
        unique: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    benefits:{
        type: String,
        required: true,
        trim: true,
    },
    country:{
        type: String,
        required: true,
        trim: true,
    },
    location:{
        type: String,
        required: true,
        trim: true,
    },
    city:{
        type: String,
        required: true,
        trim: true,
    },
    username:{
        type: String,
        required: true,
        unique: true,
        index: true,
        // lowercase: true,
        trim: true,
    },
    hash_password:{
        type: String,
        required: true,
    },
    type:{
        type: String,
        enum:['employer','employee'],
        default: 'employer'
    },
    profileimg:{ type: String}
},{ timestamps: true});

userSchema.pre("save", async function (next) {
    if (!this.isModified("hash_password")) return next();
    this.hash_password = await bcrypt.hash(this.hash_password, 10);
    next();
  });
userSchema.methods = {
    authenticate: async function(password){
        return await bcrypt.compare(password, this.hash_password)
    },
    getJWTToken: function(){
        return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        })
    }
};

module.exports = mongoose.model('EmployerDetails', userSchema);