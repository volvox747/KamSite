//^ Importing Custom Error class 
const ExpressError = require('../utils/ExpressError');


const errorHandlingFunction=function catchAsync(asyncFunction){
    //^ async errors shld be handled by inserting new ExpressError into next() middleware 
    //^ which calls the general error handling middleware 
    return (req,res,next)=>{asyncFunction(req,res,next).catch(next(new ExpressError()))};
}

module.exports=errorHandlingFunction;

