var express = require('express');
var router = express.Router();


router.get('/user/:id', async (req, res)=>{
    mainController = req.app.locals.mainController;
    let id = req.params.id;
    let usuarios = await req.app.locals.controllers.User.getUserbyid(id, req, res).catch((e)=>{
        return mainController.returnError(res, 500, 0);
    });

    res.status(200).json(usuarios);
});


module.exports = router;
