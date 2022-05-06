
let services;
let logger;
let db;
let models;

let init = (app, locals)=>{
    logger = locals.logger.getLogger("userController");

    services = locals.services || {};
    models = locals.models;
    logger.info("Initialization started.");


    locals.controllers = locals.controllers || {}
    
    locals.controllers.User = {
        getUserbyid,
        getUserbyusername,
        putUsertoken
    }

    logger.info("Initialization finished.");

}


let getUserbyid = (id, req, res)=>{
    return new Promise((resolve, reject)=>{
        models.user.findByPk(id).then(user => resolve(user)).catch(e=>reject(e));
    });
}


let getUserbyusername = (id, req, res)=>{
    return new Promise((resolve, reject)=>{
        models.user.findOne({ where : {"account" : id}}).then(user => resolve(user)).catch(e=>reject(e));
    });
}

let putUsertoken = (id, token, req, res)=>{
    return new Promise((resolve, reject)=>{
        models.user.update({"token": token}, { where : {"account" : id}}).then(user => resolve(user)).catch(e=>reject(e));
    });
}

module.exports = { init };