let fs = require('fs');
const Sequelize = require('sequelize');
const connection_string = process.env.MYSQL_CSTRING;
let logger;

let init = async (app, locals)=>{
    logger = locals.logger.getLogger("mysqlService");

    return new Promise(async (resolve, reject)=>{
        
        logger.info(`Connecting with Mysql server`);

        let connection = await initialize().catch((e)=>{
            logger.error(`Error connection with Mysql instance ${e.message}`);
            return reject(new Error(`Error connection with Mysql instance ${e.message}`));
        }); 

        logger.info(`Connection Done.`);

        if(connection){
            try{
                locals.services = locals.services || {};
                locals.services.sequelize = connection|| {};
                return resolve();
            
            }catch(e){
                logger.error(`Error loading model ${models[m]}`);
                reject(new Error(`[ERROR]: loading model ${models[m]}`));
            }
        }
    });

}

let initialize = async ()=>{

    return new Promise((resolve, reject)=>{
        try{
            let sequelize = new Sequelize('mu_online_login', 'root', '0126*', {
                host: '127.0.0.1',
                dialect: 'mysql',
                define: {
                    timestamps: false,
                    freezeTableName : true
                },
               
            });

              sequelize
              .authenticate()
              .then(() => {
                console.log('Connection has been established successfully.');
                return resolve(sequelize);
              })
              .catch(err => {
                console.error('Unable to connect to the database:', err);
                return reject(err);
              });
            
        }catch(e){
            logger.error(`Error connection with mongodb instance`);
            reject(e);
        }
    });

};

module.exports = { init };