const router = require('express').Router()
const Person = require('../models/Person')

// criacao dos dados
router.post('/', async(req, res) =>{

    //req.body
    const{name, age, approved, cellphone, address} = req.body

    if(!name){
        res.status(422).json({error: 'O nome e obrigatorio'})
        return
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
// Retornar dado pelo id
router.get('/:id', async(req, res) =>{

    // extrair o dado da requisicao pela url == req.params
    const id = req.params.id

    try {
      const person = await Person.findOne({_id: id})

        if(!person){
            res.status(422).json({message: 'Pessoa nao encontrada'})
            return
        }
        
      res.status(200).json(person)

    } catch (error) {
        res.status(500).json({error: error})
    }
})

module.exports = router