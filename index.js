import express from 'express'
import cors from 'cors'
import sequelize from './db.js'
import userRouter from './router/userRouter.js'
import postsRouter from './router/postsRouter.js'
const PORT = 8000

const app = express()

app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb'}));
app.use(express.json())
app.use(cors())

app.use('/api/users', userRouter)
app.use('/api/posts', postsRouter)

try {
    await sequelize.authenticate()
    console.log('Соеденение успешное установлено');
} catch (error) {
    console.log(`Не удалось установить соеденение ${error}`);
}

app.listen(PORT, () => { console.log(`Server started PORT = ${PORT}`); })