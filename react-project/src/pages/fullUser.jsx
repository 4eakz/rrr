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
import close from './img/close.png'

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
			<section class="section current-item">
				<div class="container">
					{/* {editPost = false} */}
					<div class="post__header block__header flex_fullUser">
						
					{showEditPost ? (
						<>
						<input type="text" class="form__input" defaultValue={data.fullName} onChange = {(e) => setFullName(e.target.value)}></input>
						</>
					):(
						<>
						<h1 class="article__title post__title">{data.fullName}</h1>
						<div class="article__semi-title post__author flex "><p class='fullPost_fullName'>{data.email}</p></div>
						</>
					)}
						
					</div>
					<h4>Дата регистрации: {date}</h4><br />
					<h4>Email: {data.email}</h4><br />
					<h4>Posts: {userPosts}</h4><br />
					<h4>Comments: {userComments}</h4>
					
					<div class="article__main post__main">
						
						{/* {showEditPost ? (
							<textarea class="form__input form__input-textarea" rows="15" defaultValue={data.text} onChange ={(e) => setText(e.target.value)}></textarea>
						):(
							<p class="article__text post__text">{data.text}</p>
						)}
						 */}
						<div class="post__actions user_actions">
						{userData &&(
							userData._id === data._id && (
								<> 
							{showEditPost ?(
								<>
								<button class="btn deleete_post" onClick={CanceleditPost}>Cancel</button>
								<button class="btn" onClick={savePost}>Save</button>
								</>
							):(
								<>
								{/* <a href="#" class="btn deleete_post" onClick={() => removePost(data)}>Delete</a> */}
								<button class="btn deleete_post" onClick={editPost}>Edit</button>
								</>
							)}
							
							{/* <Link to = {`/posts/edit/${data._id}`}><a href="edit-post.html" class="btn">Edit</a></Link> */}
							</>
						)
						)}
							
						</div>
					</div>
				</div>
			</section>
			{/* Посты */}
			<section class=" section comments">
				<div class="container">
					<div class="block__header flex new_comment_fullPost">
						<h2>Posts</h2>
						{isAuth && (
							userData._id === data._id &&(
							<Link to="/posts/add">
							<button class="btn new-post-btn _flex--sb" id="new-post">
								<svg  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M12 1V23M23 12H1" stroke="white" stroke-width="2" stroke-linecap="round"/>
								</svg>
								<span>New post</span>
							</button>
							</Link>
							)
						)}
					</div>
		
					<ul class="articles__list">
					{posts && (
							(posts).map((obj, index) => (
							<li class="articles__item">
							<Link to={`/posts/${obj._id}`}>
							<article class="article article--minimized">
								<header class="comment__header block__header flex gap comment_block">
									<div className="gap">
										<h3 class="article__title comment__title">{obj.title}</h3>
										<div className="flex gap comment_fullName">
											{obj.user !== null ? (<div class=" article__semi-title comment__author">{obj.user.fullName}</div>):(
												<div class=" article__semi-title comment__author"><i>Пользователь удалён</i></div>
											)}
											{/* <div class=" article__semi-title comment__author">{date_comments}</div> */}
											{day(obj.createdAt)}
											{hour(obj.createdAt)}
											{fullDate(index)}
											<div class=" article__semi-title comment__author">{date_comment[index]}</div>
										</div>
									</div><br />
									{userData &&(
										obj.user !== null && (
										userData._id === obj.user._id && (
											<button onClick={() => removePost(obj)}><img src={close} alt="" width='20px'/></button>
										)
										)
									)}
									
								</header>
								<main class="article__main comment__main">
									{obj.imageUrl !== '' &&(
										<img src={`http://localhost:4444${obj.imageUrl}`} alt="" />
									)}
									
									<p class="article__text comment__text">{obj.text}</p>
									
								</main>
							</article>
							</Link>
							</li>
							))
						)}
					</ul>
		
					<div class="posts__pagination">
						<div class="pagination__nav">
							<div class="pagination__prev-actions pagination__page-list">
								<button class="pagination__controls"><img src={first} alt="select"/></button>
								<button class="pagination__controls"><img src={prev} alt="select"/></button>
							</div>
							<div class="pagination__prev-actions pagination__page-list">
								<a class="pagination__controls pagination__controls--active">1</a>
								<a class="pagination__controls">2</a>
								<a class="pagination__controls">3</a>
							</div>
							<div class="pagination__prev-actions pagination__page-list">
								<button class="pagination__controls"><img src={next} alt="select"/></button>
								<button class="pagination__controls"><img src={last} alt="select"/></button>
							</div>
						</div>
		
						<div class="pagination__page-size">
							<label for="page-size">Page size:</label>
							<input type="text" class="page-size__input" id="page-size" value="25"/>
							<button href="#" class="page-size__select"><img src={select} width="15px" alt="select"/></button>
						</div>
					</div>
				</div>
			</section>
			{/* Комменты */}
			<section class=" section comments">
				<div class="container">
					<div class="block__header flex new_comment_fullPost">
						<h2>Comments</h2>
						{isAuth && (
							<a href='#createComment'>
							<button class="btn new-post-btn _flex--sb" id="new-post">
								<svg  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M12 1V23M23 12H1" stroke="white" stroke-width="2" stroke-linecap="round"/>
								</svg>
								<span>New comment</span>
							</button>
						</a>
						)}
					</div>
		
					<ul class="articles__list">
					{comments && (
							(comments).map((obj, index) => (
							<li class="articles__item">
								
							<article class="article article--minimized">
								<header class="comment__header block__header flex gap comment_block">
									<div className="gap">
										<h3 class="article__title comment__title">{obj.title}</h3>
										<div className="flex gap comment_fullName">
											{obj.user !== null ? (<div class=" article__semi-title comment__author">{obj.user.fullName}</div>):(
												<div class=" article__semi-title comment__author"><i>Пользователь удалён</i></div>
											)}
											{/* <div class=" article__semi-title comment__author">{date_comments}</div> */}
											{day(obj.createdAt)}
											{hour(obj.createdAt)}
											{fullDate(index)}
											<div class=" article__semi-title comment__author">{date_comment[index]}</div>
										</div>
									</div><br />
									{userData &&(
										obj.user !== null && (
										userData._id === obj.user._id && (
											<button onClick={() => removeComment(obj)}><img src={close} alt="" width='20px'/></button>
										)
										)
									)}
									
								</header>
								<main class="article__main comment__main">
									<p class="article__text comment__text">{obj.text}</p>
									
								</main>
							</article>
							</li>
							))
						)}
					</ul>
		
					<div class="posts__pagination">
						<div class="pagination__nav">
							<div class="pagination__prev-actions pagination__page-list">
								<button class="pagination__controls"><img src={first} alt="select"/></button>
								<button class="pagination__controls"><img src={prev} alt="select"/></button>
							</div>
							<div class="pagination__prev-actions pagination__page-list">
								<a class="pagination__controls pagination__controls--active">1</a>
								<a class="pagination__controls">2</a>
								<a class="pagination__controls">3</a>
							</div>
							<div class="pagination__prev-actions pagination__page-list">
								<button class="pagination__controls"><img src={next} alt="select"/></button>
								<button class="pagination__controls"><img src={last} alt="select"/></button>
							</div>
						</div>
		
						<div class="pagination__page-size">
							<label for="page-size">Page size:</label>
							<input type="text" class="page-size__input" id="page-size" value="25"/>
							<button href="#" class="page-size__select"><img src={select} width="15px" alt="select"/></button>
						</div>
					</div>
				</div>
			</section>
			{isAuth&&(
			<section class="section create-comment" id='createComment'>
				<div class="container">
					<form id="comment-creating-form" class="form">
		
						<div class="block__header">
							<h2 class="form__name">Create comment</h2>
						</div>
		
						<label for="comment-title" class="form__label">Title</label>
						<input type="text" id="comment-title" class="form__input" defaultValue={title_comment} onChange = {(e) => setTitle_comment(e.target.value)}/>
		
						<label for="comment-body" class="form__label">Text</label>
						<textarea id="comment-body" class="form__input" defaultValue={text_comment} onChange = {(e) => setText_comment(e.target.value)}></textarea>
		
						<input id="comment-submit" type="submit" class="btn" value="Add comment" onClick={addComment}/>
					</form>
				</div>
			</section>
			)};
		</main>
		)}
		</>
		
	);
  };
