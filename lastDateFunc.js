const lastDateFunc = async () => {
  var start = new Date();
  var startTime = start.getTime();
  var fs = require('fs');
  let year = new Date().getFullYear()
  let month = new Date().getMonth()
  let date = new Date().getDate()
  let hour = new Date().getHours()
  let minutes = new Date().getMinutes()
  let dateArr = [year, month, date, hour, minutes]
  fs.writeFile('callDate.json', JSON.stringify(dateArr), 'utf8', function (err) {
    if (err) throw err;
    var end = new Date();
    var endTime = end.getTime();
    var timeTaken = endTime - startTime;
    console.log('Execution time is : ' + timeTaken);
  })
}
module.exports = lastDateFunc