//Verificar se um usuário é admin e protegendo as rotas 

module.exports = {
    isAdmin: function (req, res, next) {

        if (req.isAuthenticated() && req.user.adminTrue !== 1) {
            return next()
        }
        req.flash('error_msg', 'Você Precisar ser uma Admin!')
        res.redirect('/')
    }
}