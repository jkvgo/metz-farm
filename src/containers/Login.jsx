import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';

const Login = () => (
	<div id="login" className="row just-end align-center">
		<div className="login-container column-no just-between">
			<h2>Login</h2>
			<form>
				<div>
					<b>User:</b>
					<input type="text"/>
				</div>
				<div>
					<b>Password:</b>
					<input type="text"/>
				</div>
			</form>
			<button className="login-button" type="button">Login</button>
		</div>
	</div>
)

export default Login;