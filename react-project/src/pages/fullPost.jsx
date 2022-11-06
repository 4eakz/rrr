import React from 'react';
import '../components/normalize.css'
import '../components/style.css'
import '../components/article.css'
import '../components/pagination.css'
import '../components/myFastCss.css'
import axios from '../axios.js'
import { useNavigate, Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuth, fetchAuthMe } from '../redux/slices/auth.js';
import close from './img/close.png'
export default function FullPost() {
	const { id } = useParams();
	const isAuth = useSelector(selectIsAuth);
	const [data, setData] = React.useState();
	React.useEffect(() => {
		axios.get(`/posts/${id}`).then(res => {
			setData(res.data);
			setTitle(res.data.title);
			setText(res.data.text)
		}).catch((err) => {
			console.warn(err);
			alert('Ошибка при получении статьи')
		})
	}, [])
	const [comments, setComment] = React.useState();
	React.useEffect(() => {
		axios.get(`/comments/${id}`).then(res => {
			setComment(res.data);
			console.log(res.data)
		}).catch((err) => {
			console.warn(err);
			alert('Ошибка при получении комментариев')
		})
	}, [])
	const navigate = useNavigate();
	const removePost = async (obj) => {
		if (window.confirm('Вы действительно хотите удалить статью?')) {
			await axios.delete(`/posts/${obj._id}`).then(navigate('/posts'));
		}
	}
	const removeComment = async (obj) => {
		if (window.confirm('Вы действительно хотите удалить комментарий')) {
			await axios.delete(`/comments/${obj._id}`).then(navigate(0));
		}
	}
	const dispatch = useDispatch();
	React.useEffect(() => {
		dispatch(fetchAuthMe())
	}, [])
	const userData = useSelector(state => state.auth.data);
	if (data) {
		var date_day = [];
		var date_hour = [];

		for (let i = 0; i < 10; i++) {
			date_day += '' + data.createdAt[i];
		}
		if ((Number(data.createdAt[11] + data.createdAt[12]) + 8) > 24) {
			date_hour = '0' + (Number(data.createdAt[11] + data.createdAt[12]) + 8 - 24)
		}
		else {
			date_hour = '' + (Number(data.createdAt[11] + data.createdAt[12]) + 8)
		}
		for (let i = 13; i < 16; i++) {
			date_hour += '' + data.createdAt[i];
		}

		var date = date_day + ' | ' + date_hour;
	}
	var date_day_comment = [];
	var date_hour_comment = [];
	var date_comment = [];
	let day = function (text) {
		date_day_comment = []
		for (let i = 0; i < 10; i++) {
			date_day_comment += '' + text[i];
		}
	}
	let hour = function (text) {
		date_hour_comment = []
		if ((Number(text[11] + text[12]) + 8) > 24) {
			date_hour_comment = '0' + (Number(text[11] + text[12]) + 8 - 24)
		}
		else {
			date_hour_comment = '' + (Number(text[11] + text[12]) + 8)
		}
		for (let i = 13; i < 16; i++) {
			date_hour_comment += '' + text[i];
		}
	}
	let fullDate = function (index) {
		date_comment[index] = date_day_comment + ' | ' + date_hour_comment;
	}
	const [showEditPost, setShowEditPost] = React.useState(false)
	const editPost = () => {
		setShowEditPost(true)
	}
	const CanceleditPost = () => {
		setShowEditPost(false)
	}
	const [title_post, setTitle] = React.useState();
	const [text_post, setText] = React.useState();


	const savePost = async () => {
		const title = title_post
		const text = text_post
		try {
			const fields = {

				title, text, imageUrl
			}
			await axios.patch(`/posts/${data._id}`, fields).then(navigate(0));


		} catch (err) {
			console.warn(err);
			alert('Ошибка при создании статьи!')
		}
	}
	const [title_comment, setTitle_comment] = React.useState();
	const [text_comment, setText_comment] = React.useState();
	const addComment = async () => {
		const title = title_comment
		const text = text_comment
		const user = userData
		const post = id
		try {
			const fields = {
				title, text, post, user
			}
			await axios.post('/comments', fields).then(navigate(0));

		} catch (err) {
			console.warn(err);
			alert('Ошибка при создании статьи!')
		}
	}
	const inputFileRef = React.useRef(null)
	const [imageUrl, setImageUrl] = React.useState('');
	const handleChangeFule = async (event) => {
		console.log(event.target.files)
		try {
			const formData = new FormData();
			const file = event.target.files[0]
			formData.append('image', file);
			const { data } = await axios.post('/uploads', formData);
			console.log(data)
			setImageUrl(data.url)

		} catch (err) {
			console.warn(err);
			alert('Ошибка при загрузке файла')
		}
	}
	console.log(imageUrl)
	return (
		<>
			{data && (
				<main>
						<div class="AR">
							<div class="container-xl ">
								<div class="alert alert-dark shadow-sm" role="alert">
									<div class="col-6 offset-3">
										<div class="alert alert-secondary shadow-sm">

											{showEditPost ? (
												<>
													<input type="text" class="form-control" defaultValue={data.title} onChange={(e) => setTitle(e.target.value)}></input>
												</>
											) : (
												
												<h3 class="article__title post__title">{data.title}</h3>

											)}
											<div class="DFLEX">
												{data.user !== null ? (<div class="article__semi-title post__author flex "><Link to={`/users/${data.user._id}`}><p class='alert-link link-dark'>{data.user.fullName}</p></Link></div>) :
													(
														<div class=" article__semi-title comment__author"><i>Пользователь удалён</i></div>
													)}
												<p>&#160; {date}</p>
											</div>
											<div class="article__main post__main">
												{data.imageUrl !== '' && (
													imageUrl === '' ? (
														<img class="imgr" src={`http://localhost:4444${data.imageUrl}`} alt="" />
													) : (
														<img class="imgr" src={`http://localhost:4444${imageUrl}`} alt="" />
													)
												)}

												{showEditPost ? (
													<>
													<div class="vert">
														<textarea class="form-control" rows="7" defaultValue={data.text} onChange={(e) => setText(e.target.value)}></textarea>

											</div>

													</>
												) : (
													<p class="article__text post__text">{data.text}</p>
												)}

												<div class="post__actions">
													{userData && (
														data.user !== null && (
															userData._id === data.user._id && (
																<>
																	{showEditPost ? (
																		<>
																		<br />
																		<div class="tt">
																			<button class="btn btn-dark" onClick={CanceleditPost}>Cancel</button>
																			<p>&#160;</p>
																			<button class="btn btn-dark" onClick={savePost}>Save</button>
																			</div>
																		</>
																	) : (
																		<>
<div class="tt">
																			<a href="#"  class="btn btn-dark" onClick={() => removePost(data)} > <img src={close}  alt="" align-items="center" width='20px'/> Delete</a>
																			<p>&#160;</p>
																			<button class="btn btn-dark" onClick={editPost} >Edit</button>
																			</div>
																		</>
																	)}
																</>
															)
														))}

												</div>
											</div>
										</div>
										<hr/>
									</div>


									<div class="container">

									<h2 class="text">Comments</h2>

										{isAuth && (
											<p></p>
										)}
									</div>


										{comments && (
											(comments).map((obj, index) => (

												<div class="col-6 offset-3">
												<div class="alert alert-secondary shadow-sm">
											<article class="article article--minimized">
												<header class="comment__header block__header flex gap comment_block">
													<div className="gap">
														<h3 class="article__title comment__title">{obj.title}</h3>
														<div className="flex gap comment_fullName">
															{obj.user !== null ? (<div class=" article__semi-title comment__author">author: {obj.user.fullName}</div>):(
																<div class=" article__semi-title comment__author"><i>Пользователь удалён</i></div>
															)}
														
															{day(obj.createdAt)}
															{hour(obj.createdAt)}
															{fullDate(index)}
															<div class=" article__semi-title comment__author">{date_comment[index]}</div>
														</div>
													</div><br />
													
				
												</header>
												<main class="article__main comment__main">
													<p class="article__text comment__text">{obj.text}</p>
													{userData &&(
														obj.user !== null && (
														userData._id === obj.user._id && (
															<button class="btn btn-dark" onClick={() => removeComment(obj)}><img src={close} alt="" width='20px'/>Remove comment</button>
														)
														)
													)}
												</main>
											</article>
											</div>

								</div>
											))
										)}
																							<div class="col-6 offset-3">
																<hr/>
							</div>



					{isAuth && (
				<div class="col-6 offset-3">
				<div class="alert alert-secondary shadow-sm" role="alert">
				   <div class="container">
					   <form id="comment-creating-form" class="form">
   
						   <div class="block__header">
							   <h2 class="form__name">Create comment</h2>
						   </div>
						   <div class="form-group">
						   <label for="comment-title" class="form__label">Title</label>
						   <input type="text" id="comment-title" class="form-control" defaultValue={title_comment} onChange = {(e) => setTitle_comment(e.target.value)}/>
						   <label for="comment-body" class="form__label">Text</label>
						   <textarea id="comment-body" class="form-control" defaultValue={text_comment} onChange = {(e) => setText_comment(e.target.value)}></textarea>
   
						   </div>
						   <button class="btn btn-dark butt" onClick={addComment}>Add comment</button>
					   </form>
				   </div>
				   </div>
				   </div>
					)}

								</div>
							</div>
						</div>
				</main>
			)}
		</>

	);
};
