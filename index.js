const express = require('express')
const app = express()
const PORT = process.env.PORT || 4140

app.get('/', (req, res) => {
   res.send('This is index')
})


app.get('/auto_xp', (req, res) => {
   res.send('Auto xp')
})

app.get('/auto_fight_hideout', (req, res) => {
   res.send('Auto fight hideout')
})



app.listen(PORT, () => {
   console.log(`Server started on port ${PORT}`)
})