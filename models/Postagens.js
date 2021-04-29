const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Postagem = new Schema({
    titulo: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        required: true
    },

    descrição: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },

    categoria:{
        type: Schema.Types.ObjectId,  // O tipo vai ser um id de algum objeto
        ref: 'categorias',  // a ref é o nome do model que queremos pegar o id 
        required: true
    },

    data:{
        type: Date,
        deafault: Data.now()
    }
})

mongoose.model('postagens', Postagem)