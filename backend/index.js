const connectToMongo=require("./db")
const express=require("express");
const bodyparser = require("body-parser");
const cors=require("cors")
const app=express();
connectToMongo();
app.use(express.json());
app.use(cors())
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.send("hello world");
})

app.use("/api/auth",require("./routes/auth"))
app.use("/api/notes",require("./routes/notes"))

app.listen(5000,function(req,res){
       console.log("listening at port 5000");
})
