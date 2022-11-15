const express = require('express')
const path = require('path')
const multer = require('multer')
var fs = require('fs');
const pd = require('pdf-merger-js')
const pdf = new pd()
const upload = multer({dest:'uploads/'})
const app = express()
const port = process.env.PORT || 80;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"templates/index.html"))
})

app.post('/', upload.array('pdf',15), async(req,res,next)=>{
  if(req.files.length==0){
    res.sendFile(path.join(__dirname,"templates/index.html"))
  }
  for(let i=0 ; i<req.files.length ;i++) {
    await pdf.add(path.join(__dirname,req.files[i].path))
  }
  await pdf.save('static/'+req.files[0].filename+'.pdf')
  res.download('static/'+req.files[0].filename+'.pdf')
  res.sendFile(path.join(__dirname,"templates/index.html"))
  for(let i=0 ; i<req.files.length ;i++) {
    fs.unlinkSync(path.join(__dirname,req.files[i].path));
  }
  setTimeout(()=>{
    fs.unlinkSync('static/'+req.files[0].filename+'.pdf');
  },1000*60*2)
})


app.listen(port)