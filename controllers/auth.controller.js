
let services;
let logger;
let models;
let { QueryTypes } = require('sequelize');
let  jwt = require('jsonwebtoken');
let config = require(`../config/${process.env.NODE_ENV || 'development'}.config.js`);
let SHA2 = require("sha2");
const { sha256 } = require('sha2');

let init = (app, locals)=>{
    logger = locals.logger.getLogger("authController");

    services = locals.services || {};
    models = locals.models;
    logger.info("Initialization started.");


    locals.controllers = locals.controllers || {}
    
    locals.controllers.Auth = {
        login,
        signup,
        loginme,
    }

    logger.info("Initialization finished.");

}

let login = (req, res)=>{
    const { username, password } = req.body;
    let db = req.app.locals.services.sequelize;

    return new Promise(async (resolve, reject)=>{
        const userInfo = await db.query(`SELECT * FROM  mu_online_login.accounts AS u WHERE u.account = "${username}" AND u.password = SHA2(CONCAT("${username}", ":", "${password}"), 256)`, { type: QueryTypes.SELECT }).catch((e)=>reject(e));
        
        if(userInfo && userInfo.length > 0){
            let data = userInfo[0];
            let token = jwt.sign({
                account : data.account,
                password : data.password
            }, config.JWT_SECRET);

            resolve({ data, token, });
        }else{
            resolve(null);
        }
    });
}

let loginme = (account, req, res)=>{
    let db = req.app.locals.services.sequelize;

    return new Promise(async (resolve, reject)=>{
        const userInfo = await db.query(`SELECT * FROM  mu_online_login.accounts AS u WHERE u.account = "${account}"`, { type: QueryTypes.SELECT }).catch((e)=>reject(e));
        
        if(userInfo && userInfo.length > 0){
            let data = userInfo[0];
            return res.send({ error: false, data, message: 'Fetch Successfully.' });

            //resolve({ data });
        }else{
            resolve(null);
        }
    });
}

let signup = (data, req, res)=>{
    let db = req.app.locals.services.sequelize;
    return new Promise(async (resolve, reject)=>{

        let userexist = await db.query(`SELECT * FROM  mu_online_login.accounts AS u WHERE u.account = "${data.account}"`, { type: QueryTypes.SELECT }).catch((e)=>reject(e));
        if(userexist.length == 0){

            let createuser = await db.query(`INSERT INTO mu_online_login.accounts (account, password, email, security_code, register, golden_channel, secured) VALUES ("${data.account}", SHA2(CONCAT("${data.account}", ":", "${data.password}"), 256), "${data.email}", "${data.code}", NOW(), 1500434821, 1);`, { type: QueryTypes.INSERT }).catch((e)=>reject(e));
            if(createuser){

                resolve("creado");

            }
        }else{
                resolve("existe");
        }
    });
    
}

module.exports = { init };