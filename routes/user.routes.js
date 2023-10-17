const express = require("express")
const { UserModel } = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userRouter = express.Router()


userRouter.post("/signup", async (req, res) => {
    const { name, email, password } = req.body
    try {
        const user = await UserModel.find({ email })
        console.log(user)
        if (user.length > 0) {
            res.send({ "msg": "user already exist" })
        } else {
            bcrypt.hash(password, 5, async function (err, hash) {
                if (err) {
                    res.send({ "msg": "Something went wrong" })
                } else {
                    const user = new UserModel({ name, email, password: hash })
                    await user.save()
                    res.status(201).send({ "msg": "new User has been register" })
                }
            })
        }
    } catch (error) {
        res.send({ "msg": "Something went wrong", "error": error.message })
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await UserModel.find({ email })
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, function (err, result) {
                if (result) {
                    let token = jwt.sign({ userID: user[0]._id }, "masai", { expiresIn: "1h" })
                    res.status(201).send({ "msg": "Sucessfully Login ", "token": token, "user": user[0]._id ,"name":user[0].name})
                }else{
                    res.send({ "msg": "Wrong Password" })
                }
            })
        } else {
            res.send({ "msg": "Wrong Creadential" })
        }
    } catch (error) {
        res.send({ "msg": "Something Went wrong", "error": error.message })
    }
})

module.exports = { userRouter }