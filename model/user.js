const mongoose = require('mongoose');
const {Schema}=mongoose;

//^ Passport-local-mongoose is a mongoose plugin used to simplify the work of building username and password 
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema=new Schema({
    //` Added email coz' in case of password reset we can send msg through email 
    email:{
        type:String,
        required:true,
        unique:true
    }
})

/*********************************************************************************************************
 *^ Building username and password with in-built verification using passprt-local-mongoose            *
 *^ This pulgin checks whether the username is unique and stores                                      *
 *^ It also hashes the password and adds a salt value to it to make encrypted even furthr and stores. *
 *********************************************************************************************************/

 userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',userSchema);