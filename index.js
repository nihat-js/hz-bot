const express = require('express')
const app = express()


app.get('/', (req, res) => {
   res.send('This is index')
})


app.get('/auto_xp', (req, res) => {
   res.send('Auto xp')
})

app.get('/auto_fight_hideout', (req, res) => {
   res.send('Auto fight hideout')
})



app.listen(5000)