import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';

class Login extends Component{
	constructor(props){
		super(props);
		this.state = {
			username: "",
			password: ""
		};
		this.changeUsername = this.changeUsername.bind(this);
		this.changePassword = this.changePassword.bind(this);
		this.verifyUser = this.verifyUser.bind(this);
	}

	changeUsername(event){
		this.setState({
			username: event.target.value
		});
	}

	changePassword(event){
		this.setState({
			password: event.target.value
		});
	}

	verifyUser(){
		const creds = this.state;
		axios.post('/verify', creds).then((res) => {
			console.log(res);
		}).catch((err) => {
			console.error(err);
		});
	}

// class Login = () => (
	render(){
		const username = this.state.username.length ? this.state.username : "";
		const password = this.state.password.length ? this.state.password : "";
		return(
			<div id="login" className="row just-end align-center">
				<div className="login-container column-no just-between">
					<h2>Login</h2>
					<form>
						<div>
							<b>User:</b>
							<input type="text" value={username} onChange={this.changeUsername}/>
						</div>
						<div>
							<b>Password:</b>
							<input type="text" value={password} onChange={this.changePassword}/>
						</div>
					</form>
					<button className="login-button" type="button" onClick={this.verifyUser}>Login</button>
				</div>
			</div>
		);
			
	}
// )
}

export default Login;