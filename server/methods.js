Meteor.methods({

	aliexpressSearch: function(keywords, from, to, nPage) {
		///Setup the app key;
		var appKey = '';
		var fields = 'productId,productTitle,productUrl,imageUrl,salePrice,evaluateScore';
		var apiUrl = 'http://gw.api.alibaba.com/openapi/param2/2/portals.open/api.listPromotionProduct/'+appKey+'?fields='+fields+'&keywords='+keywords+'&originalPriceFrom='+from+'&originalPriceTo='+to+'&pageSize=40&&startCreditScore=500&pageNo=';
		var results = [];


		console.log(apiUrl);


		for (var i = 1; i <= 6; i++) {

			var pageNo = i;
			console.log(pageNo)
			var request = HTTP.call("GET", apiUrl + pageNo);
			if(request.statusCode === 200) {
				var result = JSON.parse(request.content).result;
				results = results.concat(result.products);

			} else {
				console.log('error');
			}
		}

		console.log(results);
		return results;
	},


	aliexpressScrape : function(url, type) {


		if(type === 'specs'){
			var result = Meteor.http.get(url);

			if(result.statusCode === 200){
				var $ = cheerio.load(result.content);

				var attributes = '';

				$('.product-params .ui-box-body dl').each(function(e){
					var type = $(this).find('dt').text();
					var detail = $(this).find('dd').text();
					attributes += type + detail + ';';
					attributes = attributes.replace(/,/g, '|');
					attributes = attributes.replace(', ', '|');
				});
				console.log(attributes);
				return attributes;
			} else {
				throw new Meteor.Error('Could not load the page');
			}
		} else if (type === 'images') {
			url = url.replace('item', 'item-img');
			var result = Meteor.http.get(url);
			if(result.statusCode === 200){
				var $ = cheerio.load(result.content);

				var imagesArray = [];
				var images = $('#change-600-layout ul.new-img-border li').each(function(i){
					imagesArray.push($(this).find('img').attr('src'));
				});

				console.log(imagesArray);

				return imagesArray;
			}
		}
	},
	downloadPictures : function(files){
		var fs = Npm.require('fs'),
		request = Npm.require('request'),
		dir = '/var/www/product_img/'

		var filename = '';
		filename = Math.floor(Math.random() * (1000000000 - 10)) + 10 + '.jpg';



		request(files).pipe(fs.createWriteStream(dir + filename)).on('close', function(){
			console.log('Image downloaded');
		});

		return 'http://ns328520.ip-37-187-114.eu/product_img/'+ filename;

	},
	removeDummy : function(){
		DummyData.remove({});
	}



});
