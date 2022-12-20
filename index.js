const express = require('express')
const app = express()
const PORT = process.env.PORT || 4140
const commands = require('./app')



app.get('/', (req, res) => {
   res.send('This is index')

})


app.get('/auto_xp', (req, res) => {
   commands.auto_xp()
   setTimeout(() => {
      res.send('Now we are done')
   }, 7000)
})

app.get('/auto_fight_hideout', (req, res) => {
   res.send('Auto fight hideout')
})



app.listen(PORT, () => {
   console.log(`Server started on port ${PORT}`)
})


module.exports = app