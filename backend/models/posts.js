'use strict';
const { v4: uuidv4 } = require('uuid');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey:"userId"
      });

      this.hasMany(models.Comments, {
        foreignKey: "postId",
      })

    }
  }
  Posts.init({
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue:uuidv4
    },
    content: {
      allowNull: false,
      type: DataTypes.STRING
    },
    userId:{
      type:DataTypes.INTEGER,
      allowNull: false
    },
    imageUrl: {
      allowNull: true,
      type: DataTypes.STRING
    },
    videoUrl: {
      allowNull: true,
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};