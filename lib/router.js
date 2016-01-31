Router.configure({
	waitOn: function(){

	}
});

AdminHookFunction = function(){
	if(!Meteor.userId()){
		this.redirect('/login');
	} else {
		this.next();
	}
}
IsLoggedInFunction = function(){
	if(Meteor.userId()){
		this.redirect('/dashboard');
	} else {
		this.next();
	}
}


Router.onBeforeAction(AdminHookFunction, {
	except: ['login', 'register', 'csvIoffer']
});

Router.onBeforeAction(IsLoggedInFunction, {
	only: ['login', 'register']
});


Router.route('/login', {
	name: 'login',

	path: '/login',

	template: 'login',

	layoutTemplate: 'auth',

	waitOn:function(){

	},

	data: function(){

	},

	action: function(){
		this.render();
	}
});

Router.route('/register', {
	name: 'register',

	path: '/register',

	template: 'register',

	layoutTemplate: 'auth',

	waitOn:function(){

	},

	data: function(){

	},

	action: function(){
		this.render();
	}
});

Router.route('/dashboard', {

	name: 'dashboard',

	path: '/dashboard',

	template: 'homepage',

	layoutTemplate: 'layout',

	waitOn:function(){

	},

	data: function(){

	},

	action: function(){
		this.render();
	}

	// if(this.ready()) {
	// 	this.render('homepage');
	// }

});

Router.route('/products/newproduct', {

	name: 'newproduct',
	path: '/products/newproduct',
	template: 'newproduct',
	layoutTemplate: 'layout',

	waitOn: function(){

	},

	data: function(){

	},

	action: function(){
		this.render();
	},

});

Router.route('/products/importproducts', {

	name: 'importproducts',
	path: '/products/importproducts',
	template: 'importproducts',
	layoutTemplate: 'layout',

	waitOn: function(){

	},

	data: function(){

	},

	action: function(){
		this.render();
	},

});

Router.route('/products/listproducts', {

	name: 'listproducts',
	path: '/products/listproducts',
	template: 'listproducts',
	layoutTemplate: 'layout',

	onBeforeAction: function(){
		Session.set('newExport', []);
		this.next();
	},

	waitOn: function(){

	},

	data: function(){
		// return {
		// 	results : Products.find({user_id : Meteor.userId()})
		// };
	},

	action: function(){
		this.render();
	},

});

Router.route('/csvIoffer', {
  where: 'server',
  name : 'csvIoffer',
  action: function () {
    var filename = 'productdata.csv';
    var fileData = "";

    var headers = {
      'Content-type': 'text/csv',
      'Content-Disposition': "attachment; filename=" + filename
    };
    var records = DummyData.find();
    // build a CSV string. Oversimplified. You'd have to escape quotes and commas.
    fileData += 'category,title,description,quantity,price,shipping,item_specifics,condition,image1,image2,image3, image4, image5' + "\r\n"
    records.forEach(function(rec) {
      fileData += rec.product_category + "," + rec.product_title  + "," + (rec.description || '') + "," + rec.quantity + "," + rec.sell_price + "," + rec.shipping + ',' + rec.item_specifics + "," + rec.condition + "," + rec.product_image[0] + ","
      + (rec.product_image[1] || '') + "," + (rec.product_image[2] || '') + "," + (rec.product_image[3] || '') + "," + (rec.product_image[4] || '') +  "\n" ;

    })
    this.response.writeHead(200, headers);
    return this.response.end(fileData);
  }
});

Router.route('/popup/:id.js', function(){

	var request = this.request;

	var response = this.response;

	var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
	var data = GeoIP.lookup(ip);

	response.end(html);

}, {where : 'server'});
