
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
        getUserbyid
    }

    logger.info("Initialization finished.");

}



let getUserbyid = (id, req, res)=>{
    return new Promise((resolve, reject)=>{
        models.user.findByPk(id).then(user => resolve(user)).catch(e=>reject(e));
    });
}

module.exports = { init };