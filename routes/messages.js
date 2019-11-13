var express = require('express')
var router = express.Router()
let connection = require('../db.js')

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})
// define the home page route
router.get('/', function (req, res) {
    connection.query(`select * from messages`, (err, result, fields) => {
        if (err) throw err
        res.send(result)
    })
})
// define the about route
router.get('/:id', function (req, res) {
    // console.log(req.params)
    connection.query(`select * from messages where message_id = ${req.params.id}`, (err, result, fields) => {
        if (err) throw err
        let date = new Date(result[0].created)
        console.log(date.toString())
        res.send(result)
    })
})
router.post('/', function (req, res) {
    connection.query(`insert into messages (html, header, created) values ('${req.body.html}', '${req.body.header}',${new Date().getTime()})`, (err, result, fields) => {
        if (err) throw err
        res.send(result)
    })
})
router.put('/:id', function (req, res) {
    let reqFields = Object.keys(req.body)
    connection.query(`update messages set ${reqFields[0]} = '${req.body.html}', ${reqFields[1]} = '${req.body.header}', updated = ${new Date().getTime()} WHERE message_id = ${req.params.id}`, (err, result, fields) => {
        if (err) throw err
        res.send(result)
    })
})
router.delete('/:id', function (req, res) {
    connection.query(`delete from messages where message_id = ${req.params.id}`, (err, result, fields) => {
        if (err) throw err
        res.send(result)
    })
})
router.delete('/', function (req, res) {
    connection.query(`delete from messages`, (err, result, fields) => {
        if (err) throw err
        res.send(result)
    })
})
module.exports = router