const express = require('express'),

		  bodyParser = require('body-parser'),
		  
		  fs = require('fs'),

	    app = express()
	  
app.use(express.static('static'))

app.use(bodyParser.urlencoded({extended:true}))

/*
 * 登录接口
 */
app.post('/user/login',(req,res)=>{
	
	var userName = req.body.userName
	
	var filePath = `users/${userName}.txt`
	
	fs.exists(filePath,(isExists)=>{
		
		if(isExists){
			
			//用户名存在,即代表用户名正确
			
			//接下来读取该文件
			fs.readFile(filePath,(err,data)=>{
				if(err){
					
					res.status(200).json({result:0,msg:'系统异常,请稍后重试!'})
				}
				else{
					
					data = JSON.parse(data) 
					
					var psw = data.psw[0]
					
					if(psw == req.body.psw){
						
						//密码正确,登录成功
						
						//登录成功之后把用户名保存在cookie中,退出登录之后在清除该cookie.
						//该cookie会被放在响应头发送给浏览器,浏览器读取后会保存在浏览器的cookie
						res.cookie('userName',userName)
						
						res.status(200).json({result:1,msg:'登录成功!'})
					}
					else{
						res.status(200).json({result:0,msg:'密码出错了!'})
					}
				}
			})
		}
		else{
			
			res.status(200).json({result:0,msg:'该用户还未注册！'})
		}
	})
})

/*
 * 注册接口
 */
app.post('/user/register',(req,res)=>{
	
	var userName = req.body.userName
	
	//users/roy.txt
	var filePath = `users/${userName}.txt`
	
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
					
					res.status(500).json({result:2,msg:'服务端出错了'})
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
