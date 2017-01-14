
$('#goBack').click(function(){
	
	history.back()
})

document.forms[0].onsubmit = function(e){
	
	e.preventDefault()
	
	//过滤输入内容
	var result =  $('textarea').val().replace(/</g,'&lt;')
   
	result = result.replace(/>/g,'&gt;')

	
	$.post('/user/askQuestion',{content:result,userName:$.cookie('userName')},function(response,statusText,xhr){
		
		if(response.result == 0){
			
			//提交失败
			$('#myModal').modal('show').find('.modal-body').text(response.msg)
		}
		else{
			//提交成功
			$('#myModal').modal('show').find('.modal-body').text(response.msg)
			
			//跳转首页
			$('#myModal').on('hidden.bs.modal',function(){
				
				location.href = '/'
			})
		}
	})
}
