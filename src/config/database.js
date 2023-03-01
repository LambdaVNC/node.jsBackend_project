const mongoose = require("mongoose");
// const dotenv = require("dotenv");
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING) 
  .then((res) => { 
    console.log("DB CONNECTİON İS DONE!");
  })
  .catch((err) => {
    console.log("Bir hata cikti : " + err);
  });
