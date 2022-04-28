import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Post = sequelize.define(
    'posts',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        authorId: DataTypes.INTEGER,
        body: DataTypes.STRING,
        image: DataTypes.STRING,
        date: {
            type: DataTypes.DATE,
            defaultValue: new Date()
        }
    },
    { timestamps: false, }
)

export default Post