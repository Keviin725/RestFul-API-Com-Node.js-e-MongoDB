const router = require('express').Router()
const Person = require('../models/Person')

// criacao dos dados
router.post('/', async(req, res) =>{

    //req.body
    const{name, age, approved, cellphone, address} = req.body

    if(!name){
        res.status(422).json({error: 'O nome e obrigatorio'})
    }
    
    // objeto que recebe o corpo da requisicao
    const person = {
        name,
        age,
        approved,
        cellphone,
        address
    }

    // create
    try{

        await Person.create(person)
        res.status(201).json({message: 'Pessoa inserida com sucesso'})

    }catch(error){
        res.status(500).json({error: error})
    }

})

//Leitura de dados
router.get('/', async(req, res) =>{
    try{
        const people = await Person.find()
        res.status(200).json(people)
    }catch(error){
        res.status(500).json({error: error})
    }
})

module.exports = router