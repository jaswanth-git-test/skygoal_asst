const mongoose = require('mongoose');

const bcrypt = require('bcrypt')
const jwtToken = require('jsonwebtoken')

require('dotenv').config();

const User = require('./user')

mongoose.connect(process.env.DB_URL,
{
    useUnifiedTopology: true,
    useNewUrlParser:true
}
).then(()=>console.log('connected db')).catch(()=>console.log('connection failed'))

const createUser = async(req,res,next)=>{
    
    const {username,password} = req.body

    const getUsersByName = await User.findOne({username}).exec()
    console.log(getUsersByName,'user details')
    const encryptedPassword = await bcrypt.hash(password,10)


    const newUser =  new User({
        username:username,
        password: encryptedPassword
    })
     
    if(!getUsersByName){
       const result = await newUser.save();
       console.log(result)
        
    }

    const resultString = getUsersByName?'username already exits': 'user created successfully';
    const resCode = getUsersByName?400:200
     
    res.status(resCode)
    res.send(resultString)


}

const authenticateUser = async(req,res,next)=>{
     
    const {username,password} = req.body;

    const userDetails = await User.findOne({username}).exec() 

    if(!userDetails){
        res.status(400).send('user does not exits')
    }
    else{
        const isPasswordValid = await bcrypt.compare(password,userDetails.password)
        if(isPasswordValid){
            const token =  jwtToken.sign({username},'Dark_knight')

            
            res.send(token)
          
        }
        else{
            res.status(400).send('password not matched');
        
        }
    }


}


exports.createUser = createUser;
exports.authenticateUser = authenticateUser;