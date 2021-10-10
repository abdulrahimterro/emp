"use strict";

const { nodeEnv } = require("../../configs");
const sequelizeConfig = require("./config/config")[nodeEnv];
const Sequelize = require("sequelize");
const cls = require("cls-hooked");
const namespace = cls.createNamespace("BrandsMenu");
Sequelize.useCLS(namespace);

const sequelize = new Sequelize(sequelizeConfig.url, { logging: sequelizeConfig.logging });

module.exports = sequelize;
