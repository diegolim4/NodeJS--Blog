//carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require('./routes/admin')
    //const mongoose = require('mongoose')
//Configuração
    
    //body-parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    
    //handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    // mongoose
        //Em breve   
    
//Rotas
    app.use('/admin', admin)
    

//Outros
const PORT = 2021
app.listen(PORT, ()=>{
    console.log("Servidor Rodando http://localhost:2021")
})


