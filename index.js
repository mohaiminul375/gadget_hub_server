const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
// cors origin
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
};

// middleware
app.use(express.json());
app.use(cors(corsOptions));





// test server 
app.get('/',(req,res)=>{
    res.send('server is working')
})
app.listen(port,()=>{
console.log(`this server is running on port${port}`)
})
