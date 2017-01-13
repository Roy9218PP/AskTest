const express = require('express'),

		  bodyParser = require('body-parser'),
		  
		  fs = require('fs'),

	    app = express()
	  
app.use(express.static('static'))

app.use(bodyParser.urlencoded({extended:true}))

/*
 * 注册接口
 */
app.post('/user/register',(req,res)=>{
	
	var userName = req.body.userName;
	
	var filePath = `users/${userName}.txt`;
	
	fs.exists(filePath,(isExists)=>{
		
		if(isExists){
			
			//已经注册
			res.status(200).json({result:0,msg:'该用户名已经被使用'})
		}
		else{
			
			var userMsg = {
				psw:req.body.psw,
				email:req.body.email,
				sex:req.body.sex,
				course:req.body.course
			}
			//没有注册
			fs.appendFile(filePath,JSON.stringify(userMsg),(err)=>{
				
				if(err){
					
					res.status(500).json({result:0,msg:'服务端出错了'})
				}
				else{
					
					res.status(200).json({result:1,msg:'注册成功'})
					
				}
			})
		}
	})
	
})
app.listen(3000,function(){
	
	console.log('server running...')
})
