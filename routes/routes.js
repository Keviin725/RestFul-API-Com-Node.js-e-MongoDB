const router = require('express').Router()
const User = require('../models/User')

// criacao dos dados
router.post('/auth/register', async(req, res) =>{

    //req.body
    const{name, email, age, cellphone, address, password} = req.body

    if(!name){
        res.status(422).json({error: 'O nome e obrigatorio'})
        return
    }
    
    // objeto que recebe o corpo da requisicao
    const person = {
        name,
        email,
        password,
        age,
        cellphone,
        address
    }

    // create
    try{

        await User.create(person)
        res.status(201).json({message: 'Pessoa inserida com sucesso'})

    }catch(error){
        res.status(500).json({error: error})
    }

})

//Leitura de dados
router.get('/', async(req, res) =>{
    try{
        const people = await User.find()
        res.status(200).json(people)
    }catch(error){
        res.status(500).json({error: error})
    }
})
// Retornar dado pelo id
router.get('/person/:id', async(req, res) =>{

    // extrair o dado da requisicao pela url == req.params
    const id = req.params.id

    try {
      const person = await User.findOne({_id: id})

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
router.put('/update/:id', async(req,res) =>{
    const id = req.params.id
    console.log(req.body)
    const{name, age, cellphone, address, email,password} = req.body
    
    const person = {
        name,
        email,
        password,
        age,
        cellphone,
        address
    }

    try {
        //console.log(person)
       const updatedPerson = await User.findByIdAndUpdate({_id: id}, person) 
       //console.log(updatedPerson)
       if (updatedPerson.matchedCount === 0) {
        res.status(422).json({message: 'Pessoa nao encontrada'})
        return
       }
       res.status(200).json(person)
    } catch (error) {
        res.status(500).json({error: error})
    }

})

// Delete 
router.delete('/remove/:id', async(req,res) => {
    const id = req.params.id

    const person = await User.findOne({_id: id})

    if(!person){
        res.status(422).json({message: 'Pessoa nao encontrada'})
        return
    }

    try {
        await User.deleteOne({_id: id})
        res.status(200).json({message: 'Pessoa deletada com sucesso'})
    } catch (error) {
        res.status(500).json({error: error})
    }
})

module.exports = router