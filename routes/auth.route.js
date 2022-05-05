var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');
let publicPaths = require('../config/public.paths');
let config = require(`../config/${process.env.NODE_ENV || 'development'}.config.js`);

router.post('/login', async (req, res)=>{
   let loginData = await req.app.locals.controllers.Auth.login(req, res);

   if(loginData){
        return req.app.locals.mainController.apiResponder(res, 200, loginData);
   }

   return req.app.locals.mainController.apiResponder(res, 401, {});
});

router.get('/me', async (req, res, next) => {
    if(
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]
    ){
        return res.status(422).json({
            message: "Please provide the token",
        });
    }
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, config.JWT_SECRET);
    const account = decoded.account;
    let loginme = await req.app.locals.controllers.Auth.loginme(account, req, res);

    console.log(account);

});

router.post('/signup', async (req, res)=>{
    mainController = req.app.locals.mainController;
    let data = req.body;

    let userInfo = await req.app.locals.controllers.Auth.signup(data, req, res).catch((e)=>{
        return mainController.returnError(res, 500, 0);
    });

    res.status(200).json(userInfo);
});


module.exports = router;
