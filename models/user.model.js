let Sequelize = require("sequelize");

class User extends Sequelize.Model {

}

let Init = (app, locals) => {
	locals.models = locals.models || {};
	let sequelize = locals.services.sequelize;

	User.init({ 
		guid : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }, 
		blocked : Sequelize.TINYINT, 
		security_code : Sequelize.STRING,  
		golden_channel: Sequelize.BIGINT, 
		facebook_status : Sequelize.TINYINT,
		secured : Sequelize.TINYINT,
		account : Sequelize.STRING,
		password: Sequelize.STRING,
		email: Sequelize.STRING,
		register : Sequelize.BIGINT,
	}, 
		{ sequelize, modelName: 'accounts' });

	locals.models.user =  sequelize.models.accounts;
}

module.exports = Init;