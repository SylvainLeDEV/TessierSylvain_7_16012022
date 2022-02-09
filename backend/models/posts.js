'use strict';
const { v4: uuidv4 } = require('uuid');

const {
  Model
} = require('sequelize');
const fs = require("fs");
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
        foreignKey:"userId",
        onDelete: 'CASCADE',
      });

      this.hasMany(models.Comments, {
        foreignKey: "postId",
        onDelete: 'CASCADE',
        as:"comment",
        hooks: true
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
    userName:{
      allowNull: false,
      type: DataTypes.STRING
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
  Posts.beforeDestroy(async (Posts) => {
    console.log('ici')
      const filename = Posts.imageUrl.split('/images/posts')[1];
    console.log("filename", filename)
      fs.unlink(`images/posts/${filename}`,(res) =>{
        console.log(res)
      })
  })
  return Posts;
};