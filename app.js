const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing"); // you need to add dependency first. See tips.
const app = express();
// add static page to node js....
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html")
 })

 client.setConfig({
  apiKey: "0494ee1477b1aefc4b163a4d96e3e5cc-us12",
  server: "us12",
});
// this is what the hwere the user will fill up the form
 app.post("/" , function(req,res){

   const firstName = req.body.fname;
   const lastName = req.body.lname;
   const email = req.body.email;

   const subscribingUser = {
     firstName: firstName,
    lastName: lastName,
    email: email
  }

//from mailchimp server
  const run = async () => {
   try {
     const response = await client.lists.addListMember("219fd9eceb", {
       email_address: subscribingUser.email,
       status: "subscribed",
       merge_fields: {
         FNAME: subscribingUser.firstName,
         LNAME: subscribingUser.lastName
       }
     });
     console.log(response);
     //response if succesfull
     res.sendFile(__dirname + "/success.html");
   } catch (err) {
     console.log(err.status);
     //response if failed
     res.sendFile(__dirname + "/failure.html");
   }
 };

 run();
});

app.post("/failure", function(req, res) {
 res.redirect("/");
});


app.listen(process.env.PORT || 3000, function(){
  console.log("server is running on port 3000")
})

// APIs key of chimpmail
// 0494ee1477b1aefc4b163a4d96e3e5cc-us12
// list ID:
// 219fd9eceb.
