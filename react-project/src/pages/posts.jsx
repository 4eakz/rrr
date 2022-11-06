import React from 'react';
import { Link } from "react-router-dom";
import axios from '../axios.js'
import '../components/normalize.css'
import '../components/style.css'
import '../components/article.css'
import '../components/pagination.css'
import '../components/myFastCss.css'
import looked from './img/looked.png'
import { fetchPosts } from '../redux/slices/posts.js';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuth, fetchAuthMe } from '../redux/slices/auth.js';
export default function Posts() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);
	React.useEffect(() => {
		dispatch(fetchAuthMe())
	}, [])
	const userData = useSelector(state => state.auth.data);
	React.useEffect(() => {
		dispatch(fetchPosts())
	}, [])
	const { posts, tags } = useSelector(state => state.posts);
	console.log('posts', posts)
	const removePost = async (obj) => {
		if (window.confirm('Вы действительно хотите удалить статью?')) {
			await axios.delete(`/posts/${obj._id}`).then(navigate(0));
		}
	}
	var date_day = [];
	var date_hour = [];
	var date = [];
	let day = function (text) {
		date_day = []
		for (let i = 0; i < 10; i++) {
			date_day += '' + text[i];
		}
	}
	let hour = function (text) {
		date_hour = []
		if ((Number(text[11] + text[12]) + 8) > 24) {
			date_hour = '0' + (Number(text[11] + text[12]) + 8 - 24)
		}
		else {
			date_hour = '' + (Number(text[11] + text[12]) + 8)
		}
		for (let i = 13; i < 16; i++) {
			date_hour += '' + text[i];
		}
	}
	let fullDate = function (index) {
		date[index] = date_day + ' | ' + date_hour;
	}
	return (
		<main class="main">
			<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous"></link>
			<section class="posts">
				<div class="AR">
					<div class="container-xl">
						<div class="alert alert-dark shadow-sm" role="alert">
							{isAuth && (
								<Link to='/posts/add'>
									<div class="col-3 offset-10">
										<button class="btn btn-dark" id="new-post">
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M12 1V23M23 12H1" stroke="white" stroke-width="2" stroke-linecap="round" />
											</svg>
											<span> New post</span>
										</button>
									</div>
									<div clss="vert">

									</div>
								</Link>

							)}
							{posts && (
								(posts.items).map((obj, index) => (
									
									<div class="col-6 offset-3">
										<div class="alert alert-secondary shadow-sm" role="alert">
											<div class="tt">
												<h4 class="alert-heading">{obj.title}</h4>
												<h5 className='post_looked_num'><img src={looked} alt="" width='18px' /> {obj.viewsCount}</h5>
											</div>
											<hr />
											{obj.imageUrl !== '' && (
												<div class='post_text'> <img class="imgr" src={`http://localhost:4444${obj.imageUrl}`} alt="" /></div>
											)}

											<p class='post_text'>{obj.text}</p>
											<hr />
											<div class="tt">

												<p class="mb-0">Автор:<Link to={`/users/${obj.user._id}`}> <a class="alert-link"> {obj.user !== null ? (<i>{obj.user.fullName}</i>) :
												(<div class=" alert-link"><i>DELETED</i></div>)}
												</a>
												</Link>
												</p>

												<Link to={`/posts/${obj._id}`}>

														<button type="button" class="btn btn-dark position-relative shadow">
															Посмотреть <span class="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-2 "></span>
														</button>
												</Link>

											</div>
										</div>
									</div>
								
								))
							)}


						</div>
					</div>
				</div>
			</section>


		</main>

	);
};
