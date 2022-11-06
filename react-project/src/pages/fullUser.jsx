import React from 'react';
import '../components/normalize.css'
import '../components/style.css'
import '../components/article.css'
import '../components/pagination.css'
import '../components/myFastCss.css'
import select from './img/select.svg'
import first from './img/page-first.svg'
import prev from './img/page-prev.svg'
import next from './img/page-next.svg'
import last from './img/page-last.svg'
import axios from '../axios.js'
import {useNavigate, Link , useParams} from "react-router-dom";
import  { useDispatch, useSelector} from 'react-redux';
import {selectIsAuth, fetchAuthMe} from '../redux/slices/auth.js';
import close from './img/close.png';
import looked from './img/looked.png'

export default function FullUser() {
	// Получаем id статьи из параметров (из Link)
	const {id} = useParams();
	const isAuth = useSelector(selectIsAuth);

	// Записываем результат в data
	const [data, setData] = React.useState();
	React.useEffect(() =>{
		axios.get(`/users/${id}`).then(res =>{
			setData(res.data);
			setFullName(res.data.fullName);
		}).catch((err) => {
			console.warn(err);
			alert('Ошибка при получении статьи')
		})
	}, [])

	// Получаем комментарий в comments
	const [comments, setComment] = React.useState();
	const [userComments, setUserComment] = React.useState();
	React.useEffect(() =>{
		axios.get(`/comments/${id}`).then(res =>{
			setComment(res.data);
			setUserComment(res.data.length)
		}).catch((err) => {
			console.warn(err);
			alert('Ошибка при получении комментариев')
		})

	}, [])


	// Получаем посты в posts
	const [posts, setPosts] = React.useState();
	const [userPosts, setUserPost] = React.useState();
	React.useEffect(() =>{
		axios.get(`posts/user/${id}`).then(res =>{
			setPosts(res.data);
			setUserPost(res.data.length)
		}).catch((err) => {
			console.warn(err);
			alert('Ошибка при получении комментариев')
		})
	}, [])

	// Удаляем статью
	const navigate = useNavigate();
	const removeUser = async (obj) =>{
		if(window.confirm('Вы действительно хотите удалить спользователя')){
			await axios.delete(`/posts/${obj._id}`).then(navigate('/posts'));
		}
	} 
	// Удаляем пост
	const removePost = async (obj) =>{
		if(window.confirm('Вы действительно хотите удалить статью?')){
			await axios.delete(`/posts/${obj._id}`).then(navigate(0));
		}
	} 

	// Удаление комментария
	// const navigate = useNavigate();
	const removeComment = async (obj) =>{
		if(window.confirm('Вы действительно хотите удалить комментарий?')){
			await axios.delete(`/comments/${obj._id}`).then(navigate(0));
		}
	} 
	// console.log('userData', userData)

	// Получаем юзера
	const dispatch = useDispatch();
	React.useEffect(() => {
		dispatch(fetchAuthMe())
	}, [])
	const userData = useSelector(state => state.auth.data);

	// Дата и время
	if (data){
		var date_day = [];
		var date_hour = [];
		
		for (let i = 0; i < 10; i++){
			date_day += '' + data.createdAt[i];
		}
		if ((Number(data.createdAt[11]+data.createdAt[12]) + 8) > 24){
			date_hour = '0' + (Number(data.createdAt[11]+data.createdAt[12]) + 8 - 24)
		}
		else {
			date_hour = '' + (Number(data.createdAt[11]+data.createdAt[12]) + 8)
		}
		for (let i = 13; i < 16; i++){
			date_hour +=  '' + data.createdAt[i];
		}
		
		var date = date_day + ' | ' + date_hour;

		// Время изменения статьи
		// if (data.createdAt !== data.updatedAt){
		// 	var date_day_edit = [];
		// 	var date_hour_edit = [];
		// 	for (let i = 0; i < 10; i++){
		// 		date_day_edit  += '' + data.updatedAt[i];
		// 	}
		// 	if ((Number(data.updatedAt[11]+data.updatedAt[12]) + 8) > 24){
		// 		date_hour_edit = '0' + (Number(data.updatedAt[11]+data.updatedAt[12]) + 8 - 24)
		// 	}
		// 	else {
		// 		date_hour_edit = '' + (Number(data.updatedAt[11]+data.updatedAt[12]) + 8)
		// 	}
		// 	for (let i = 13; i < 16; i++){
		// 		date_hour_edit +=  '' + data.updatedAt[i];
		// 	}
		// 	var date = date + ' Edited: ' + date_day_edit  + ' | ' + date_hour_edit;
		// }
	}

	// Дата и время создания коммента
	var date_day_comment = [];
	var date_hour_comment = [];
	var date_comment = [];
	let day = function (text){
		date_day_comment= []
		for (let i = 0; i < 10; i++){
			date_day_comment += '' + text[i];
		  }
	}
	let hour = function (text){
		date_hour_comment = []
		if ((Number(text[11]+text[12]) + 8) > 24){
			date_hour_comment = '0' + (Number(text[11]+text[12]) + 8 - 24)
		}
		else {
			date_hour_comment = '' + (Number(text[11]+text[12]) + 8)
		}
		for (let i = 13; i < 16; i++){
			date_hour_comment +=  '' + text[i];
		}
	}
	let fullDate = function (index){
		date_comment[index] = date_day_comment + ' | ' + date_hour_comment;
	}

	// Редактирование поста
	const [showEditPost, setShowEditPost] = React.useState(false)
	const editPost = () =>{
		setShowEditPost(true)
	}
	const CanceleditPost = () =>{
		setShowEditPost(false)
	}
	// Отправить отредактированный пост
	const [fullName, setFullName] = React.useState();
	// const [text, setText] = React.useState();

	const savePost = async () =>{

		try {
			const fields = {	
				fullName
			}
			await axios.patch(`/users/${data._id}`, fields).then(navigate(0))

		} catch (err) {
			console.warn(err);
			alert('Ошибка при создании статьи!')
		}
	}
	// Отправить комментарий
	const [title_comment, setTitle_comment] = React.useState();
	const [text_comment, setText_comment] = React.useState();


	const addComment = async () =>{
		const title = title_comment
		const text = text_comment
		const user = userData
		const post = id
		try {
			const fields = {
				title, text, post, user 
			}
			await axios.post(`/comments`, fields).then(navigate(0))

		} catch (err) {
			console.warn(err);
			alert('Ошибка при создании статьи!')
		}
	}
	return (
		<>
		{data && (
			<main>
				<div class="AR">
				<div class="container-xl ">
				<div class="alert alert-dark shadow-sm" role="alert">
				<section class="section current-item">
				<div class="container">

					<div class="post__header block__header flex_fullUser tt">
						
					{showEditPost ? (
						<>
						<input type="text" class="form__input" defaultValue={data.fullName} onChange = {(e) => setFullName(e.target.value)}></input>
						</>
					):(
						<>
						<h1 class="article__title post__title">{data.fullName}</h1>
						</>
					)}
						<div class="post__actions user_actions">
						{userData &&(
							userData._id === data._id && (
								<> 
							{showEditPost ?(
								<>
								<button class="btn deleete_post btn-dark" onClick={CanceleditPost}>Cancel</button>
								<button class="btn btn-dark but" onClick={savePost}>Save</button>
								</>
							):(
								<>
								<button class="btn deleete_post btn-dark" onClick={editPost}>Edit</button>
								</>
							)}
							</>
						)
						)}
							
						</div>
					</div>
					
					<div class="ttr">
					<div class="col-4 offset-0">
					<h5>Дата регистрации: {date}</h5><br/>
					</div>
				
					<div class="col-2 offset-1">
					<h5>Posts: {userPosts}</h5><br />
					</div>
					<div class="col-4 offset-0">
					<h5>Comments: {userComments}</h5>
					</div>
					</div>
					<div class="article__main post__main">
					</div>
				</div>
			</section>
			{/* Посты */}
			<section class=" section comments">
				<div class="container">
					<div class="block__header flex new_comment_fullPost tt">
						<label for="PostsCY" class="form-label"><h5>Posts</h5></label>
						{isAuth && (
							userData._id === data._id &&(
							<Link to="/posts/add">
							 <button class="btn btn-dark" id="new-post">
                    <svg  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg%22%3E">
                        <path d="M12 1V23M23 12H1" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <span> New post</span>
                </button>
							</Link>
							)
						)}
					</div>
		
					
					{posts && (
							(posts).map((obj, index) => (
						
							
								<div class="col-6 offset-3">
									
									<div class="alert alert-secondary shadow-sm">
								
							<article class="article article--minimized">
								<header class="comment__header block__header flex gap comment_block">
									<div className="gap">
									<div class="tt">
										<h3 class="article__title comment__title">{obj.title}</h3>
										<h5 className='post_looked_num'><img src={looked} alt="" width='18px' /> {obj.viewsCount}</h5>
										</div>
										<div className="flex gap comment_fullName">
										

											{day(obj.createdAt)}
											{hour(obj.createdAt)}
											{fullDate(index)}
											
											<div class=" article__semi-title comment__author">{date_comment[index]}</div>
											
										</div>
									</div><br />
									
									
								</header>
								
								<main class="article__main comment__main">
									{obj.imageUrl !== '' &&(
										<img src={`http://localhost:4444${obj.imageUrl}`} alt="" />
									)}
									
									<p class="article__text comment__text">{obj.text}</p>
									<hr/>
									
									
								</main>
								<div class='tt'>
								{userData &&(
										obj.user !== null && (
										userData._id === obj.user._id && (
											
											<button class="btn btn-dark" onClick={() => removePost(obj)}><img src={close}  alt="" align-items="center" width='20px'/> Remove post</button>
										)
										)
									)}
									<Link to={`/posts/${obj._id}`}>
    
    <a href="">
    <button type="button" class="btn btn-dark position-relative shadow">
    Посмотреть <span class="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-2 "></span>
    </button> </a>
    </Link>
									</div>
							</article>
							</div>
							<hr/>
							</div>
							
							
							))
						)}
				</div>
			</section>
			
			
		{/* Комменты */}
	
				<div class="container">
					<div class="block__header flex new_comment_fullPost">
						
						<h2 class="text">Comments</h2>
						{isAuth && (
							<a href='#createComment'>
							
						</a>
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
											{/* <div class=" article__semi-title comment__author">{date_comments}</div> */}
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
					
				</div>
			
			{isAuth&&(
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