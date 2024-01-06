const {default:mongoose} = require("mongoose");

mongoose.set('strictQuery', false);
mongoose.connect(`mongodb://localhost:27017/digitic`)
.then(()=>{
    console.log(" Local connection successful -")
}).catch((er)=>{
    console.log("NO Connectiion")
})