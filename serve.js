import express from 'express'

const site = express()
app.use(express.json())

const user = []

app.post('/usuarios', (req, rsp) =>{

})

site.get('/usuarios', (req, res) =>{
    res.send('Tudo certo')
})

site.listen(3000)