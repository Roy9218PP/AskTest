
//获取cookie缓存的userName属性值
//$.cookie()是jQuery提供的操作cookie的方法(注意需要使用jQuery的cookie插件:jquery.cookie.js)
var userName = $.cookie('userName')

//判断是否有该cookie，来决定用户当前是否处于登录状态
if(userName){
	
	$('#userName').text(userName)
}
else{
	
	$('.dropdown-menu').remove()

}

//alert(userName)
//提问按钮点击
$('#goToAsk').click(function(){
	
	if(userName){
		//去提问页面
		location.href = '/ask.html'
	}
	else{
		
		location.href = '/login.html'
	}
})

//登录按钮点击
$('#goLogin').click(function(){
	
	if(!userName){
		
		location.href = '/login.html'
	}
	
})
