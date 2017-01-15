//获取cookie缓存的userName属性值
//$.cookie()是jQuery提供的操作cookie的方法(注意需要使用jQuery的cookie插件:jquery.cookie.js)
var userName = $.cookie('userName')

//判断是否有该cookie，来决定用户当前是否处于登录状态
if(userName) {

	$('#userName').text(userName)
} else {

	$('.dropdown-menu').remove()

}

//alert(userName)
//提问按钮点击
$('#goToAsk').click(function() {

	if(userName) {
		//去提问页面
		location.href = '/ask.html'
	} else {

		location.href = '/login.html'
	}
})

//登录按钮点击
$('#goLogin').click(function() {

	if(!userName) {

		location.href = '/login.html'
	}

})
//退出登录
$('#signOut').click(function(){
	
	$.get('/user/signOut',function(response,statusText,xhr){
		if(response.result == 1){
			
			location.href = '/login.html'
		}
	})
})

//回复按钮点击(注意此处需要使用事件委托，因为jQuery不能对新添加的元素绑定事件)
$('#contentBox').delegate('.sendMsg','click',function(){
		
	if(!userName) {
		//去登录页面
		location.href = '/login.html'
		
		return
	} 
	
	//取出回复内容
	var content = $(this).siblings('textarea').val()

	//过滤回复内容
	content = content.replace(/</g, '&lt;')

	content = content.replace(/>/g, '&gt;')

	//取出问题提问的时间
	var times = $(this).parents('.userState').data('date')

	var data = {
		userName,
		content,
		times
	}

	$.post('/user/reply', data, function(response, statusText, xhr) {

		if(response.result == 0) {

			$('#myModal').modal('show').find('.modal-body').text(response.msg)
		}
		else{
			
			$('#myModal').modal('show').find('.modal-body').text(response.msg).end().on('hidden.bs.modal',function(){	
			//刷新页面
			location.reload()
				
			})
			
			
			
		}
	})
})


$(function() {

	//获取所有提问
	$.get('/getAllQuestion', function(response, statusText, xhr) {

		//alert(response.data)
		var html = template('myTemplate', response)

		$('#contentBox').get(0).innerHTML = html

		//document.querySelector('#contentBox').innerHTML = html
	})
})