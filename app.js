//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
require('dotenv').config(); // Load environment variables

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = `https://us14.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}`;

    const option = {
        method: "POST",
        auth: `amogh:${process.env.MAILCHIMP_API_KEY}`
    };

    const request = https.request(url, option, (response) => {
        if(response.statusCode == 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});
