
let services;
let logger;
let db;
let models;
let { QueryTypes } = require('sequelize');
let config = require(`../config/${process.env.NODE_ENV || 'development'}.config.js`);

let init = (app, locals)=>{
    logger = locals.logger.getLogger("userController");

    services = locals.services || {};
    models = locals.models;
    logger.info("Initialization started.");


    locals.controllers = locals.controllers || {}
    
    locals.controllers.User = {
        getUserbyid,
        getUserbyusername,
        putUsertoken,
        getUsertoken,
        putUserpass
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
        models.user.update({"token": token}, { where : {"account" : id }}).then(user => resolve(user)).catch(e=>reject(e));
    });
}

let getUsertoken = (code, password, req, res)=>{
    return new Promise((resolve, reject)=>{
        models.user.findOne({ where : {"token" : code}}).then(user => resolve(user)).catch(e=>reject(e));
    });
}

let putUserpass = (password, username, req, res)=>{
    let db = req.app.locals.services.sequelize;
    return new Promise(async (resolve, reject)=>{
        const updatepass = await db.query(`UPDATE mu_online_login.accounts SET mu_online_login.accounts.password = SHA2(CONCAT("${username}", ":", "${password}"), 256) WHERE mu_online_login.accounts.account = "${username}"`, { type: QueryTypes.UPDATE }).catch(e=>reject(e));
        if(updatepass){

            resolve("update_pass");

        }
    else{
            resolve("error");
    }
    
    });
}

module.exports = { init };