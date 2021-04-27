const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')  // importa o mongoose
require('../models/Categoria')  // chamando o arquivo do model
const Categoria = mongoose.model('categorias') //'categorias' é o mesmo nome do export no Categorias.js

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Página de posts')
})

router.get('/categorias', (req, res) => {
    res.render('admin/categorias')
})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req, res) => {
    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() => {
        console.log('Categoria salva com sucesso!')
    }).catch((err) => {
        console.log(`Erro ao salvar categoria ${err}`)
    })
})


module.exports = router