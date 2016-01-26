$(document).ready(function(){

	$("#submitBt").click(function(){
		var count = 0;
		
		for(var i=0; i<$("[checkOption]").length; i++){
			if($("[checkOption]").eq(i).val() == '' || $("[checkOption]").eq(i).val() == null){
				alert("필수 항목을 모두 입력 해주세요 ");
				return false;
			}
		}
		var param = { 
					  loginId: $("#loginId").val(),
					  userName: $("#userName").val(),
					  age: $("#age").val(),
					  orgName: $("#orgName").val(),
					  password: $("#password").val(),
					  admin: $("#adminChk").val() 
		}
		$.ajax({
		    url: '/api/addUser/',
		    type: 'POST',
		    data : param,
		    success: function(data, status, xhr) {
		    	if(data.loginId != '' && data.loginId != null){
		    		alert('add success!');
		    	}
		    }
		 });
		
	});

	
	
})