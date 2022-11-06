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
import looked from './img/looked.png'
import close from './img/close.png'
import { fetchPosts} from '../redux/slices/posts.js';
import {useNavigate} from "react-router-dom";
import  { useDispatch, useSelector} from 'react-redux';
import {selectIsAuth, fetchAuthMe} from '../redux/slices/auth.js';


export default function Posts() {

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);

	// Получаем юзера
	React.useEffect(() =>{
		dispatch(fetchAuthMe())
	}, [])
	const userData = useSelector(state => state.auth.data);
	
	// Получаем статьи
	React.useEffect(() =>{
		dispatch(fetchPosts())
	}, [])
	const {posts, tags} = useSelector(state => state.posts);


	console.log('posts', posts)

	// Удаляем статью
	const removePost = async (obj) =>{
		if(window.confirm('Вы действительно хотите удалить статью?')){
			await axios.delete(`/posts/${obj._id}`).then(navigate(0));
		}
		
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
	
	// Переход на статью
	return (
		<main class="main">

    <section class="posts">
        <div class="container">

            <header class="block__header  _flex--sb">
                <h1>Posts</h1>
				{isAuth && (
              	<Link to='/posts/add'>
                <button class="btn new-post-btn _flex--sb" id="new-post">
                    <svg  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 1V23M23 12H1" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <span>New post</span>
                </button>
				</Link>

            )}
				
            </header>
			{posts && (
					(posts.items).map((obj, index) => (
					// <div class='post' onClick={() => selectedPost(obj)}>
					<Link to = {`/posts/${obj._id}`}>
						<div class='post'>
						<div className="post_header">
							<img src={avatar} alt="avatar" width='50px'/>
							{obj.user !== null ? (
								<h4 className='post_h3'><i>{obj.user.fullName}</i></h4>
							):(<div class=" article__semi-title comment__author"><i>Пользователь удалён</i></div>)}
							
							<h3>{obj.title}</h3>
							{day(obj.createdAt)}
							{hour(obj.createdAt)}
							{fullDate(index)}
							<h4>{date[index]}</h4>
							<img src={looked} alt="" width='18px'/>
							<h4 className='post_looked_num'>{obj.viewsCount}</h4>
							{/* {userData._id === obj.user._id && (
							<button className='post_close' onClick={() => removePost(obj)}><img src={close} alt="" width='20px'/></button>
							)} */}
							</div>
							{obj.imageUrl !== '' && (
								<div class='post_text'> <img src={`http://localhost:4444${obj.imageUrl}`} alt="" /></div>
							)}
							
							<p class='post_text'>{obj.text}</p>
							</div>
						</Link>
				))
			)}

			{/* Кнопка (крестик) чтобы удалить пост напрямую, тут условие чтобы он не показывался на тех постах, которые нельзя удалить, т.к. пользователь не является автором  */}
			{isAuth ? (
				(posts.items).map((obj, index) => (
					<Link to="/comments">
					<div class='post'>
					<div className="post_header">
						<img src={avatar} alt="avatar" width='50px'/>
						<h3 className='post_h3'><i>{obj.user.fullName}</i></h3>
						<h3>{obj.title}</h3>
						{day(obj.createdAt)}
						{hour(obj.createdAt)}
						{fullDate(index)}
						<h4>{date[index]}</h4>

						{userData._id === obj.user._id && (
						<button className='post_close' onClick={() => removePost(obj)}><img src={close} alt="" width='20px'/></button>
						)}
					</div>
					{obj.text}
					</div>
					</Link>
				))
			):(
				(posts.items).map((obj, index) => (
					<div class='post'>
					<div className="post_header">
						<img src={avatar} alt="avatar" width='50px'/>
						<h3 className='post_h3'>{obj.user.fullName}</h3>
						<h3>{obj.title}</h3>
						{day(obj.createdAt)}
						{hour(obj.createdAt)}
						{fullDate(index)}
						<h4>{date[index]}</h4>
					</div>
					{obj.text}
					</div>
				))	
			)}

            <ul class="articles__list">

            </ul>
{/* Пагинаци */}
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
