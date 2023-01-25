// configuracao inicial
const express = require('express')
const mongoose = require('mongoose')
const app = express()



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
const DB_USER = 'kevin'
const DB_PASSWORD = encodeURIComponent('OVeybSXZL88UR5Tf')
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@clusterapi.pk8p6ev.mongodb.net/?retryWrites=true&w=majority`)
.then(() =>{
    console.log("Server Launched Successfully! 🚀")
    app.listen(3000)
})
.catch((err) => console.log(err))