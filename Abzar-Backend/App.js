const express = require("express")
const app = express()
const dotenv = require("dotenv")
const cors = require("cors")
const mongoose = require("mongoose")
// const path = require("path") //try

// Routes Import
const UserRoutes = require("./routes/UserRoutes")
const AdminRoutes = require("./routes/AdminRoutes")
// Middlewares
dotenv.config()
app.use(cors())
app.use(express.json())

// Constants 
const PORT = process.env.PORT || 5000

// Routes
// app.use("/api/auth", UserRoutes)
app.use("/api/admin", AdminRoutes)
app.use("/api/staff", UserRoutes)

console.log("starting.....")
try {
    // mongoose.connect(process.env.DB_URI ,{
    //     useNewUrlParser: true, useUnifiedTopology: true 
    //   })
    mongoose.connect("mongodb://localhost:27017/abzar", {
        useNewUrlParser: true //, useiUnifiedTopology: true
      });
    // app.get('/', (req, res) => {
    //     res.sendFile(path.join(__dirname, 'build', 'index.html')) //try
    // })
    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log("MongoDB database connection established successfully");
    });
    app.get('/healthz', (req, res) => {
            res.send('Server running okey!')
    })
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}🔥`)
    })
} catch (error) {
    throw error
}

