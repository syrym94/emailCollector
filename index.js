(async () => {
    // var express = require('express');
    // var app = express();
    // let messages = require('./routes/messages')
    // let profiles = require('./routes/profiles')
    // let attachments = require('./routes/attachments')
    // bodyParser = require('body-parser');
    // app.use(bodyParser.urlencoded({ extended: true }));
    // app.use(bodyParser.json());
    // app.use('/messages',messages)
    // app.use('/profiles',profiles)
    // app.use('/attachments',attachments)

    // app.listen(3000);
    var start = new Date();
    var startTime = start.getTime();
    const ImapClient = require('emailjs-imap-client')
    const lastDateFunc = require('./lastDateFunc')
    let mails = [{
        user: 'syrym94@gmail.com',
        password: 'syrymzhayik94',
        host: 'imap.gmail.com',
    }, {
        user: 'syrymzhayik94@mail.ru',
        password: '0648938S',
        host: 'imap.mail.ru',
    },
    {
        user: 'alexandr.s@garant.ae',
        password: '.!rT>a*M1X',
        host: 'just126.justhost.com',
    }]
    function chunkify(a, n, balanced) {

        if (n < 2)
            return [a];

        var len = a.length,
            out = [],
            i = 0,
            size;

        if (len % n === 0) {
            size = Math.floor(len / n);
            while (i < len) {
                out.push(a.slice(i, i += size));
            }
        }

        else if (balanced) {
            while (i < len) {
                size = Math.ceil((len - i) / n--);
                out.push(a.slice(i, i += size));
            }
        }

        else {

            n--;
            size = Math.floor(len / n);
            if (len % size === 0)
                size--;
            while (i < size * n) {
                out.push(a.slice(i, i += size));
            }
            out.push(a.slice(size * n));

        }

        return out;
    }
    // for (let j = 0; j < mails.length; j++) {
    // Вводные для подключения к Imap серверу
    let client = new ImapClient.default('just126.justhost.com', 993, {
        auth: {
            user: 'alexandr.s@garant.ae',
            pass: '.!rT>a*M1X',
        }
    })
    client.logLevel = client.LOG_LEVEL_NONE; // Закоментить если необходимы детальные логи

    let arrNames = []
    try {
        //   count++
        await client.connect() //  подключение к серверу, выводит ошибку после трех неудачных попыток
    } catch (e) {
        console.log('Error while connecting ' + e)
    }
    //   try {
    //     count++
    //     await client.connect()
    //   } catch (e) {
    //     console.log(`second attempt error`)
    //     try {
    //       count++
    //       await client.connect()
    //     } catch (e) {
    //       console.log(`third attempt error`)
    //       throw Error('problems with authorization')
    //     }
    //   }
    // }
    try {
        var mailboxes = await client.listMailboxes() // Запрос на получение всех директории
        // console.log(mailboxes, 'mailboxes')
    } catch (e) {
        console.log('Error while listing ' + e)
    }
    mailboxes.children.forEach(children => { // Создание массива из всех вложенных директории
        arrNames.push(children.path)
        if (children.children.length !== 0) {
            children.children.map(innerBox => arrNames.push(innerBox.path))
        }
    })
    let chunkedArrNames = chunkify(arrNames, 4, true)
    const cp = require('child_process')
    const child1 = cp.fork('main.js')
    child1.send([chunkedArrNames[0], mails[2],1])
    child1.on('message', message => {
        console.log(message,'child1')
    })
    const child2 = cp.fork('main.js')
    child2.send([chunkedArrNames[1], mails[2],2])
    child2.on('message', message => {
        console.log(message,'child2')
    })
    const child3 = cp.fork('main.js')
    child3.send([chunkedArrNames[2], mails[2],3])
    child3.on('message', message => {
        console.log(message,'child3')
    })
    const child4 = cp.fork('main.js')
    child4.send([chunkedArrNames[3], mails[2],4])
    child4.on('message', message => {
        console.log(message,'child4')
    })

    var end = new Date();
    var endTime = end.getTime();
    var timeTaken = endTime - startTime;
    console.log('Execution time is : ' + timeTaken);
    await lastDateFunc() // Функция записывающая момент вызова программы в callDate.json
})()