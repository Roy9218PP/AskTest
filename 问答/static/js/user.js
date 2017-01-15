
var uploadFile = null

$('#goBack').click(function(){
	
	history.back()
})
$('#avatarBox').bind('drop',function(e){
	
	//e.stopPropagation可以防止在新的页面打开图片文件
	e.stopPropagation()
	//alert('松手了')
	//从drop事件中获取拖拽的文件
	var files = e.originalEvent.dataTransfer.files
	
	uploadFile = files[0]
	
	checkFileype()
})
/*
 * onchange()当输入框内内容改变的时候触发的事件
 */
$('input[type=file]').change(function(){
	
	//alert('改变了')
	//files属性是文件选择框input的一个属性，用来获取选择的所有文件，这些文件被放在一个叫做FileList的集合对象中。该集合对象就类似于NodeList。
	var files = this.files
	
	console.dir(this)
	//获取选择的文件
	uploadFile = files[0]
	
	console.dir(uploadFile)
	
	checkFileype()
})

/*
 * 判断文件的格式，并且读取文件
 */
function checkFileype(){
	if(!/image\/\w+/g.test(uploadFile.type)){
		
		$('#myModal').modal('show').find('.modal-body').text('请选取格式为jpg/png的图片文件')
		
		$('#sendAvatar').hide()
		return
	}
	else{
		$('#sendAvatar').show()
	}
	
	
	
	if(typeof(FileReader) == undefined){
		
		$('#myModal').modal('show').find('.modal-body').text('当前浏览器不支持!请升级浏览器版本为最新版本.')
		
		return
	}
	//fileReader是系统提供的一个文件读取器
	var fileReader = new FileReader()
	
	//onload()是文件读取器读取文件成功后调用的方法(即readAs...方法调用后触发的方法)
	fileReader.onload = function(){
		
		//fileReader.result获取读取后的结果
		$('#avatarBox').css('background-image','url('+fileReader.result + ')').find('span').text('')
	}
	
	//该方法readAsDataURL()是把某一个文件读取为文件地址
	fileReader.readAsDataURL(uploadFile)
}
$('#sendAvatar').click(function(){
	
	var data = new FormData()
	
	data.append('avatar',uploadFile)
	
	var xhr = new XMLHttpRequest()
	
	xhr.onreadystatechange = function(){
		
		if(xhr.readyState == 4){
			
			var response = JSON.parse(xhr.responseText)
			
			$('#myModal').modal('show').find('.modal-body').text(response.msg)
			
			if(response.result == 1){
				
				$('#myModal').on('hidden.bs.modal',function(){
					location.href = '/'
				})
			}
		}
	}
	
	xhr.open('POST','/user/uploadAvatar')
	
	xhr.send(data)
})
