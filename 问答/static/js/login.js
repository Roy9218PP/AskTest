//单击右边按钮，跳转注册页面
$('#goRgister').click(function(){
	
	location.href = '/register.html'
})

$('#goBack').click(function(){
	
	history.back()
})

document.forms[0].onsubmit = function(e){
	
	e.preventDefault()
	
	var data = $(this).serialize()
	
	$.post('/user/login',data,function(response,statusText,xhr){
		
		
		if(response.result == 0){
			
			//登录失败
			$('#myModal').modal('show').find('.modal-body').text(response.msg)
			
		}
		else{
			
			//登录成功
			$('#myModal').modal('show').find('.modal-body').text(response.msg).end().on('hidden.bs.modal',function(){
				location.href = '/'
			})
			
			
		}
		
	})
}
