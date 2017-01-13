const express = require('express'),

	  app = express()
	  
app.use(express.static('static'))

/*
 * 注册接口
 */
app.post('/user/register',(req,res)=>{
	
})
app.listen(3000,function(){
	
	console.log('server running...')
})
