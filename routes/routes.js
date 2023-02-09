require('dotenv').config()
const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// criacao do user
router.post('/auth/register', async(req, res) =>{

    //req.body
    const{name, email, age, cellphone, address, password, confirmPassword} = req.body

    //Validations
    if(!name){
        return res.status(422).json({error: 'O nome e obrigatorio'})
        
    }
    if(!email){
        return res.status(422).json({error: 'O email e obrigatorio'})
        
    }
    if(!age){
        return res.status(422).json({error: 'A idade e obrigatoria'})
        
    }
    if(!cellphone){
        return res.status(422).json({error: 'O numero de telefone e obrigatorio'})
        
    }
    if(!address){
        return res.status(422).json({error: 'O endereço e obrigatorio'})
        
    }
    if(!password){
        return res.status(422).json({error: 'A senha e obrigatoria'})
        
    }
    if (password !== confirmPassword) {
        return res.status(422).json({error: 'As senhas devem ser iguais'})
    }

    // Verificar se o user existe
    const userExists = await User.findOne({ email: email })

    if (userExists) {
        return res.status(422).json({error: 'Este email ja existe, utilize outro'})
    }

    // Criar senha
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)
    
    // objeto que recebe o corpo da requisicao
    const person = new User({
        name,
        email,
        password: passwordHash,
        age,
        cellphone,
        address,
    })

    // create
    try{
        await person.save()
        res.status(201).json({message: 'Pessoa inserida com sucesso'})

    }catch(error){
        res.status(500).json({error: error})
    }

})

//Login
router.post('/auth/login', async(req, res) =>{

    const{email, password} = req.body
    
    //validations
    if(!email){
        return res.status(422).json({error: 'O email e obrigatorio'})
        
    }
    if(!password){
        return res.status(422).json({error: 'A senha e obrigatoria'})
        
    }
    // Verificar se o user existe
    const user = await User.findOne({ email: email })

    if (!user) {
        return res.status(422).json({error: 'user nao encontrado'})
    }

    // password validation
    const verifyPassword = await bcrypt.compare(password, user.password)

    if(!verifyPassword){
        return res.status(404).json({message: 'Password Incorreta'})
    }

    try {
        const secret = process.env.SECRET
        const token = jwt.sign({
            id: user._id
        }, secret)

        res.status(200).json(token)
        
    } catch (error) {
       console.log(error)
       res.status(500).json({
        message: 'Aconteceu um erro no servidor, tente novamente mais tarde!'
       }) 
    }
})

function checkToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    
    if(!token){
        return res.status(401).json({message: 'Acesso negado'})
    }

    try {
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        
        next()
        
    } catch (error) {
        res.status(400).json({message: 'Token Invalido'})
    }
}


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
router.get('/person/:id', checkToken, async(req, res) =>{

    // extrair o dado da requisicao pela url == req.params
    const id = req.params.id

    try {
      const user = await User.findOne({_id: id})

        if(!user){
            res.status(422).json({message: 'User nao encontrada'})
            return
        }
        
      res.status(200).json(user)

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