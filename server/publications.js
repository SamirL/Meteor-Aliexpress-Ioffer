Meteor.publish('products', function(){
	return Products.find();
});