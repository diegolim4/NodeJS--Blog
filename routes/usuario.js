const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuarios')
const Usuario = mongoose.model('usuarios')


router.get('/registro', (req, res) => {
    res.render('usuarios/registro')
})


router.post('/registro', (req, res) => {
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: 'Nome Inválido' })
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ texto: 'E-mail Inválido' })
    }
    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ texto: 'senha Inválido' })
    }

    if (req.body.senha.length < 5) {
        erros.push({ texto: 'Senha muito curta' })
    }

    if (req.body.senha !== req.body.senha2) {
        erros.push({ texto: 'As senhas não são iguais!' })
    }

    if (erros.length > 0) {

        res.render('usuarios/registro', { erros: erros })
        res.redirect('/registro')
    } else {
        Usuario.findOne({ email: req.body.email }).then((usuario) => {
            if (usuario) {
                res.flash('error_msg', 'Já existe uma conta com esse e-mail')
            } else {

                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })



            }
        }).catch((err) => {
            req.flash('error_msg', 'Houver um erro interno')
            res.redirect('/')
        })
    }

})

module.exports = router
