import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux'
import Header from './components/header.jsx';
import App from './app.js';
import reportWebVitals from './reportWebVitals';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<>
		<BrowserRouter>
			<Provider store = {store}>
				<Header/> 
				<App/>
			</Provider>
	</BrowserRouter>
</>
);
reportWebVitals();
