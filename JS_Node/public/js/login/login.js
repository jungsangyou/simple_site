$(document).ready(function(){

	$("#loginBtn").click(function(){
		var lgnId = $("#lgnId").val();
		var password = $("input[pos_id]").val();
		
		if(lgnId == null || password == null || lgnId == '' || password == ''){
			alert("ID 또는 PASSWORD를 입력해 주세요 ");
			return;
		}
		
		$.ajax({
		    url: '/api/authenticate/',
		    type: 'GET',
		    data : {loginId : lgnId, password : password},
		    success: function(data, status, xhr) {
		    	console.log(data);
		    	if(data != null && data != ''){
		    		if(data.admin){
		    			location.replace('/admin');
		    		}else{
		    			location.replace('/home/main');
		    		}
		    	}else{
		    		alert("ID 또는 PASSWORD를 확인해주세요");
		    	}
		    }
		 });
		
	});

	
	
})