var StopAtDoc = {};
StopAtDoc.login = function(){
	var collectData = function(){
		var email = document.getElementById("email"),
			password = document.getElementById("password");

		loginAction(email.value, password.value);
	};

	var loginAction = function(email, password){
		var section = document.getElementsByTagName("section")[0];
		$.ajax({
		    url:"http://dev.stopatdoc.com/user/login", 
		    dataType: 'json',
		    beforeSend: function(){
		    	section.style.opacity = 0.1;
		    	$("#loader-view").show();
		    },
		    data:{params:{"user_id":email,"password":password}}, 
		    type:"POST", 
		    success:function(data){
		    	$("#loader-view").hide();
		    	section.style.opacity = 1;
		    	postLogin(data);
		    }
		});
	};

	var postLogin = function(data){
		if(data.error==0){
			var data = data.data;
			populateUserView(data);
		}else{
			errorView();
		}

	};

	var getFullDate = function(dateInMS){
		console.log(dateInMS);
		var date = new Date(parseInt(dateInMS)),
			monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
		console.log(date);
		console.log(date.getDate()+"-"+monthArr[date.getMonth()]+"-"+date.getFullYear());
		return date.getDate()+"-"+monthArr[date.getMonth()]+"-"+date.getFullYear();
	}

	var populateUserView = function(data){
		_.templateSettings = {
		  interpolate: /\{\{(.+?)\}\}/g
		};
		var temp = document.getElementById("userViewTemp").text,
			DOM = document.getElementById("main-section"),
	        parsed = _.template(temp,{
				"uid":data.uid,
				"name":data.first_name+" "+data.last_name,
				"email":data.mail
			}),
			past_Appointment_temp = document.getElementById("pastAppointmentTemp").text,
			parsedTemp = [];
		_.each(data.past_appointments, function(appointment_data){
			parsedTemp.push(
				_.template(past_Appointment_temp,{
					"src":appointment_data.image,
					"date":getFullDate(appointment_data.date),
					"name":appointment_data.first_name+" "+appointment_data.last_name	
				})
			)
		});
		DOM.innerHTML = parsed+parsedTemp;
	}

	return({
		'collectData': collectData
	});
}

var login_btn = document.getElementById("login-btn");
login_btn.addEventListener('click', function(e){
	new StopAtDoc.login().collectData();
});