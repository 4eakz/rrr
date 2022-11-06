import React from 'react';
import {Link} from "react-router-dom";
import axios from '../axios.js'
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
import avatar from './img/avatar.gif'
import { fetchPosts} from '../redux/slices/posts.js';
import {fetchUsers} from '../redux/slices/users.js';
import {useNavigate} from "react-router-dom";
import  { useDispatch, useSelector} from 'react-redux';
import {selectIsAuth, fetchAuthMe} from '../redux/slices/auth.js';


export default function Users() {

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);
	
	// Получаем все посты
	React.useEffect(() =>{
		dispatch(fetchPosts())
	}, [])
	const {posts} = useSelector(state => state.posts);

	// Получаем юзера
	React.useEffect(() =>{
		dispatch(fetchAuthMe())
	}, [])
	const userData = useSelector(state => state.auth.data);
	
	const [usersLength, setusersLength] = React.useState();
	const [commentLength, setCommentLength] = React.useState();

	// Получаем всех пользователей
	const [users, setUsers] = React.useState();
	React.useEffect(() =>{
		axios.get(`/users`).then(res =>{
			// Получаем комментарии
			setUsers(res.data);
			setusersLength(res.data.length)
			// Передаём кол-во комментов
			// setQuantity(res.data.length);
		}).catch((err) => {
			console.warn(err);
			alert('Ошибка при получении комментариев')
		})

	}, [])

	// Получаем комментарий в comments
	const [comments, setComment] = React.useState();
	React.useEffect(() =>{
		axios.get(`/comments`).then(res =>{
			// Получаем комментарии
			setComment(res.data);
			// Передаём кол-во комментов
			setCommentLength(res.data.length);
		}).catch((err) => {
			console.warn(err);
			alert('Ошибка при получении комментариев')
		})

	}, [])

	let userPosts = []
	for (let i = 0; i < usersLength; i++){
		userPosts [i] = 0
	}
	const setUserPostsUp = (index) => {
		userPosts[index] += 1 
		console.log(userPosts)
		console.log(index)
	}

	let userComments = []
	for (let i = 0; i < commentLength; i++){
		userComments[i] = 0
	}
	const setUserCommentsUp = (index) => {
		userComments[index] += 1 
		console.log(userComments)
		console.log(index)
	}

	// Дата и время
	var date_day = [];
	var date_hour = [];
	var date = [];
	let day = function (text){
		date_day = []
		for (let i = 0; i < 10; i++){
			date_day += '' + text[i];
		  }
	}
	let hour = function (text){
		date_hour = []
		if ((Number(text[11]+text[12]) + 8) > 24){
			date_hour = '0' + (Number(text[11]+text[12]) + 8 - 24)
		}
		else {
			date_hour = '' + (Number(text[11]+text[12]) + 8)
		}
		for (let i = 13; i < 16; i++){
			date_hour +=  '' + text[i];
		}
	}
	let fullDate = function (index){
		date[index] =date_day + ' | ' + date_hour;
	}
	console.log('posts', posts)
	console.log('comments', comments)
	// Переход на статью
	return (
		
		<main class="main">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous"></link>
    <section class="posts">
        <div class="container">

            <header class="block__header  _flex--sb">
                <h1>Users</h1>
            </header>
			{users && (
					(users).map((obj, index) => (
					// <div class='post' onClick={() => selectedPost(obj)}>
					<Link to = {`/users/${obj._id}`}>
						<div class='post'>
							<div className="post_header">
								<img src={avatar} alt="avatar" width='50px'/>
								<h3 className='post_h3'><i>{obj.fullName}</i></h3>
								<div class="article__semi-title post__author flex "><p class='fullPost_fullName'>{obj.email}</p></div>
							</div>
							 {day(obj.createdAt)}
							{hour(obj.createdAt)}
							{fullDate(index)}
							{(posts.items).map((ob) => (
								ob.user !== null && (
									
									ob.user._id === obj._id && (
										setUserPostsUp(index)	
												
									)
								)
							))
							}
							{comments &&(
								(comments).map((object) => (
										object.post === obj._id && (
											setUserCommentsUp(index)	
										)	
								))
								)
							}
							<h4 className='mt20'>Posts : {userPosts[index]}</h4>
							<br />
							<h4>Comments : {userComments[index]}</h4>
							
						</div>
					</Link>
				))
			)}

            <ul class="articles__list">

            </ul>

            <div class="posts__pagination">
                <div class="pagination__nav">
                    <div class="pagination__prev-actions pagination__page-list">
                        <button class="pagination__controls"><img src={first} alt="select"/></button>
                        <button class="pagination__controls"><img src={prev} alt="select"/></button>
                    </div>
                    <div class="pagination__prev-actions pagination__page-list">
                        <button class="pagination__controls pagination__controls--active">1</button>
                        <button class="pagination__controls">2</button>
                        <button class="pagination__controls">3</button>
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


</main>
	);
  };
