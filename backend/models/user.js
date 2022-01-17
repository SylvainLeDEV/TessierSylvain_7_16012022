'use strict';

const { v4: uuidv4 } = require('uuid');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Posts)
    }
  }
  User.init({
    uuid: {
      type:DataTypes.UUID,
      allowNull: false,
      defaultValue:uuidv4
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique:true,
    },
    password: {
      allowNull: false,
      type:DataTypes.STRING
    },
    picture:{
      allowNull: true,
      type:DataTypes.STRING
    },
    bio:{
      allowNull: true,
      type:DataTypes.STRING
    },
    poste: {
      allowNull: false,
      type: DataTypes.STRING
    },
    isAdmin:{
      type:DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};