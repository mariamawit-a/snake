const path = require('path')
const express = require('express')
const app = express()

app.use(express.static('public'))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public', 'index.html'))
})
 
app.listen(3000, () => console.log('running on port 3000'))

