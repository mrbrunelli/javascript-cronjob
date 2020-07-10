require('dotenv/config')
const transporter = require('../config/nodemail')

module.exports = {
    sendEmail(errorMessage) {
        transporter.sendMail({
            from: process.env.GAZIN_EMAIL,
            to: process.env.GAZIN_EMAIL,
            subject: '[AVISO] Erro na execução do Nodecron GKO',
            html: `
                <h3>Ocorreu um erro ao executar o Nodecron.</h3> 
                <p>O script que consome a API de Ocorrências do GKO não foi executado.</p>
                <hr>
                <p>Mensagem:
                    <small><i>${errorMessage}</i></small>
                </p>
            `
        }).then(() => {
            return console.log({ message: 'E-mail enviado com sucesso' })
        }).catch(err => {
            return console.log({ message: `Erro ao enviar e-mail`, error: err })
        })
    }
}