const path = require('path')
const express = require('express')

const app = express()

//Set static folder
app.use(express.static(path.join(__dirname, 'assets')))
console.log(path)

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
