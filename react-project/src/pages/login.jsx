import React from 'react';
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import axios from '../axios.js'
import {selectIsAuth, fetchAuth} from '../redux/slices/auth.js';
import  { useDispatch, useSelector} from 'react-redux';
import '../components/normalize.css'
import '../components/style.css'
import '../components/form.css'
export default function Login() {
	const isAuth = useSelector(selectIsAuth);
	console.log('isAuth use selector= ', isAuth)
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const onChange = React.useCallback((value)=>{
		setPassword(value);
	},[]);
	const fields = {	
		email, password
	}
	const navigate = useNavigate();
	if (isAuth){
		navigate('/posts')
	}
;	const dispatch = useDispatch();
	const onSubmit = async () => {
		try {
			console.log('isAuth', isAuth)
			console.log('fields', fields)
			const data = await dispatch(fetchAuth(fields))
			if ('token' in data.payload){
				window.localStorage.setItem('token', data.payload.token)
			}
			else {
				alert('Не удалось авторизоваться')
			}
		} catch (err) {
			console.warn(err);
			alert('Ошибка при авторизации!')
		}
	}
	return (
		<main>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous"></link>
<div class="ye">
  <div class="col-6 offset-3">
			<section class="authorisation">
					<form action="" id="authorisation-form" class="form">
<div class="mb-3">
						<label for="user-login" class="form__label">Email</label>
						<input type="email" class="form-control" value={email} onChange ={(e) => setEmail(e.target.value)}/>
</div>
<div class="mb-3">
						<label for="user-password" class="form__label">Password</label>
						<input type="password" class="form-control" value={password} onChange ={(e) => setPassword(e.target.value)}/>
</div>
					</form>
					<input id="user-subit" type="submit" class="btn btn-secondary" value="Sign in" onClick={onSubmit}/> <hr/>
					<div class="alert alert-light" role="alert">
				  Если вы впервые на сайте, советуем зарегстрироваться по ссылке: <a href="/register" class="alert-link">Sign Up</a>.
			  </div>
			</section>
	</div>
</div>
		</main>
	);
  };