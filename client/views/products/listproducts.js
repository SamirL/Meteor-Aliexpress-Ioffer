Template.listproducts.helpers({
	results: function(){
		return Products.find({user_id : Meteor.userId()});
	},
	imageDownloaded : function(data){
		return this.image_downloaded === data;
	},
	hasExportSession: function(){
		if(Session.get('newExport').length > 0)
			return true;
		else
			return false;
	},
	newExportSession: function(){
		return Session.get('newExport');
	}
})

Template.listproducts.events({
	'click .getVariations' : function(e){
		var self = Template.instance();
		var productId = $(e.target).closest('tr').attr('data-id');
		var productUrl = $(e.target).closest('tr').find('.product-url a').attr('href');
		var itemSpecs = $(e.target).closest('tr').find('.item-specs');
		var productTitle = $(e.target).closest('tr').find('.product-title').text();

		Meteor.call('aliexpressScrape', productUrl, 'specs', function(error, result){
			if(!error){
				Products.update({_id: productId}, {$set :{item_specifics : result } }, function(error, data){
					// itemSpecs.html(result);
					if(!error)
						itemSpecs.editable('setValue', result);
				})

			}
		})
	},
	'click .getImages' : function(e){
		var productId = $(e.target).closest('tr').attr('data-id');
		var productUrl = $(e.target).closest('tr').find('.product-url a').attr('href');
		Meteor.call('aliexpressScrape', productUrl, 'images', function(error, results){
			if(!error){
				Products.update({_id:productId}, {$set : {product_image : []}})
				for (var i = 0; i < results.length; i++) {
					Meteor.call('downloadPictures', results[i], function(error, result){
						// console.log(result);
						Products.update({_id:productId}, {$push : {product_image : result}, $set : {image_downloaded : 1}});
					});
				}


				// alert(result);

			}
		})
	},
	'click .deleteProduct' : function(e){
		var productId = $(e.target).closest('tr').attr('data-id');;

		Products.remove({_id:productId});
	},
	'click .addToExport' : function(e){

		var self = Template.instance();
		var mySessionArray = Session.get('newExport');
		var productId = $(e.target).closest('tr').attr('data-id');
		var doExist = _.some(mySessionArray, function(object){ return object._id == productId });
		console.log(productId);
		console.log(doExist);
		if(!doExist){

			var product = Products.findOne(productId);
			mySessionArray.push(product);

			Session.set('newExport', mySessionArray);

			Meteor.setTimeout(function(){
				self.$('.editable-export').editable({
					success: function(response, newValue) {
						var editable = this;
						var key = $(this).attr('data-key');
						var id = $(this).closest('tr').attr('data-id');

						var updateRecord = {};
						updateRecord[key] = newValue;

						console.log(id);
						console.log(key)

						Products.update({_id :id}, {$set : updateRecord}, function(error, result){
							if(!error){
								$(editable).text(newValue);
								console.log('Data updated '+result );

							}
						});
					}
				});
			},1000)


			// self.$('#dataTableExport').dataTable();
			// console.log(mySessionArray);
		}

	},
	'click .deleteFromExport' : function(e){
		var productId = $(e.target).closest('tr').attr('data-id');
		var session = Session.get('newExport');

		var newSession = _.reject(session, function(object) { return object._id == productId });

		Session.set('newExport', newSession);
	},
	'click .iofferExport' : function(e){

  	Meteor.call('removeDummy', function(){
  		var data = Session.get('newExport');

			data.forEach(function(object){
				DummyData.insert(object, function(error, result){
				if(!error)
					console.log(DummyData.findOne(result));
				});
			})
			Router.go('csvIoffer');
  	});



	}
});





Template.listproducts.onRendered(function() {

	Session.set('newExport', []);
	$.fn.editable.defaults.mode = 'inline';

	var self = this;


	Meteor.setTimeout(function(){

		self.$('.editable').editable({
			success: function(response, newValue) {
				var editable = this;
				var key = $(this).attr('data-key');
				var id = $(this).closest('tr').attr('data-id');

				var updateRecord = {};
				updateRecord[key] = newValue;

				console.log(id);
				console.log(key)

				Products.update({_id :id}, {$set : updateRecord}, function(error, result){
					if(!error){
						$(editable).text(newValue);
						console.log('Data updated '+result );

					}
				});
			}
		});
		self.$('#dataTable').dataTable();

	},1000)

});
