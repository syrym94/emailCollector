const emails = async () => {
    const axios = require('axios');
    var FormData = require('form-data');
    var data = new FormData();
    let owner_id = 1
    data.append("owner_id", "1");
    data.append("profiles_types_ids", "1,3,4");
    let response = await axios({
        method: 'post',
        url: 'https://my.zoomiya.com/index.php',
        params: {
            'option': 'com_crm',
            'task': 'nodeemailcollector.getRelatedEmails'
        },
        headers: {
            'Content-Type': `multipart/form-data; boundary=${data.getBoundary()}`,
            'client_platform': 'emailparser',
            'client_version': '1.0',
            'key': 'ZoomEmailParese+++!Go',
            "Accept": "*/*",
        },
        data: data
    })
    let emails = []
    let values = Object.values(response.data.data.value)
    values.forEach(value => {
        if (value.email) {
            if (value.email.includes(' ')) emails.push(value.email.split(' '))
            else if (value.email.includes(', ')) emails.push(value.email.split(', '))
            else emails.push(value.email)
        }
    })
    let merged = [].concat.apply([], emails);
    return [merged,values,owner_id]
}
module.exports = emails