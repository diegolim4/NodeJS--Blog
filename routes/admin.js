const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../models/Categoria')  // chamando o arquivo do model
const Categoria = mongoose.model('categorias') //'categorias' é o mesmo nome do export no Categorias.js

require('../models/Postagens')
const Postagem = mongoose.model('postagens')

router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Página de posts')
})

router.get('/categorias', (req, res) => {
    Categoria.find().lean().sort({ date: 'desc' }).then((categorias) => {
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

// Edição

router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {  //mostra o campo da edição preenchido
        res.render("admin/editcategorias", { categoria: categoria })
    }).catch((err) => {
        req.flash('error_msg', 'Esta categoria não existe')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit', (req, res) => {
    Categoria.findOne({ _id: req.body.id }).then((categoria) => {

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash('success_msg', 'Categoria editada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a edição da categoria')
            res.redirect('/admin/categorias')
        })

    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao editar a categoria')
        res.redirect('/admin/categorias')
    })
})

//Delete

router.post('/categorias/deletar', (req, res) => {
    Categoria.remove({ _id: req.body.id }).then(() => {
        req.flash('success_msg', 'Categoria deletada com sucesso')
        res.redirect('/admin/categorias')
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao deletar a categoria')
        res.redirect('/admin/categorias')
    })
})

//Postagens

router.get('/postagens', (req, res) => {

    Postagem.find().lean().populate('categoria').sort({ data: 'desc' }).then((postagens) => {
        res.render('admin/postagens', { postagens: postagens })
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar as postagens ' + err)
        res.redirect('/admin')
    })
})

router.get('/postagens/add', (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render('admin/addpostagens', { categorias: categorias })
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao carregar o formulário ' + err)
        res.redirect('/admin')
    })
})
//Salvar as postagens no banco de dados
router.post('/postagens/nova', (req, res) => {

    var erros = []

    if (req.body.categoria == '0') {
        erros.push({ texto: 'Categoria inválida, registre uma categoria' })
    }

    if (erros.length > 0) {
        res.render('admin/addpostagem', { erros: erros })
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash('success_msg', 'Postagem criada com sucesso')
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('error_msg', 'Erro durante o salvamento da postagem ' + err)
            res.redirect('/admin/postagens')
        })
    }
})

router.get('/postagens/edit/:id', (req, res) => {

    Postagem.findOne({ _id: req.params.id }).lean().then((postagens) => {

        Categoria.find().lean().then((categorias) => {
            res.render('admin/editpostagens', { categorias: categorias, postagens: postagens })
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao listar as categorias ' + err)
            res.redirect('/admin/postagens')
        })

    }).catch((err) => {
        req.flash('error_msg', 'Erro ao entra na página de edição ' + err)
        res.redirect('/admin/postagens')
    })

})

router.post('/postagens/edit', (req, res) => {

    Postagem.findOne({ _id: req.body.id }).then((postagens) => {

        postagens.titulo = req.body.titulo
        postagens.slug = req.body.slug
        postagens.descricao = req.body.descricao
        postagens.conteudo = req.body.conteudo
        postagens.categoria = req.body.categoria

        postagens.save().then(() => {
            req.flash('success_msg', 'Postagem editada com sucesso!')
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('erro_msg', 'Erro interno ' + err)
            res.redirect('/admin/postagens')
        })

    }).catch((err) => {
        req.flash('error_msg', 'Houver um erro ao salvar a edição ' + err)
        res.redirect('/admin/postagens')
    })
})

module.exports = router