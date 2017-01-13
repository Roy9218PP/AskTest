document.forms[0].onsubmit = function(e){
	
	e.preventDefault()
	
	//获取两个密码框内的内容
	var allPsw = []
	
	$(':password').each(function(){
		
		allPsw.push($(this).val())
	})
	
	if(allPsw[0] != allPsw[1]){
		
		//alert('两次密码输入的不一致')
		//弹出模态框，并设置显示内容
		$('#myModal').modal('show').find('.modal-body').text('两次密码输入的不一致,请确认后重新提交。')
	}
	
	
}
