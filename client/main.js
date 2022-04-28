
const app = Vue.createApp({
    data: () => ({
        login: '',
        password: '',
        dataUser: {
            isAuth: false,
            user: null,
            myPosts: []
        },
        modal: {
            signup: false,
            signin: false,
            createPost: false
        },
        post: {
            body: '',
            image: null
        },
        alert: {
            text: '',
            visible: false
        },
        change: {
            id: null,
            visible: false
        }
    }),
    methods: {
        getToken() {
            if (localStorage.getItem('token')) {
                return JSON.parse(localStorage.getItem('token')).access_token
            } else {
                return ''
            }
        },
        async connect() {
            try {
                const token = this.getToken()
                const res = await fetch('http://localhost:8000/api/users/connect', {
                    method: 'GET',
                    headers: {
                        Authorization: `Berear ${token}`
                    }
                })
                    .then(data => data.json())

                if (!res?.detail) {
                    this.dataUser.isAuth = true
                    this.dataUser.user = res
                }
            } catch (error) {
                console.log(error);
            }
        },
        async signin() {
            try {
                const res = await fetch('http://localhost:8000/api/users/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ login: this.login, password: this.password })
                })
                    .then(data => data.json())

                if (res?.detail) return this.showAlert('Не удалось войти, не верный логин или пароль')
                this.modal.signin = false
                await localStorage.setItem('token', JSON.stringify(res))
                await this.connect()
            } catch (error) {
                console.log(error);
            }
        },
        async signup() {
            try {
                const res = await fetch('http://localhost:8000/api/users/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ login: this.dataUser.login, password: this.dataUser.password })
                })
                    .then(data => data.json())
                if (res?.detail) {
                    this.showAlert('Не удалось заргенистрироваться, такой пользователь уже существует')
                }
            } catch (error) {
                console.log(error);
            }
        },
        async createPost() {
            try {
                const token = this.getToken()
                const res = await fetch('http://localhost:8000/api/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Berear ${token}`
                    },
                    body: JSON.stringify(this.post)
                })
                    .then(data => data.json())
                if (res?.detail) return showAlert('Не удалось создать пост')
                this.modal.createPost = false
                this.dataUser.myPosts = [...this.dataUser.myPosts, { login: 'You', ...res }]
                this.showAlert('Пост успешно создан')
                this.post.body = ''
                this.post.image = null
            } catch (error) {
                console.log(error);
            }
        },
        async getMyPosts() {
            try {
                const token = this.getToken()
                const res = await fetch('http://localhost:8000/api/posts/myPosts', {
                    method: 'GET',
                    headers: {
                        Authorization: `Berear ${token}`
                    }
                })
                    .then(data => data.json())

                if (!res?.detail) {
                    this.dataUser.myPosts = res.items
                }
            } catch (error) {
                console.log(error);
            }
        },
        async removePost(id) {
            try {
                const token = this.getToken()
                const res = await fetch(`http://localhost:8000/api/posts/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Berear ${token}`
                    }
                })
                    .then(data => data.json())

                if (res?.detail) return this.showAlert('Не удалось удалить пост')
                this.dataUser.myPosts = this.dataUser.myPosts.filter(el => el.id !== id)
                this.showAlert('Пост удален')
            } catch (error) {
                console.log(error);
            }
        },
        exit() {
            localStorage.removeItem('token')
            this.dataUser = {
                isAuth: false,
                user: null,
                myPosts: []
            }
        },
        showModalSignin(bool) {
            this.modal.signin = bool
            this.modal.signup = false
        },
        showModalSignup(bool) {
            this.modal.signup = bool
            this.modal.signin = false
        },
        showModalCreatePost(bool) {
            this.modal.createPost = bool
        },
        convertBase64(file) {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader()
                fileReader.readAsDataURL(file)

                fileReader.onload = () => {
                    resolve(fileReader.result)
                }

                fileReader.onerror = (error) => {
                    reject(error)
                }
            })
        },
        async loadImage(e) {
            this.post.image = await this.convertBase64(e.target.files[0])
        },
        async showAlert(text) {
            this.alert.visible = true
            this.alert.text = text
            setTimeout(() => {
                this.alert.visible = false
                this.alert.text = ''
            }, 2000)
        },
        changePost(id) {
            this.change.visible = true
            this.change.id = id
        },
        async saveChangePost() {
            try {
                const token = this.getToken()
                const res = await fetch(`http://localhost:8000/api/posts/${this.change.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Berear ${token}`
                    },
                    body: JSON.stringify({
                        body: this.post.body,
                        image: this.post.image || this.dataUser.myPosts[this.dataUser.myPosts.findIndex(el => el.id === this.change.id)].image
                    })
                })

                if (res?.detail) return this.showAlert('Не удалось изменить пост')
                this.showAlert('Пост изменен')
                this.dataUser.myPosts[this.dataUser.myPosts.findIndex(el => el.id === this.change.id)].body = this.post.body
                this.dataUser.myPosts[this.dataUser.myPosts.findIndex(el => el.id === this.change.id)].image = this.post.image ||
                    this.dataUser.myPosts[this.dataUser.myPosts.findIndex(el => el.id === this.change.id)].image
            } catch (error) {
                console.log(error);
            }
        }

    },
    mounted() {
        if (localStorage.getItem('token')) {
            this.connect()
            this.getMyPosts()
        }
    },
    watch: {
        isAuth() {
            this.connect()
            this.getMyPosts()
        }
    }
})

app.mount('#app')

