import React, {Component} from 'react';
import UserSession from '../userSession';
import axios from 'axios';

class User extends Component{
	constructor(){
		super();
		this.state = {
			users: [],
			addUser: "",
			addPassword: "",
			editMode: false
		};
		this.getAllUsers = this.getAllUsers.bind(this);
		this.deleteItem = this.deleteItem.bind(this);
		this.typeUser = this.typeUser.bind(this);
		this.typePassword = this.typePassword.bind(this);
		this.addUser = this.addUser.bind(this);
		this.cancelEdit = this.cancelEdit.bind(this);
		this.submitUser = this.submitUser.bind(this);
		this.getAllUsers();
	}

	getAllUsers(){
		axios.get("users").then((res) => {
			this.setState({
				users: res.data
			});
		});
	}

	addUser(){
		let users = this.state.users;
		users.push({
			type: "add"
		});
		this.setState({
			users: users,
			editMode: true
		});
	}

	deleteItem(id){
		alert("Are you sure you want to delete item");
	}

	typeUser(val){
		this.setState({
			addUser: val
		});
	}

	typePassword(val){
		this.setState({
			addPassword: val
		});
	}

	cancelEdit(){
		let users = this.state.users.length ? this.state.users : [];
		users.pop();
		this.setState({
			users: users,
			editMode: false
		});
	}

	submitUser(){
		const userDetails = {
			name: this.state.addUser,
			password: this.state.addPassword
		};
		let agree = confirm("Are you user you want to create this new user?");
		if(agree == true){
			axios.post('users', userDetails).then((res) => {
				this.getAllUsers();
				this.setState({
					editMode: false
				});
			}).catch((err) => {
				alert("Unable to add new user");
			});
		}
	}

	render(){
		const editMode = this.state.editMode;
		const addUser = this.state.addUser;
		const addPassword = this.state.addPassword;
		const users = this.state.users.length ? this.state.users.map((u,key) => {
			if(u.type === "add"){
				return (
					<div className={"row user-item align-center"} key={key}>
						<p>{key+1}</p>
						User: <input type="text" placeholder="Customer name" value={addUser} onChange={(e) => this.typeUser(e.target.value)} autoFocus={true}/>
						Password: <input type="password" value={addPassword} onChange={(e) => this.typePassword(e.target.value)}/>
					</div>
				)
			}else{
				return (
					<div className={"row user-item just-between align-center"} key={key}>
	                    <p>{key+1}</p>
	                    <b className="user-name">{u.name}</b>
	                    <button type="button" className="delete-btn" onClick={() => this.deleteItem(u.id) }>Delete</button>
	                </div>
				)
			}
		}) : [];

		return(
			<div id="users" className="column center-container">
				{users}
				<div className={"row edit-controls just-end " + editMode}>
					<button className="button add-button" onClick={() => this.addUser()}>Add User</button>
					<button className="button cancel-button" onClick={() => this.cancelEdit()}>Cancel</button>
                    <button className="button submit-button" onClick={() => this.submitUser()}>Submit</button>
				</div>
			</div>
		);
	}
}

export default User;