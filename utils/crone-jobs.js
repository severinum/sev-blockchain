const { CronJob } = require('cron')
const { log } = require('./colours');
const { getPeerListFromAllKnownSeedServers } = require('./utils');


function cronejob_get_peers_lists_from_seed_servers() {
    log(`Crone job 'cronejob_get_peers_lists_from_seed_servers' started`)
    let run = 1
    new CronJob(
        '*/4 * * * * *', // evey 5 seconds
        function () {
            log(`Crone Jon: Updating Seed Servers list [started]. Run loop: # ${run}`)
            getPeerListFromAllKnownSeedServers()
            run++
        }, // onTick
        null, // onComplete
        true, // start
        'Europe/London' // timeZone
    );
}

module.exports = {
    cronejob_get_peers_lists_from_seed_servers
}