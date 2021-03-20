const express = require('express');
const app = express();
const port = 3000;

app.use(express.static(__dirname + '/public')) 

app.get('/',(req,res)=>{
    res.send('XD')
})

app.listen(port,()=>{
    console.log('Servidor escuchando en el puerto',port)
})
