RedirectFunction = function(){
	Router.go('/dashboard');
}

ErrorLoginFunction = function(){
	alert('Wrong ID');
}

Accounts.onLoginFailure(ErrorLoginFunction);
