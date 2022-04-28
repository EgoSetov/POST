import { Sequelize } from "sequelize";

const sequelize = new Sequelize('test', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})


export default sequelize