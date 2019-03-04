import React from 'react';
import {Redirect} from 'react-router-dom';

var UserSession = (function(){
	var loggedIn = false;

	var getStatus = function(){
		return loggedIn;
	}

	var setLoggedIn = function(){
		loggedIn = true;
	}

	var setLoggedOut = function(){
		loggedIn = false;
	}

	var redirectToLogin = function(){
		if(getStatus()){
			return <Redirect to="/login"/>
		}
	}

	return {
		getStatus: getStatus,
		setLoggedIn: setLoggedIn,
		setLoggedOut: setLoggedOut,
		redirectToLogin: redirectToLogin
	}

})();

export default UserSession;