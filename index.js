// Import required libraries and modules
const express = require("express")

require("dotenv").config()
const { connection } = require("./configs/db")
const{userRouter}=require("./routes/user.routes")
const {authenticate}=require("./middleware/auth.middleware")
const{employeeRouter}=require("./routes/employee.routes")
const cors=require("cors")

// Create an Express application
const app = express()

app.use(express.json())
app.use(cors())

// Define a basic route for the root endpoint
app.get("/", async (req, res) => {
    res.send(`<h1 style="text-align: center; color: blue;">Wellcome Employee Management</h1>`)
    console.log("Wellcome Employee Management")
})

// Use the userRouter for user registration and login
app.use("/",userRouter)

// Use the employeeRouter for product details
app.use("/dashboard",authenticate,employeeRouter)



// Uncomment the next line if you want to add authentication middleware
app.use(authenticate);


// Start the server, listen to the specified port
app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("DataBase is connected")
    } catch (error) {
        console.log(error.message)
    }
    console.log(`server is running on port${process.env.port}`)
})