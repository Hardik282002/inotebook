const mongoose=require("mongoose");
const mongoURL="mongodb+srv://sindhwanihardik806:kW4p4hQVIUaeRdpU@cluster0.4z2u75s.mongodb.net/inotebookdb";
const connectToMongo=()=>{
    mongoose.connect(mongoURL)
    .then(function () {
        console.log("connected to db");
    })
}
module.exports=connectToMongo;
