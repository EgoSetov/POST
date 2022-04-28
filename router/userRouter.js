import { Router } from 'express'
import JWT from 'jsonwebtoken'
import md5 from 'md5'
import User from '../models/userModels.js'

const userRouter = Router()

userRouter
    .post('/signup', async (req, res) => {
        try {
            const { login, password } = req.body
            if (!login || !password) return res.status(401).json({ detail: 'the login and password fields are mandatory' })

            const person = await User.findAll({ attributes: ['id'], where: { login: login } })
            if (person[0]?.dataValues?.id) {
                return res.status(409).json({ detail: "user already exists" })
            }
            const user = await User.create({
                login,
                password: md5(password)
            })

            res.status(201).json(true)
        } catch (error) {
            res.status(500).json({
                detail: `Problems on the server ${error}`
            })
        }

    })

    .post('/signin', async (req, res) => {
        try {
            const { login, password } = req.body
            if (!login || !password) return res.status(401).json({ detail: 'the login and password fields are mandatory' })

            const user = await User.findAll({
                attributes: ['id'],
                where: {
                    login: login,
                    password: md5(password)
                }
            })

            if (!user[0]?.dataValues?.id) return res.status(401).json({ detail: "invalid username or password" })
            const token = JWT.sign(user[0].dataValues, 'SUPER_SECRET_KEY')

            res.status(200).json({
                access_token: token
            })
        } catch (error) {
            res.status(500).json({
                detail: `Problems on the server ${error}`
            })
        }
    })

    .get('/connect', async (req, res) => {
        try {
            let token = req.headers.authorization
            if (!token) return res.status(401).json({ detail: 'authorization is required' })
            token = token.slice(7)
            const { id } = JWT.verify(token, 'SUPER_SECRET_KEY')
            if (!id) return res.status(401).json('Not authorized')

            const user = await User.findAll({ where: { id: id }, attributes: ["id", "login"] })
            res.status(200).json(user[0]?.dataValues)
        } catch (error) {
            res.status(500).json({
                detail: `Problems on the server ${error}`
            })
        }

    })

export default userRouter