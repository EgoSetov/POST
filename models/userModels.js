import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const User = sequelize.define(
    'users',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        login: DataTypes.STRING,
        password: DataTypes.STRING
    },
    { timestamps: false }
)

export default User