(async function () {
  const ImapClient = require('emailjs-imap-client')
  const list = require('./list')
  const search = require('./search')
  process.on('message', async data => {
    let client = new ImapClient.default(data[1].host, 993, {
      auth: {
        user: data[1].user,
        pass: data[1].password,
      }
    })
    client.logLevel = client.LOG_LEVEL_NONE; // Закоментить если необходимы детальные логи
    try {
      //   count++
      await client.connect() //  подключение к серверу, выводит ошибку после трех неудачных попыток
    } catch (e) {
      console.log('Error while connecting ' + e)
    }
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
    let chunkedArrNames = chunkify(data[0], 4, true)
    let firstSearch = await search(client, chunkedArrNames[0])
    let secondSearch = await search(client, chunkedArrNames[1])
    let thirdSearch = await search(client, chunkedArrNames[2])
    let fourthSearch = await search(client, chunkedArrNames[3])
    if (firstSearch && secondSearch && thirdSearch && fourthSearch !== undefined) {
      // console.log(firstSearch, 'firstSearch',data[2])
      // console.log(secondSearch, 'secondSearch',data[2])
      // console.log(thirdSearch, 'thirdSearch',data[2])
      // console.log(fourthSearch, 'fourthSearch',data[2])
      let result = [...firstSearch, ...secondSearch, ...thirdSearch, ...fourthSearch]
      // console.log(result,data[2])
      if (result.length !== 0) {
        let chunked = chunkify(result, 4, false)
        let listResult1 = await list(client, chunked[0], data[2])
        let listResult2 = await list(client, chunked[1], data[2])
        let listResult3 = await list(client, chunked[2], data[2])
        let listResult4 = await list(client, chunked[3], data[2])
        // console.log(listResult1, 'listResults1',data[2])
        // console.log(listResult2, 'listResults2',data[2])
        // console.log(listResult3, 'listResults3',data[2])
        // console.log(listResult4, 'listResults4',data[2])
        let final = []
        if (listResult1 !== undefined) {
          final.push(listResult1)
          console.log(final, 'final')
          process.send(final)
        }
        if (listResult2 !== undefined) {
          final.push(listResult2)
          console.log(final, 'final')
          process.send(final)
        }
        if (listResult3 !== undefined) {
          final.push(listResult3)
          console.log(final, 'final')
          process.send(final)
        }
        if (listResult4 !== undefined) {
          final.push(listResult4)
          console.log(final, 'final')
          process.send(final)
        }
      }
    }
  })
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