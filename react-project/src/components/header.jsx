import React from 'react';
import './header.css'
import './normalize.css'
import './style.css'
import './myFastCss.css'
import { logout, selectIsAuth, fetchAuthMe } from '../redux/slices/auth.js';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";


<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous"></link>
export default function Header() {
	const isAuth = useSelector(selectIsAuth);
	const dispatch = useDispatch();
	const userData = useSelector(state => state.auth.data);
	// const isPostsLoading = posts.status === 'loading'
	React.useEffect(() => {
		dispatch(fetchAuthMe())
	}, [])

	const onClickLogout = () => {
		if (window.confirm('Вы действительно хотите выйти?')) {
			dispatch(logout())
			window.localStorage.removeItem('token')
		}

	}
	const ids = window.location.href;
	console.log('ids ', ids)
	return (
		<header class="header">
			<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous"></link>
	
			<nav class="navbar navbar-expand-lg navbar-light bg-light">
				
				<div class="container-fluid">
				
					<Link to="/posts"><a class="navbar-brand">Main</a></Link>
					
					<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>

					<div class="collapse navbar-collapse" id="navbarSupportedContent">


						<ul class="navbar-nav me-auto mb-2 mb-lg-0">

							<li class="nav__item"><Link to="/posts"><a class="nav-link active" aria-current="page">Posts</a></Link></li>
							<li class="nav__item"><Link to="/users"><a class="nav-link active" aria-current="page">Users</a></Link></li>
							<li class="nav__item"><Link to="/comments"><a class="nav-link active" aria-current="page">Comments</a></Link></li>

						</ul>


						<div class="header__account-actions account-actions">
							<ul class="navbar-nav me-auto mb-2 mb-lg-0">
								{isAuth ? (
									<>

										<li class="mb-0"> <Link to={`/users/${userData._id}`}> <button class="btn btn-light"> {userData.fullName} </button> </Link> </li>
										<li class="mb-0"> &#160;</li>
										<li class="mb-0"> <button class="btn btn-dark" id="register" onClick={onClickLogout}>Logout </button> </li>

									</>
								) : (
									<>

										<li class="mb-0"> <Link to="/login"> <a class="alert-link link-dark" id="sign-in">Log in&#160;</a> </Link> </li>
										<li class="mb-0"> | </li>
										<li class="mb-0"> <Link to="/register"> <a class="alert-link link-dark" id="register">&#160;Sign Up</a> </Link> </li>

									</>
								)}
							</ul>
						</div>


					</div>
				</div>
			</nav>
		</header>
	);
};
<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<div class="container-fluid">
		<a class="navbar-brand" href="#">Main</a>
		<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
			aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>

		<div class="collapse navbar-collapse" id="navbarSupportedContent">

			<ul class="navbar-nav me-auto mb-2 mb-lg-0">
				<li class="nav-item">
					<a class="nav-link active" aria-current="page" href="/Posts">Posts</a>
				</li>
				<li class="nav-item">
					<a class="nav-link active" href="/Coment">Comment</a>
				</li>
				<li class="nav-item">
					<a class="nav-link active" href="/Users">Users</a>
				</li>
				<li class="nav-item">
					<a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Sign_in</a>
				</li>
			</ul>

			<p class="mb-0"><a href="/log_in" class="alert-link link-dark">Log in</a> | <a href="/register"
				class="alert-link link-dark">Sign in</a> </p>

		</div>
	</div>
</nav>