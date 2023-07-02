const {DataTypes}  = require('sequelize')
const sequelize = require('../db/sequelize')

const Tag = sequelize.define('tag',{
    name:{ // 标签名称
        type:DataTypes.STRING, 
        primaryKey:true,
        allowNull:false
    }
},{
    timestamps:false
})

module.exports = Tag


