const express = require('express'),

	  app = express()
	  
app.use(express.static('static'))

app.listen(3000,function(){
	
	console.log('server running...')
})
