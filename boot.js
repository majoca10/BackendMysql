const fs = require('fs');
const cors = require('cors');
const morgan = require("morgan");
const bodyParser = require('body-parser')

const CONTROLLER_DIR = `${__dirname}/controllers/`;
const SERVICE_DIR = `${__dirname}/services/`;
const ROUTE_DIR = `${__dirname}/routes/`;
const MODEL_DIR = `${__dirname}/models/`;
const SCHEMAS_DIR = `${__dirname}/models/schemas/`;
const MIDDLEWARES_DIR = `${__dirname}/middlewares/`;

const utilMiddleware = require('./util/middleware.util');

let getControllers = ()=>{
    return new Promise((resolve, reject)=>{
        fs.readdir(`${CONTROLLER_DIR}`, (err, items) => {
            if(err){
                return reject(err);
            }

            resolve(items.filter( (js)=>js.match('.js') ) );
        });   
    });
}

let getServices = ()=>{
    return new Promise((resolve, reject)=>{
        fs.readdir(`${SERVICE_DIR}`, (err, items) => {
            if(err){
                return reject(err);
            }

            resolve(items.filter( (js)=>js.match('.js') ) );
        });   
    }); 
}

let getRoutes= ()=>{
    return new Promise((resolve, reject)=>{
        fs.readdir(`${ROUTE_DIR}`, (err, items) => {
            if(err){
                return reject(err);
            }

            resolve(items.filter( (js)=>js.match('.js') ) );
        });   
    }); 
}

let getModels= ()=>{
    return new Promise((resolve, reject)=>{
        fs.readdir(`${MODEL_DIR}`, (err, items) => {
            if(err){
                return reject(err);
            }

            resolve(items.filter( (js)=>js.match('.js') ) );
        });   
    }); 
}

let getSchemas= ()=>{
    return new Promise((resolve, reject)=>{
        fs.readdir(`${SCHEMAS_DIR}`, (err, items) => {
            if(err){
                return reject(err);
            }

            resolve(items.filter( (js)=>js.match('.js') ) );
        });   
    }); 
}

let getMiddlewares= ()=>{
    return new Promise((resolve, reject)=>{
        fs.readdir(`${MIDDLEWARES_DIR}`, (err, items) => {
            if(err){
                return reject(err);
            }

            resolve(items.filter( (js)=>js.match('.js') ) );
        });   
    }); 
}


let boot = async (app) =>{
    let controllers = await getControllers();
    let services = await getServices();
    let routes = await getRoutes();
    let models = await getModels();
    let schemas = await getSchemas();
    let middlewares = await getMiddlewares();

    return new Promise(async (resolve, reject)=>{
        try{
           
            app.use(cors());
            app.use(bodyParser.json());
            app.use(morgan("dev"));
            
            for(s in services){
                let service = require(`${SERVICE_DIR}${services[s]}`);
                await service.init(app, app.locals);
            }

            for(m in models){
                let init  = require(`${MODEL_DIR}${models[m]}`);
                init(app, app.locals);
            }

            for(se in schemas){
                let init  = require(`${SCHEMAS_DIR}${schemas[se]}`);
                init(app, app.locals);
            }

            for(md in middlewares){
                let init  = require(`${MIDDLEWARES_DIR}${middlewares[md]}`);
                init(app, app.locals);
            }

            for(c in controllers){
                let contrls = require(`${CONTROLLER_DIR}${controllers[c]}`)
                await contrls.init(app, app.locals);
            }

            let auth = utilMiddleware.getMiddleWare(app, 'auth');
            app.use(auth);

            for(r in routes){
                app.use('/api/',  require(`${ROUTE_DIR}${routes[r]}`));
            }

            app.locals.mainController = {
                returnError: returnError,
                apiResponder : apiResponder 
            };

            resolve(true);

        }catch(e){
            console.log(e.message);
            return reject(e);
        }
    });
}

const returnError = (res, httpCode, code)=>{
    res.status(httpCode);
    res.send(JSON.stringify({error_id: code}));
    res.end();
}

const apiResponder = (res, httpCode, data)=>{
    if(Object.keys(data).length > -1){
        res.status(httpCode);
        res.json(data);
        
        return res.end();
    }

    res.status(httpCode);
    res.send(JSON.stringify(data));
    res.end();
}

module.exports = {
    boot
}