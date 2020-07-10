const OcorrenciaController = require('./OcorrenciaController')
const EmailController = require('./EmailController')

module.exports = {
    async executeTasks() {
        OcorrenciaController.login()
            .then(res => {
                if (res.error) return EmailController.sendEmail(res.message)
                console.log(res)
                OcorrenciaController.createNewOcorrencia()
                    .then(res => {
                        if (res.error) return EmailController.sendEmail(res.message)
                        return console.log(res)
                    })
                    .catch((err) => console.log(err))
            })
    }
}