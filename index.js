const express = require('express')
const app = express()


app.get('/', (req, res) => {
   res.send('Debug')
})


app.listen(5000)