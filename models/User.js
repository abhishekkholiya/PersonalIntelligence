const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    userUID:{type:String},
    username:{type:String,required:false},
    avatar:{type:String,required:false},
    email:{type:String},
    user_number:{type:Number,default:0},
    latitude:{type:String},
    longtitude:{type:String},
    date_of_birth:{type:String},
    gender:{type:String},
    theme:{type:Object,default:null},
    banner:{type:String,default:''},
    primaryColor:{type:String,default:""},
    secondaryColor:{type:String,default:""},
    subColor:{type:String,default:""},
    signup_method:{type:String},
    account_type:{type:String,default:'public'},
    location:{type:String,default:''},
    clubs:{type:Array},
    spotify_access:{type:String,default:" "}
},{timestamps:true});
mongoose.models = {};
export default mongoose.model("UserData",UserSchema);