
let express = require('express');
let router = express.Router();
let { exec } = require('child_process');
let os = require('os')
const si = require('systeminformation');
const batteryLevel = require('battery-level');
const isCharging = require('is-charging');
var consoleoutput = ""

router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/info', function (req, res, next) {
    res.render('info')
})

router.get('/terminal', function (req, res, next) {
    var load = {
        consoleoutput: consoleoutput,
    }
    res.render('terminal', load)
})

router.post('/terminal/submit', function (req, res, next) {
    var id = req.body.id
    console.log(id)
    exec(id, (err, stdout, stderr) => {
        consoleoutput = stdout
        console.log(consoleoutput)
        res.redirect('/terminal')
        console.log("-------------------")
        console.log(stdout)
    });

})

router.get('/uptime', function (req, res) {
    String.prototype.toHHMMSS = function () {
        var sec_num = parseInt(this, 10); // don't forget the second param
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        var time = hours + ':' + minutes + ':' + seconds;
        return time;
    }
    var time = os.uptime();
    var uptime = (time + "").toHHMMSS();
    res.send({ uptime: uptime })
})

router.get('/getTemp', function (req, res) {
    si.cpuTemperature()
        .then(data => {
            let currenttemp = data.main
            let maxtemp = data.max
            res.send([{ current: currenttemp }, { maxtemp: maxtemp }])
        })
})

router.get('/getCpu', function (req, res) {
    si.currentLoad()
        .then(data => {
            let cpu = data.currentload.toString()
            let cpus = cpu.slice(0, 2) + "%"
            si.cpu()
                .then(data => {
                    let cpumodel = `${data.manufacturer} ${data.brand}`
                    let cpuinfo = `${data.cores} cores ${data.physicalCores} threads`
                    res.send([{ currentload: cpus }, { cpumodel: cpumodel }, { cpuinfo: cpuinfo }])
                })
        })
})

router.get('/getbattery', function (req, res) {
    batteryLevel().then(level => {
        let batterylevel
        if (level == 1)
            batterylevel = 100
        else batterylevel = level.toString().slice(2, 4)
        isCharging().then(result => {
            if (result == false)
                charger = "Not charging"
            else if (result == true)
                charger = "Charging"
            res.send([{ battery: batterylevel }, { charging: charger }])
        })
    });
})

router.get('/getram', function (req, res) {
    function getram(a, b) {
        a = parseInt(a)
        b = parseInt(b)
        let result = b - a
        return result
    }

    let freem = ((os.freemem() / 1024 / 1024).toFixed(0))
    let total = ((os.totalmem() / 1024 / 1024).toFixed(0))
    res.send([{ used: getram(freem, total).toString() }, { total: total }, { free: freem }])
})

router.get('/poweroffmachine', function (req, res) {
    res.send({ status: "Machine turned off." })
    exec('shutdown', (err, stdout, stderr) => {
        console.log(stdout)
    })
})

router.get('/restartmachine', function (req, res) {
    res.send({ status: "Machine restart sent." })
    exec('sudo reboot', (err, stdout, stderr) => {
        console.log(stdout)
    })
})

module.exports = router;