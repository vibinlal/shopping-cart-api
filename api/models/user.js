var db = require('../../config/connection')
var collection = require('../../config/collections')
const bcrypt = require('bcrypt')

module.exports = {

    doSignup: (userdata) => {
        return new Promise(async (resolve, reject) => {
            userdata.password = await bcrypt.hash(userdata.password, 10)
            console.log(userdata.password)
            db.get().collection(collection.USER_COLLECTION).insertOne(userdata).then((data) => {
                console.log(data)
                resolve(userdata._id)
            })
        })
    },

    dologin: (userdata) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userdata.email })
            if (user) {
                bcrypt.compare(userdata.password, user.password).then((status) => {
                    if (status) {
                        response.user = user
                        response.status = true
                        resolve(response)
                    }
                    else {
                        resolve({ status: false })
                    }
                })
            }
            else {
                resolve({ status: false })
            }

        })
    },

    GetUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            let loginstatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: userId })
            if (user) {
                response.user = user
                response.status = true
                resolve(response)
            }
            else {
                resolve({ status: false })
            }

        })
    },

    findUserByEmail:(EmailId)=>{
        console.log('EmailId' + EmailId)
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({email:EmailId})
            console.log(user)
            console.log('models');
            resolve(user)
        })
    }

}