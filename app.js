const express = require('express');
const fetch = require("node-fetch");
const { response } = require('express');
const app = express();
const port = 8000;
app.set('json spaces', 2);

// to query, call: http://localhost:8000/gettoken

const cors = require("cors");
app.use(cors());

app.get('/gettoken', async function (req, res) {

    //Set up URL to query
    let url = `https://api.iq.inrix.com/auth/v1/appToken?appId=gk7vk0xrz0&hashToken=Z2s3dmsweHJ6MHw4YTJGc1A3ZEpPNmZFSVpEdFlRU3g3MWt5N05xVGNzbzU0SEg2eHFM`;

    //Set up query method
    var requestOptions = {
        method: 'GET'
    };

    //Query INRIX for token
    let response = await fetch(url, requestOptions);
    let json = await response.json();
    let output = json.result.token;

    //Return token
    res.json({
        token: output,
    });
})

//Starting server using listen function
app.listen(port, function () {
    console.log("Server has been started at " + port);
})