$(document).ready(function(){

	$("#loginBtn").click(function(){
		var lgnId = $("#lgnId").val();
		var password = $("input[pos_id]").val();
		
		if(lgnId == null || password == null || lgnId == '' || password == ''){
			alert("로그인ID 또는 Password를 등록 해 주세요 ");
			return;
		}
		
		$.ajax({
		    url: '/api/authenticate/',
		    type: 'GET',
		    data : {loginId : lgnId, password : password},
		    success: function(data, status, xhr) {
		    	console.log(data);
		    	if(data != null){
		    		location.replace('/home/main');
		    	}else{
		    		alert("로그인실패");
		    	}
		    }
		 });
		
	});

	
	
})