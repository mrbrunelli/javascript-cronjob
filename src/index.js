const TaskController = require('./controllers/TaskController')
const { format } = require('date-fns')
const CronJob = require('cron').CronJob


const job = new CronJob('0 */1 * * * *', () => {
    let CRON_LOG = {
        running: job.running,
        lastExec: format(job.lastDate(), 'dd/MM/yyyy HH:mm:ss')
    }

    TaskController.executeTasks()

    console.log(CRON_LOG)

}, null, true, 'America/Sao_Paulo')
