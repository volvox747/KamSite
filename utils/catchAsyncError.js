const ExpressError = require('ExpressError');


const errorHandlingFunction=function catchAsync(asyncFunction){
    return (req,res,next)=>{asyncFunction(req,res,next).catch(next(new ExpressError('Something Went Wrong',404)))};
}

module.exports=errorHandlingFunction;

