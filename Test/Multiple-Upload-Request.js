var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
var data = new FormData();
data.append('operations', '{"query":"mutation($files:[Upload!]!) {multipleUploadFile(files: $files){url}}", "variables": { "files": [null, null] }}');
data.append('map', '{"0": ["variables.files.0"], "1": ["variables.files.1"]}');
data.append('0', fs.createReadStream('../Images/ConferenceRoom.jpg'));
data.append('1', fs.createReadStream('../Images/Yey.jpg'));

var config = {
    method: 'post',
    url: 'http://localhost:4000/graphql',
    headers: {
        ...data.getHeaders()
    },
    data: data
};

axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
