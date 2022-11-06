import React from 'react';
import {useNavigate} from "react-router-dom";
import axios from '../axios.js'
import '../components/normalize.css'
import '../components/style.css'
import '../components/form.css'
import {selectIsAuth, fetchAuth} from '../redux/slices/auth.js';
import  { useDispatch, useSelector} from 'react-redux';



export default function Register() {
	const [fullName, setfullName] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setpassword] = React.useState('');

	console.log({email,password,fullName})
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const onSubmit = async () => {
		try {
			
			const fields = {
				email,password,fullName
			}
			await axios.post('/auth/register', fields);

			const fieldsAuth = {
				email,password
			}
			const data = await dispatch(fetchAuth(fieldsAuth))
			if ('token' in data.payload){
				window.localStorage.setItem('token', data.payload.token)
			}
			else {
				alert('Не удалось авторизоваться')
			}
			navigate(`/posts`)

		} catch (err) {
			console.warn(err);
			alert('Ошибка при регистрации!')
		}
	}
	const isAuth = useSelector(selectIsAuth);
	console.log('isAuth use selector= ', isAuth)
	if (isAuth){
		navigate('/posts')
	}
	return (
		<main>
			
			<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous"></link>
	<section class="registration">
		<div class="ye">
			<div class="col-6 offset-3">

			<form id="registration-form" name="registration" class="form">

                <div class="mb-3">
                            <label for="user-name" class="form__label">Login</label>
                            <input type="text" id="user-name" name="fullName" class="form-control" value={fullName} onChange ={(e) => setfullName(e.target.value)}/>
				</div>

				<div class="mb-3">
                            <label for="user-email" class="form__label">E-mail</label>
                            <input type="text" id="user-email" name="email" class="form-control" value={email} onChange ={(e) => setEmail(e.target.value)}/>
				</div>

				<div class="mb-3">
                            <label for="user-password" class="form__label">Password</label>
                            <input type="password" id="user-password" name="password" class="form-control" value={password} onChange ={(e) => setpassword(e.target.value)}/>
				</div>

				<div class="mb-3">
                            <label for="user-password-again" class="form__label">Password again</label>
                            <input type="password" id="user-password-again" name="passwordAgain" class="form-control"/>
				</div>

                    {/* <span class="_caution form__error"></span> */}

        </form>
				<div class="FL">
					<input id="user-submit" type="button" class="btn btn-secondary" value="Register" onClick={onSubmit}/><hr/>
		<div class="alert alert-light" role="alert">
		  <p> Если вы зарегестрированы перейдите по ссылке: <a href="/login" class="alert-link">login</a>.</p>
		</div>
				</div>

			</div>
		</div>
	</section>
		</main>
	);
  };