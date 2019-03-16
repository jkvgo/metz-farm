import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import UserSession from '../UserSession';
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

	verifyUser(e){
		e.preventDefault();
		const creds = this.state;
		axios.post('verify', creds).then((res) => {
			const user = res.data;
			if(user){
				UserSession.setLoggedIn(user);
				window.location.replace("/receipt");
			}else{
				alert("User not found");
			}
		}).catch((err) => {
			console.error("Unable to Login");
		});
	}

// class Login = () => (
	render(){
		const username = this.state.username.length ? this.state.username : "";
		const password = this.state.password.length ? this.state.password : "";
		return(
			<div id="login" className="row just-end align-center">
				<div className="login-container column-no">
					<h2>Login</h2>
					<form className="column-no" onSubmit={this.verifyUser} >
						<div>
							<b>User:</b>
							<input type="text" value={username} onChange={this.changeUsername}/>
						</div>
						<div>
							<b>Password:</b>
							<input type="password" value={password} onChange={this.changePassword}/>
						</div>
						<button className="login-button" type="submit" onClick={this.verifyUser}>Login</button>	
					</form>
				</div>
			</div>
		);
			
	}
// )
}

export default Login;