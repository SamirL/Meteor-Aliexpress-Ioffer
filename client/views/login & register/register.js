Template.register.events({
	'submit #form' : function(e){
		e.preventDefault();

		var email = $('#email').val();
		var password = $('#password').val();
		var level = 2;


		Accounts.createUser({
			email: email,
			password: password,
			profile : {
				level : level
			}
		});
	}
});
