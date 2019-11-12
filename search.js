const search = async (client, arrNames) => {
    let date
    try {
        callDate = require('./callDate.json') // Запрос на получение последней даты вызова программы, если такой файл имеется
        date = new Date(callDate[0], 7, callDate[2], callDate[3], callDate[4], 0, 0)
    } catch (e) {
        date = new Date(Date.now() - 10 * 86400000) // Если файла нет то отсчитать десять дней назад с текущего момента
    }
    let len = arrNames.length
    let arrWithMails = []
    for (let y = 0; y < len; y++) {
        try {
            // console.log(`searching in ${arrNames[y]}`)
            let boxWithMail = await client.search(`${arrNames[y]}`, { since: date }) // Итерируем через массив директории и проверяем на наличие писем с определенной даты
            if(boxWithMail.length !== 0){
                arrWithMails.push(arrNames[y])
            }
        } catch (e) {
            console.log('Error while searching ' + e)
        }
    }
    return arrWithMails
}
module.exports = search