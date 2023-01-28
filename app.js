//jshint esversion: 6
const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https");
require("dotenv").config();


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html")
})



app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const phoneNumber = req.body.phoneNumber
    const email = req.body.email;
    const status = "subscribed"
    const data = {
        members: [
            {
                email_address: email,
                status: status,
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                    PHONE: phoneNumber
                }
            }
        ]
    }

    const options = {
        method: "POST",
        auth: `danielapassos:`+process.env.MAILCHIMP_KEY
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us1.api.mailchimp.com/3.0/lists/2a9485bf9c"

    const request = https.request(url,options, function(response){

        if (response.statusCode === 200){
            const phoneNumber = req.body.phoneNumber
            res.sendFile(__dirname + "/success.html")

        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        
        response.on("data", function(data){
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData)
    request.end();

})

app.post("/failure", function(req, res){
})


app.post("/success", function(req, res){
    res.redirect("/")

})

app.listen(3000, function(){
    console.log("Server is running on port 3000")
})
