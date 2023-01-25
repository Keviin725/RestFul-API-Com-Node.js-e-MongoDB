// configuracao inicial
const express = require('express')
const mongoose = require('mongoose')
const app = express()
require('dotenv').config()



// Ler o JSON / midddlewares
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

// rotas da API
const router = require('./routes/routes')

app.use('/person', router)

// rota inicial / endpoint
app.get('/', (req, res) =>{

    res.json({message: 'First Request!'})
})

//mongodb+srv://kevin:12345@clusterapi.pk8p6ev.mongodb.net/apidatabase?retryWrites=true&w=majority

// entregar uma porta
const DB_USER = process.env.DB_USER
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@clusterapi.pk8p6ev.mongodb.net/?retryWrites=true&w=majority`)
.then(() =>{
    console.log("Rocket Launched Successfully! 🚀")
    app.listen(3000)
})
.catch((err) => console.log(err))