
$('#goBack').click(function(){
	
	history.back()
})

document.forms[0].onsubmit = function(e) {

	e.preventDefault()

	//获取两个密码框内的内容
	var allPsw = []

	$(':password').each(function() {

		allPsw.push($(this).val())
	})

	if(allPsw[0] != allPsw[1]) {

		//alert('两次密码输入的不一致')
		//弹出模态框，并设置显示内容
		$('#myModal').modal('show').find('.modal-body').text('两次密码输入的不一致,请确认后重新提交。')
	}

	//获取表单数据，并序列化为formdata格式的数据对象
	var data = new FormData(this)

	console.log(data)
		//使用jQuery发送请求，假如数据数据是从form表单内获取，则需要使用这种方式获取表单数据。它代表把表单内的数据序列化为请求体数据格式:userName=xx&psw=123456&...。
	data = $(this).serialize()

	console.log(data)

	sendToRgister(data)
}

/*
 * 发送注册请求
 */
function sendToRgister(data) {

	/*
	//方法一:使用js的ajax请求
	var xhr = new XMLHttpRequest()
	
	xhr.onreadystatechange = function(){
		
		if(xhr.readyState == 4){
			
			var response = JSON.parse(xhr.response)
			
			alert(response.msg)
		}
	}
	
	xhr.open('POST','/user/register')
	
	xhr.send(data)
	*/

	//方法二：
	//使用jQuery的post()发送请求
	$.post('/user/register',data, function(response, statusText, xhr) {

		if(response.result == 0) {

			//注册失败
			$('#myModal').modal('show').find('.modal-body').text('注册失败,该用户已经注册!')
		} 
		else if(response.result == 2){
			//注册失败
			$('#myModal').modal('show').find('.modal-body').text('系统异常,请稍后重试!')
		}
		else {
			//注册成功
			$('#myModal').modal('show').find('.modal-body').text('恭喜你,注册成功!')

			//跳转登录页面
			$('#myModal').on('hidden.bs.modal', function() {
				location.href = '/login.html'
				
			})
		}

	})

}