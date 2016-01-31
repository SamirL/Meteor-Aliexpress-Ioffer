Template.newproduct.events({
	'submit #form' : function(e) {
		e.preventDefault();

		var productTitle = $('.product-name').val();
		var sellingPrice = $('.selling-price').val();
		var buyingPrice = $('.buying-price').val();
		

		var productSchema = {

			productTitle : productTitle,
			sellingPrice : sellingPrice,
			buyingPrice : buyingPrice
		};

		Products.insert(productSchema, onSaving);
	}
});

Template.newproduct.helpers({

});

onSaving = function(error, id){
	if(error != null)
		alert(error);

	alert(id);
}