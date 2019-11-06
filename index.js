(async function (){
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
try{ 
await client.connect()
}catch(e){
  console.log('Error while connecting ' + e)
}
try{
var mailboxes = await client.listMailboxes()
}catch(e){
  console.log('Error while listing ' + e)
}
    for (let i = 0; i < mailboxes.children.length; i++) {
      arrNames.push(mailboxes.children[i].path)
      if (mailboxes.children[i].children.length !== 0) {
        mailboxes.children[i].children.map(innerBox => arrNames.push(innerBox.path))
      }
    }
    let lastDateOfInvoking = require('./lastDateOfInvoking.json')
    for (let i = 0; i < arrNames.length; i++) {
      try{
      var result = await client.search(`${arrNames[i]}`, { unseen: true, since: new Date(lastDateOfInvoking[0], 8, lastDateOfInvoking[2], lastDateOfInvoking[3], lastDateOfInvoking[4], 0, 0, 0) })
    }catch(e){
      console.log('Error while searching ' + e)
    }
        if (result <= 0) {
          console.log('no emails')
        } else {
          arrMailboxes.push(arrNames[i])
        }
    }
    if(result.length > 0){
      console.log(result,'lastMessage',arrNames.length,'arrNames',arrMailboxes.length,'arrMailboxes')
            arrMailboxes.forEach( async box => {
              try{
             let messages = await client.listMessages(`${box}`, `${Math.max(...result) - 9}:${Math.max(...result)}`, ['envelope', 'body.peek[]'])
              }catch(e){
                console.log('Error while inside listing ' + e)
              }
              messages.forEach(async message => {
                  // console.log(message.envelope)
                  arrMessages.push(message.envelope.from[0].address)
                  try{
                  let res = await emailFetch()
                  } catch(e){
                    console.log('Error while emailFetching ' + e)
                  }
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
                      let comparedArr = compare(arrMessages, res)
                      if (comparedArr == message.envelope.from[0].address) {
                        const myMimeNodes = parse(message['body[]'])
                        console.log(myMimeNodes.childNodes[0].childNodes[0].content)
                        if (myMimeNodes.childNodes[1].contentType.params.name !== undefined && myMimeNodes.childNodes !== undefined) {
                          fs.writeFile('1.txt', myMimeNodes.childNodes[0].childNodes[1].content, function (err) {
                            if (err) throw err;
                            console.log('complete');
                          })
                          let idToFile = { 'messageId': message.envelope['message-id'], 'fileName': myMimeNodes.childNodes[1].contentType.params.name }
                          // console.log(idToFile)    
                          // if (err) throw err;
                        }
                      }
                    })
                })
    } else{
      console.log('no new email anywhere')
    }
    var end = new Date();
    var endTime = end.getTime();
    var timeTaken = endTime - start;
    console.log('Execution time is : ' + timeTaken);
let year = new Date().getFullYear()
let month = new Date().getMonth()
let date = new Date().getDate()
let hour = new Date().getHours()
let minutes = new Date().getMinutes()
let dateArr = [year, month, date, hour, minutes]
fs.writeFile('lastDateOfInvoking.json', JSON.stringify(dateArr), 'utf8', function (err) {
  if (err) throw err;
  console.log('complete');
});
})()

// let client = new ImapClient.default('just126.justhost.com', 993, {
//   auth: {
//     user: 'alexandr.s@garant.ae',
//     pass: '.!rT>a*M1X'
//   }
// });
// let client = new ImapClient.default('imap.gmail.com', 993, {
//   auth: {
//     user: 'syrym94@gmail.com',
//     pass: 'syrymzhayik94'
//   }
// });