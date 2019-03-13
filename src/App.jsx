import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
// import { CookiesProvider, withCookies } from 'react-cookie';
import Cookies from 'universal-cookie';

import Routes from './Routes';

import reactLogo from './assets/React-icon.png';

const App = () => (
	<Routes />
);

export default App;
