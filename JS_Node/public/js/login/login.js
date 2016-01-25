$(document).ready(function(){

	$("#loginBtn").click(function(){
		var lgnId = $("#lgnId").val();
		var password = $("input[pos_id]").val();
		
		if(lgnId == null || password == null || lgnId == '' || password == ''){
			alert("濡쒓렇�씤ID �삉�뒗 Password瑜� �벑濡� �빐 二쇱꽭�슂 ");
			return;
		}
		
		$.ajax({
		    url: '/api/authenticate/',
		    type: 'GET',
		    data : {loginId : lgnId, password : password},
		    success: function(data, status, xhr) {
		    	console.log(data);
		    	if(data != null && data != ''){
		    		location.replace('/home/main');
		    	}else{
		    		alert("濡쒓렇�씤�떎�뙣");
		    	}
		    }
		 });
		
	});

	
	
})