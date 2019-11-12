var start = new Date();
var startTime = start.getTime();
const ImapClient = require('emailjs-imap-client')
const { default: parse } = require('emailjs-mime-parser')
const emailFetch = require('./emailFetch')
var fs = require('fs');
let mails = [{
  user: 'syrym94@gmail.com',
  password: 'syrymzhayik94',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
}, {
  user: 'syrymzhayik94@mail.ru',
  password: '0648938S',
  host: 'imap.mail.ru',
  port: 993,
  tls: true
}]
// for (let j = 0; j < mails.length; j++) {
let client = new ImapClient.default('just126.justhost.com', 993, {
  auth: {
    user: 'alexandr.s@garant.ae',
    pass: '.!rT>a*M1X'
  }
});
// client.logLevel = client.LOG_LEVEL_NONE;
let arrNames = []
let arrMessages = []
let arrMailboxes = []
try {
  client.connect().then(() => {
    client.listMailboxes().then(mailboxes => {
      for (let i = 0; i < mailboxes.children.length; i++) {
        arrNames.push(mailboxes.children[i].path)
        if (mailboxes.children[i].children.length !== 0) {
          mailboxes.children[i].children.map(innerBox => arrNames.push(innerBox.path))
        }
      }
      return arrNames
    })
      .then(arrNames => {
        // console.log(arrNames)
        let lastDateOfInvoking = require('./lastDateOfInvoking.json')
        for (let i = 0; i < arrNames.length; i++) {
          client.search(`${arrNames[i]}`, { unseen: true, since: new Date(lastDateOfInvoking[0], 9, lastDateOfInvoking[2], lastDateOfInvoking[3], lastDateOfInvoking[4], 0, 0, 0) }).then((result) => {
            // console.log(result,'result')

            let lastMessage = Math.max(...result)
            if (lastMessage <= 0) {
              console.log('there are no emails in this box')
              console.log(arrNames)
            } else {
              arrMailboxes.push(arrNames[i])
              console.log(arrMailboxes, 'arrNames')
              client.listMessages(`${arrNames[i]}`, `${lastMessage - 9}:${lastMessage}`, ['envelope', 'body.peek[]']).then((messages) => {
                // console.log(messages.length,'messages length')
                messages.forEach((message) => {
                  // console.log(message.envelope)
                  arrMessages.push(message.envelope.from[0].address)
                  emailFetch()
                    .then(res => {
                      function compare(arr1, arr2) {

                        const objMap = {};

                        arr1.forEach((e1) => arr2.forEach((e2) => {
                          if (e1 === e2) {
                            objMap[e1] = objMap[e1] + 1 || 1;
                          }
                        }
                        ))
                        let arrMatch = []
                        Object.keys(objMap).map(e => {
                          if (e) arrMatch.push(e)
                        })
                        return arrMatch
                      }
                      return compare(arrMessages, res)
                    }).then(result => {
                      if (result == message.envelope.from[0].address) {
                        const myMimeNodes = parse(message['body[]'])
                        console.log(myMimeNodes.childNodes[0].childNodes[0].content)
                        if (myMimeNodes.childNodes[1].contentType.params.name !== undefined && myMimeNodes.childNodes !== undefined) {
                          fs.writeFileSync('1.txt', myMimeNodes.childNodes[0].childNodes[1].content, function (err) {
                            if (err) throw err;
                            console.log('complete');
                          })
                          let idToFile = { 'messageId': message.envelope['message-id'], 'fileName': myMimeNodes.childNodes[1].contentType.params.name }
                          // console.log(idToFile)    
                          // if (err) throw err;
                        }
                      }
                      // console.log(result)
                      var end = new Date();
                      var endTime = end.getTime();
                      var timeTaken = endTime - startTime;
                      console.log('Execution time is : ' + timeTaken);
                    })
                })

              }).catch(e => {
                // console.log('listMessages' + e)
              })
            }
          }
          ).catch(e => {
            console.log('search catch' + e)
          })
        }
        let year = new Date().getFullYear()
        let month = new Date().getMonth()
        let date = new Date().getDate()
        let hour = new Date().getHours()
        let minutes = new Date().getMinutes()
        let dateArr = [year, month, date, hour, minutes]
        fs.writeFileSync('lastDateOfInvoking.json', JSON.stringify(dateArr), 'utf8', function (err) {
          if (err) throw err;
          console.log('complete');
        });
      }
      )
  }
  ).catch(e => {
    console.log('connect catch' + e)
  })
} catch (e) {
  console.log(e)
}
// }