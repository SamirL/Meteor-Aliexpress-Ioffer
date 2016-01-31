Template.logoutButton.events({
	'click #logout1' : function(e){
		Meteor.logout();
	}
})