const isLoggedIn = (req,res,next) =>{
    if(req.isAuthenticated()){
        next();
    }else{
    res.redirect('/users/login');
    }
}

module.exports = isLoggedIn;