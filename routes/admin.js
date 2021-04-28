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
    Categoria.find().lean().then((categorias) => {
        res.render('admin/categorias', { categorias: categorias })
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as categorias')
        res.redirect('/admin')
    })

})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req, res) => {

    //sistema de validação de formulários 
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: 'Nome Inválido' })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: 'Slug Invalido' })
    }

    if (req.body.nome.length < 2) {
        erros.push({ texto: 'Nome da categoria muito pequeno' })
    }

    if (erros.length > 0) {
        res.render('admin/addcategorias', { erros: erros })
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg', 'houve um erro a salva a categoria.')
            res.redirect('/admin')
        })
    }
})


module.exports = router