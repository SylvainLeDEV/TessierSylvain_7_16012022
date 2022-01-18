'use strict';

const { v4: uuidv4 } = require('uuid');
const validator = require('validator');

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
      this.hasMany(models.Posts, {
        foreignKey:"userId",
        as : 'posts'
      })
    }
    toJSON() {
      return {...this.get(), id: undefined, userId: undefined};
    }
  }
  User.init({
    uuid: {
      type:DataTypes.UUID,
      allowNull: false,
      defaultValue:uuidv4,
      isUUID: 4,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: { msg : 'firstName must have a name'},
        notEmpty: { msg : 'firstName must not be empty'}
      }
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
      max: 23,
      min: 3,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique:"email",
      validate: {
        notNull: { msg : 'email must have a name'},
        notEmpty: { msg : 'email must not be empty'},
        isEmail: true
      },
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
      type: DataTypes.STRING,
      validate:{
        notNull: { msg : 'poste must have a name'},
        notEmpty: { msg : 'poste must not be empty'}
      }
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