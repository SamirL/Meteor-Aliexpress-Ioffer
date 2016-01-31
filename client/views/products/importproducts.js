Template.importproducts.events({
	'submit #form': function(e){
		e.preventDefault();
		var self = Template.instance();
		var keywords = $('#keywords').val();
		var from = $('#from').val();
		var to = $('#to').val();

		Meteor.call('aliexpressSearch', keywords, from, to, function(error, data){
			if(!error) {
				// alert(data.products[0].productTitle);
				Session.set('results', data);

				// We activate the dataTable after a little delay (quick fix)
				Meteor.setTimeout(function(){
					self.$('#dataTable').dataTable();
				},1000)
			}
			else
				alert(error)
		});
	},

	'click .saveProduct' : function(e){
		// var parent = $('this').closest('tr');

		var productTitle = $(e.target).closest('tr').find('.product-title').text().replace(/,/g, ' ');
		var productUrl = $(e.target).closest('tr').find('.product-url a').attr('href');
		var productImage = $(e.target).closest('tr').find('.product-url img').attr('src');
		var salePrice = parseFloat($(e.target).closest('tr').find('.sale-price').text().replace('US $', ''));
		var profitPourcent = 0;

		if(salePrice < 10 && salePrice > 5)
			profitPourcent = 80;
		else if(salePrice < 5)
			profitPourcent = 130;
		else
			profitPourcent = 60;

		var sellPrice = (salePrice * profitPourcent / 100 ) + salePrice;
		sellPrice = sellPrice.toFixed(2);

		if(sellPrice >= 5 && sellPrice <= 10  )
			sellPrice = 9.99;
		else if (sellPrice < 5)
			sellPrice = 9.99;
		else if ( sellPrice >= 10 && sellPrice <= 12 )
			sellPrice = 12.99;

		var productTitle = productTitle.replace(/2013|2014|2015/gi, '');
		var maxLength = 85;
		var trimmedTitle = '';
		if(productTitle.length > 85)
		{
			trimmedTitle = productTitle.substr(0, maxLength);
			trimmedTitle = trimmedTitle.substr(0, Math.min(trimmedTitle.length, trimmedTitle.lastIndexOf(" ")));
		} else {
			trimmedTitle = productTitle;
		}

		var productInfo = {
			user_id : Meteor.userId(),
			original_title : productTitle,
			product_title : trimmedTitle,
			product_url : productUrl,
			product_image : [productImage],
			product_category: '',
			image_downloaded : 0,
			buy_price : salePrice,
			sell_price : sellPrice,
			shipping : 0,
			description : '',
			quantity : 10,
			item_specifics : '',
			condition : 'new',
			product_type : ''

		};

		var doExist = Products.findOne({original_title : productTitle});
		console.log(doExist);
		if(!doExist){
			Products.insert(productInfo, function(error, result){
				if(!error)
					console.log('Product saved with ID '+ result);
				});
		} else {
			console.log('Product already exists in the database');
		}


		console.log(productInfo);
	},

	// 'click .showVariations' : function(e){
	// 	var productUrl = $(e.target).closest('tr').find('.product-url a').attr('href');
	// 	Meteor.call('aliexpressScrape', productUrl, function(error, result){
	// 		if(!error){
	// 			var imageTag = $(e.target).closest('tr').find('.product-url');

	// 			for (var i = 0; i < result.length; i++) {
	// 				$(imageTag).append('<a href="'+result[i]+'"><img src="'+result[i]+'" width="50" height="50"/></a>');
	// 			};
	// 			// alert(result);

	// 		}
	// 	})
	// }
});

Template.importproducts.onCreated(function(){
	Session.set('results', []);
});


Template.importproducts.helpers({
	hasResults: function(){

		var sessionResult = Session.get('results');
		console.log(sessionResult);
		if(sessionResult.length > 1) {
			return true;
		}
		else
			return false;

	},
	results : function(){
		return Session.get('results');
	}
})
