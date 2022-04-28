import { Router } from 'express'
import JWT from 'jsonwebtoken'
import Post from '../models/postModels.js'
import User from '../models/userModels.js'

const postsRouter = Router()

postsRouter
    .get('/myposts', async (req, res) => {
        let token = req.headers.authorization
        if (!token) return res.status(401).json({ detail: 'authorization is required' })
        token = token.slice(7)

        const { id } = JWT.verify(token, 'SUPER_SECRET_KEY')
        if (!id) return res.status(401).json('Not authorized')

        const UserPosts = await Post.findAll({ where: { authorId: id } })

        res.status(200).json({
            items: UserPosts.map(el => ({ login: "You", ...el?.dataValues }))
        })
    })

    .post('/', async (req, res) => {
        const { body, image } = req.body
        let token = req.headers.authorization
        if (!body) return res.status(401).json({ detail: 'body is required' })
        if (!token) return res.status(401).json({ detail: 'authorization is required' })
        token = token.slice(7)

        const { id } = JWT.verify(token, 'SUPER_SECRET_KEY')
        if (!id) return res.status(401).json('Not authorized')

        const post = await Post.create({
            body,
            image,
            authorId: id
        })

        res.status(201).json(post.dataValues)

    })

    .patch('/:idPost', async (req, res) => {
        let token = req.headers.authorization
        const { idPost } = req.params
        const { body, image } = req.body
        if (!token) return res.status(401).json({ detail: 'authorization is required' })
        if (!idPost) return res.status(401).json({ detail: 'id is required' })
        if (!body) return res.status(401).json({ detail: 'body is required' })
        token = token.slice(7)
        const { id } = JWT.verify(token, 'SUPER_SECRET_KEY')
        if (!id) return res.status(401).json('Not authorized')

        const post = await Post.update({ body: body, image: image }, {
            where: {
                id: idPost,
                authorId: id
            }
        })

        res.status(200).json()
    })

    .delete('/:idPost', async (req, res) => {
        let token = req.headers.authorization
        const { idPost } = req.params
        if (!token) return res.status(401).json({ detail: 'authorization is required' })
        if (!idPost) return res.status(401).json({ detail: 'id is required' })
        token = token.slice(7)
        const { id } = JWT.verify(token, 'SUPER_SECRET_KEY')
        if (!id) return res.status(401).json('Not authorized')

        await Post.destroy({
            where: {
                id: idPost,
                authorId: id
            }
        })
        res.status(200).json(true)
    })

export default postsRouter