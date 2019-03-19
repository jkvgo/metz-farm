import React from 'react';
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';

var UserSession = (function(){
	const cookies = new Cookies();
	const loggedIn = cookies.get('loggedIn');

	var getStatus = function(){
		return loggedIn;
	}

	var setLoggedIn = function(user){
		cookies.set('loggedIn', true);
		cookies.set('userID', user);
	}

	var setLoggedOut = function(){
		cookies.set('loggedIn', false);
	}

	var redirectToLogin = function(){
		if(getStatus() === "false"){
			window.location.replace("/login");
		}
	}

	var getLoggedID = function(){
		return cookies.get('userID');
	}

	return {
		getStatus: getStatus,
		setLoggedIn: setLoggedIn,
		setLoggedOut: setLoggedOut,
		redirectToLogin: redirectToLogin,
		getLoggedID: getLoggedID
	}

})();

export default UserSession;