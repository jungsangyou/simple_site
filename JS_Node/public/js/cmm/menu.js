$(document).ready(function(){
	
	
	goMenu($("ul.menu>li").eq(0).find('a').attr('menuUrl'));
	
	function goMenu(url){
		console.log(url);
		if(!url){
			return;
		}
		$.ajax({
		    url: url,
		    type: 'GET',
		    success: function(data, status, xhr) {
		    	$("#content").html(data);
		    }
		 });
	}
	
})

