const list = async (client, box) => {
    const { default: parse } = require('emailjs-mime-parser')
    var fs = require('fs');
    let arrMessagesFrom = []
    let arrMessagesTo = []
    const emailFetch = require('./emailFetch')
    let res = await emailFetch() // Получение всех профайлов и емайлов текущего owner_id
    let responseToServer
    try {
        for (let i = 0; i < box.length; i++) {
            let messages = await client.listMessages(`${box[i]}`, `*`, ['envelope', 'body.peek[]']) // Итерируем через массив отсеянных директории и вытаскиваем письма
            messages.forEach(async message => {
                arrMessagesFrom.push(message.envelope.from[0].address) // Создаем массив от кого пришел емайл 
                arrMessagesTo.push(message.envelope.to[0].address) //Создаем массив кому пришел емайл 
                try {
                    function compare(arr1, arr2) { // Сравниваем с емайлами которые были получены ранее функцией emailFetch()

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
                    let comparedArrFrom = compare(arrMessagesFrom, res[0])
                    let comparedArrTo = compare(arrMessagesTo, res[0])
                    // console.log(comparedArrFrom,comparedArrTo,'Arrays')
                    if (comparedArrFrom == message.envelope.from[0].address || comparedArrTo == message.envelope.to[0].address) { // Если имеются совпадения то парсим тело письма и приклепленные файлы
                        // console.log(`${box} HAS A MATCH !!!!!!`)
                        const myMimeNodes = parse(message['body[]'])

                        // console.log(myMimeNodes.childNodes[0].childNodes[0].content)
                        // if (myMimeNodes.childNodes[1].contentType.params.name !== undefined && myMimeNodes.childNodes !== undefined) {
                        fs.writeFile(`bodyOfEmail.txt`, myMimeNodes.childNodes[0].childNodes[0].content, function (err) { // Парсинг тела письма 
                            if (err) throw err;
                            console.log('complete');
                        })
                        let attachements = []
                        for (let j = 0; j < myMimeNodes.childNodes.length; j++) {
                            attachements.push({ name: myMimeNodes.childNodes[j].contentType.params.name, content: myMimeNodes.childNodes[j].content }) // Парсинг приклепленных файлов
                            fs.writeFile(`${myMimeNodes.childNodes[j].contentType.params.name}`, myMimeNodes.childNodes[j].content, function (err) {
                                if (err) throw err;
                                console.log('complete');
                            })
                        }
                        // Блок подготовки ответа серверу
                        let profile_ids = []
                        let direction, from, to
                        for (let i = 0; i < res[1].length; i++) {
                            if (res[1][i].email == message.envelope.from[0].address || res[1][i].email == message.envelope.to[0].address) {
                                profile_ids.push(res[1][i].profile_id)
                            }
                            if (res[1][i].email == message.envelope.from[0].address) {
                                direction = 1
                                from = message.envelope.from[0].address
                                to = message.envelope.to[0].address
                            }
                            if (res[1][i].email == message.envelope.to[0].address) {
                                direction = 2
                                from = message.envelope.from[0].address
                                to = message.envelope.to[0].address
                            }
                        }
                        responseToServer = {
                            [res[2]]: [{
                                bodyOfEmail: myMimeNodes.childNodes[0].childNodes[0].content,
                                attachement: attachements,
                                profile_ids: profile_ids,
                                direction: direction,
                                from: from,
                                to: to
                            }]
                        }
                        // console.log(responseToServer, 'responseToServer')
                        if (err) throw err;
                    } else {
                        // console.log(`${box} has no matches`)
                    }
                } catch (e) {
                    console.log('Error while emailFetching ' + e)
                }
            })
        }
    } catch (e) {
        console.log('Error while inside listing ' + e)
    }
    // console.log(responseToServer, 'responseToServer')
    return responseToServer
}
module.exports = list