Template.login.events({
	'submit #form' : function(e){
		e.preventDefault();
		var email = $('#email').val();
		var password = $('#password').val();

		Meteor.loginWithPassword(email, password);
	}
});