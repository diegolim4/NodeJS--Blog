//carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()
const admin = require('./routes/admin')
const path = require('path')

const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

require('./models/Postagens')
const Postagens = mongoose.model('postagens')
//Configuração
//Sessão
app.use(session({
    secret: 'amonode',   // uma chave para gerar a minha sessão
    resave: true,
    saveUninitialized: true
}))
app.use(flash())  //chamando o flash

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

//Body-Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Mongoose
mongoose.Promise = global.Promise; //Para evitar o erro
mongoose.connect('mongodb://localhost/blogapp').then(() => {
    console.log('Conectado ao banco de dados')
}).catch((err) => {
    console.log(`Erro ao se conectar ${err}`)
})

// Public
app.use(express.static(path.join(__dirname, 'public')))


//Rotas

app.get('/', (req, res) => {
    Postagens.find().lean().populate('categoria').sort({ data: 'desc' }).then((postagens) => {
        res.render('index', { postagens: postagens })
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/404')
    })
})

app.get('/404', (req, res) => { 
    res.send('Erro 404!')
})

app.get('/posts', (req, res) => {
    res.send('lista Post')
})

app.use('/admin', admin)


const PORT = 2021
app.listen(PORT, () => {
    console.log("Servidor Rodando http://localhost:2021")
})


