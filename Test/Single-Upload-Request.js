var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
var data = new FormData();
data.append('operations', '{"query":"mutation($file:Upload!) {singleUploadFile(file: $file){url}}"}');
data.append('map', '{"0": ["variables.file"]}');
data.append('0', fs.createReadStream('../Images/logo.jpg'));

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
