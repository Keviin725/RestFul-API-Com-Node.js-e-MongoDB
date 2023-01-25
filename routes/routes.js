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

// Update - Atualizacao de dados (PUT, PATCH)
router.patch('/:id', async(req,res) =>{
    const id = req.params.id
    const{name, age, approved, cellphone, address} = req.body
    const person = {
        name,
        age,
        approved,
        cellphone,
        address
    }

    try {
       const updatedPerson = await Person.updateOne({_id: id}, person) 
       if (updatedPerson.matchedCount ===0) {
        res.status(422).json({message: 'Pessoa nao encontrada'})
        return
       }
       res.status(200).json(person)
    } catch (error) {
        res.status(500).json({error: error})
    }

})

// Delete 
router.delete('/:id', async(req,res) => {
    const id = req.params.id

    const person = await Person.findOne({_id: id})

    if(!person){
        res.status(422).json({message: 'Pessoa nao encontrada'})
        return
    }

    try {
        await Person.deleteOne({_id: id})
        res.status(200).json({message: 'Pessoa deletada com sucesso'})
    } catch (error) {
        res.status(500).json({error: error})
    }
})

module.exports = router