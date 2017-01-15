const express = require('express'),

	bodyParser = require('body-parser'),

	fs = require('fs'),
	
	//加载cookie-parser模块，该模块可以直接对cookie数据进行解析
	cookieParser = require('cookie-parser'),
	
	multer = require('multer'),
	
	mystorage = multer.diskStorage({
		//设置上传路径
		destination:function(req,files,callback){
			
			callback(null,'static/avatar/')
		},
		//设置文件重命名
		filename:function(req,files,callback){
		
			//从cookie中获取用户名
			var userName = req.cookies.userName
			
			callback(null,`${userName}.jpg`)
		}
	}),
	
	upload =  multer({storage:mystorage}),
	
	app = express()

app.use(express.static('static'))

app.use(bodyParser.urlencoded({
	extended: true
}))

app.use(cookieParser())

/*
 * 上传头像
 */

app.post('/user/uploadAvatar',upload.single('avatar'),(req,res)=>{
	
	fs.readdir('static/avatar',(err,data)=>{
		
		if(err){
			res.status(200).json({result:0,msg:'系统异常!'})
		}
		else{
			console.log(req.cookies)
			
			var userName = req.cookies.userName
			
			var fileName = `${userName}.jpg`
			
			var isOk = false
			
			for(var index in  data){
				
				var aAvatar = data[index]
				
				console.log(aAvatar)
				
				if(aAvatar == fileName){
					
					res.status(200).json({result:1,msg:'上传头像成功!'})
					isOk = true
				}
				else{
					
					if(index == data.length-1){
						
						console.log('>>>>>>>>>>>')
						if(isOk == false){
							res.status(200).json({result:0,msg:'上传头像失败!'})
						}
						
					}
				}
			}
		}
	})
	
	
})


/*
 * 退出登录
 */
app.get('/user/signOut',(req,res)=>{
	
	//清除cookie
	res.clearCookie('userName')
	
	res.status(200).json({result:1,msg:'退出登录成功'})
})
/*
 * 回复接口
 */
app.post('/user/reply',(req,res)=>{
	
	var content = req.body.content
	
	var userName = req.body.userName
	
	
	//获取提问时间。找到保存该问题的文件
	var times = req.body.times
	
	console.log(times)
	//拼接文件路径
	var filePath = `allQuestions/${times}.txt`
	
	fs.exists(filePath,(isExists)=>{
		
		if(!isExists){
			
			console.log('--------')
			res.status(200).json({result:0,msg:'系统异常!'})
		}
		else{
			
			fs.readFile(filePath,(err,data)=>{
				
				if(err){
					
					console.log('===========')
					res.status(200).json({result:0,msg:'系统异常!'})
				}
				else{
					
					//转化为js对象
					data = JSON.parse(data)
				
					//获取存放回复的数组
					var reply = data.reply
				
					var replyOptions ={
					
					userName,
					content,
					date:new Date(),
					ip:req.ip
					
					}
				
					//存入回复的数组
					reply.push(replyOptions)
					
					//往文件中重新写入数据
					fs.writeFile(filePath,JSON.stringify(data),(err)=>{
						if(err){
							res.status(200).json({result:0,msg:'回复失败'})
						}
						else{
							
							res.status(200).json({result:1,msg:'回复成功!'})
						}
					})
					
				}
				
				
				
			})
		}
	})
	
})


/*
 * 获取所有提问
 */
app.get('/getAllQuestion', (req, res) => {

	fs.exists('allQuestions', (isExists) => {

		if(!isExists) {

			res.status(200).json({
				result: 0,
				msg: '没有提问信息!'
			})

		} else {

			//fs.readdir读取文件夹
			fs.readdir('allQuestions', (err, data) => {

				if(err) {
					console.log('-----------')
					res.status(200).json({
						result: 0,
						msg: '系统出错!'
					})
				} else {

					//用来保存所有提问
					var allMsg = []

					var count = 0

					//遍历allQuestions文件夹
					for(var i=data.length-1;i>=0 ;i--) {

						//获取每一个文件
						var aMsg = data[i]
						
						console.log(aMsg)
						//读取文件
						fs.readFile(`allQuestions/${aMsg}`, (err, fileData) => {
							if(err) {
								
								res.status(200).json({
									result: 0,
									msg: '系统出错!'
								})
							} else {

								//把文件内容转化为js对象
								var aMsgObj = JSON.parse(fileData)

								//把每一条提问都放入数组
								allMsg.push(aMsgObj)

								count++

								if(count == data.length) {

									res.status(200).json({
										result: 1,
										msg: '获取成功!',
										data: allMsg
									})
								}

							}
						})

					}

				}

			})
		}
	})
})

/*
 * 提问接口
 */
app.post('/user/askQuestion', (req, res) => {

	//将提问的每一个问题 单独 保存在一个文件中，文件名是提问的时间，文件内的内容是该问题相关的用户和时间信息，还有该问题的所有回复
	var content = req.body.content

	var userName = req.body.userName

	var times = new Date().getTime()

	console.log(req.headers)

	console.log(req.headers.cookie)

	var msgOpntions = {
		userName: userName, //用户
		content: content, //提问内容
		ip: req.ip, //用户ip
		date: times, //提问的时间
		reply: [] //该提问的所有回复
	}

	var filePath = `allQuestions/${times}.txt`

	fs.exists('allQuestions', (isExists) => {

		if(!isExists) {

			fs.mkdirSync('allQuestions')
		}

		fs.appendFile(filePath, JSON.stringify(msgOpntions), (err) => {

			if(err) {

				res.status(200).json({
					result: 0,
					msg: '提问失败!'
				})
			} else {
				res.status(200).json({
					result: 1,
					msg: '提问成功!'
				})
			}
		})
	})

})

/*
 * 登录接口
 */
app.post('/user/login', (req, res) => {

	var userName = req.body.userName

	var filePath = `users/${userName}.txt`

	fs.exists(filePath, (isExists) => {

		if(isExists) {

			//用户名存在,即代表用户名正确

			//接下来读取该文件
			fs.readFile(filePath, (err, data) => {
				if(err) {

					res.status(200).json({
						result: 0,
						msg: '系统异常,请稍后重试!'
					})
				} else {

					data = JSON.parse(data)

					var psw = data.psw[0]

					if(psw == req.body.psw) {

						//密码正确,登录成功

						//登录成功之后把用户名保存在cookie中,退出登录之后在清除该cookie.
						//该cookie会被放在响应头发送给浏览器,浏览器读取后会保存在浏览器的cookie
						res.cookie('userName', userName)

						res.status(200).json({
							result: 1,
							msg: '登录成功!'
						})
					} else {
						res.status(200).json({
							result: 0,
							msg: '密码出错了!'
						})
					}
				}
			})
		} else {

			res.status(200).json({
				result: 0,
				msg: '该用户还未注册！'
			})
		}
	})
})

/*
 * 注册接口
 */
app.post('/user/register', (req, res) => {

	var userName = req.body.userName

	//users/roy.txt
	var filePath = `users/${userName}.txt`

	fs.exists(filePath, (isExists) => {

		if(isExists) {

			//已经注册
			res.status(200).json({
				result: 0,
				msg: '该用户名已经被使用'
			})
		} else {

			var userMsg = {
					psw: req.body.psw,
					email: req.body.email,
					sex: req.body.sex,
					course: req.body.course
				}
				//没有注册
			fs.appendFile(filePath, JSON.stringify(userMsg), (err) => {

				if(err) {

					res.status(500).json({
						result: 2,
						msg: '服务端出错了'
					})
				} else {

					res.status(200).json({
						result: 1,
						msg: '注册成功'
					})

				}
			})
		}
	})

})
app.listen(3000, function() {

	console.log('server running...')
})