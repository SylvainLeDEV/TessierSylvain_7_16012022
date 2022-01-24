'use strict';
const {
  Model
} = require('sequelize');
const {v4: uuidv4} = require("uuid");
module.exports = (sequelize, DataType) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Posts, {
        foreignKey:"postId",
        // onDelete: 'CASCADE'
      });
      this.belongsTo(models.User,{
        foreignKey: "userId",
        // onDelete: 'CASCADE'
      })
    }
  }
  Comments.init({
    uuid: {
      type:DataType.UUID,
      allowNull: false,
      defaultValue:uuidv4
    },
    posterId: {
      type: DataType.STRING
    },
    content: {
      type: DataType.STRING
    },
    imageUrl: {
      type: DataType.STRING
    },
    videoUrl: {
      type: DataType.STRING
    },
    postId:{
      type:DataType.INTEGER,
      allowNull: false
    },
    userId : {
      type:DataType.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};