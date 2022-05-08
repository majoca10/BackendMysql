var express = require('express');
var router = express.Router();
var randtoken = require('rand-token');
var nodemailer = require('nodemailer');
var email = require('../config/email');


router.get('/user/:id', async (req, res)=>{
    mainController = req.app.locals.mainController;
    let id = req.params.id;
    let usuarios = await req.app.locals.controllers.User.getUserbyid(id, req, res).catch((e)=>{
        return mainController.returnError(res, 500, 0);
    });

    res.status(200).json(usuarios);
});

router.post('/forgot-password', async (req, res)=>{
    mainController = req.app.locals.mainController;
    let id = req.body.username;
    let usuario = await req.app.locals.controllers.User.getUserbyusername(id, req, res).catch((e)=>{

        return mainController.returnError(res, 500, 0);
    });

    if(usuario != null){
        var token = randtoken.generate(20);
        let updatetoken =  req.app.locals.controllers.User.putUsertoken(id, token, req. res).catch((e)=>{

            return mainController.returnError(res, 500, 0);
        });
        var mail = email.sendEmail(usuario.email, token);

        if (mail != '0') {
 
            var data = {
                token: token
            }

    }

    res.status(200).json("email_send");

    }else {
        res.status(200).json("user_no_exist");
    }

   
});

router.post('/update-password', async (req, res)=>{
    mainController = req.app.locals.mainController;
    let password = req.body.password;
    let code = req.body.code;

    let usertoken = await req.app.locals.controllers.User.getUsertoken(code, password, req, res).catch((e)=>{

        return mainController.returnError(res, 500, 0);
    });

    if(usertoken != null){
      let username = usertoken.account
        let updatepass = await req.app.locals.controllers.User.putUserpass(password, username, req, res).catch((e)=>{

            return mainController.returnError(res, 500, 0);
        });

    }


    res.status(200).json("updatepass");


   
});


module.exports = router;
