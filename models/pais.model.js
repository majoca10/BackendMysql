let Sequelize = require("sequelize");

class Pais extends Sequelize.Model {

}

let Init = (app, locals) => {
	locals.models = locals.models || {};
	let sequelize = locals.services.sequelize;

	Pais.init(
		{ 
			guid : { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }, 
			blocked : Sequelize.TINYINT, 
			security_code : Sequelize.STRING,  
			golden_channel: Sequelize.BIGINT, 
			facebook_status : Sequelize.TINYINT,
			secured : Sequelize.TINYINT,
			account : Sequelize.STRING,
			respoaccount: Sequelize.STRING,
			password: Sequelize.STRING,
			email: Sequelize.STRING,
			register : Sequelize.BIGINT,
		}, { sequelize, modelName: 'paises' });

	locals.models.Paises =  sequelize.models.paises;
}

module.exports = Init;