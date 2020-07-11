const OcorrenciaController = require('./OcorrenciaController')
const EmailController = require('./EmailController')

module.exports = {
    async executeTasks() {
        OcorrenciaController.login()
            .then(res => {
                if (res.error) return EmailController.sendEmail(res.message)
                console.log(res)
                OcorrenciaController.listUltimoToken()
                    .then(res => {
                        if (res.error) return EmailController.sendEmail(res.message)
                        OcorrenciaController.listAllOcorrencias(res)
                            .then(res => {
                                if (res.error) return EmailController.sendEmail(res.message)
                                OcorrenciaController.createNewOcorrencia(res)
                                    .then(res => {
                                        if (res.error) return EmailController.sendEmail(res.message)
                                        return console.log(res)
                                    })
                            })
                    })
            })
    }
}