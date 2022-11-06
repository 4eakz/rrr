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
export default function Comments() {
	// Получаем комментарий в comments
	const [comments, setComment] = React.useState();
	React.useEffect(() =>{
		axios.get(`/comments`).then(res =>{
			// Получаем комментарии
			setComment(res.data);
			// Передаём кол-во комментов
			setQuantity(res.data.length);
			setPag('5');
		}).catch((err) => {
			console.warn(err);
			alert('Ошибка при получении комментариев')
		})

	}, [])

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

	// Получаем желаемое кол-во комментов на странице
	let [pag, setPag] = React.useState();

	// Получаем текущею страницу
	let [activePag, setactivePag] = React.useState(1);
	// Получаем какие элементы отоброжать
	let [activePages, setActivePages] = React.useState(['0','1','2','3','4']);
	// let pags = '10'
	// const acceptSetPag = () => {
	// 	console.log('111')
	// 	pags = pag
	// 	pages = Math.ceil(quantity / pags) 
	// 	console.log('pages', pages)
	// 	pushPages()
	// }
	// Получаем общее кол-во комментов
	const [quantity, setQuantity] = React.useState();

	// Вычесляем нужное кол-во страниц
	// let pages = Math.ceil(quantity / pags) 
	let pages
	if(pag >= 5){
		pages = Math.ceil(quantity / pag) 
	}
	else{
		setPag(5)
		// pages = Math.ceil(quantity / 5)
	}

	
	// Выводим пагинацию 
	let listToRender = []
	let main = []

	const pushPages = () =>{
		if(comments){
			for (let i = 1; i <= pages; i++) {
				listToRender.push(<button class="pagination__controls" onClick={() => changeActivePages(i)}>{i}</button>)
			}
		}
	}
	let XactivePages = ['0','1','2','3','4']
	// Кнопки pages
	const changeActivePages = async (num) =>{
		setactivePag(num)
		for (let i = 0; i < pag; i++){
			XactivePages[i] = (pag * num) - (pag - i)	
		}
		setActivePages(XactivePages)
	}

	const changeActiveUp = async () =>{
		if(activePag != pages){
			setactivePag(activePag + 1)
			let num = activePag + 1
			for (let i = 0; i < pag; i++){
				XactivePages[i] = (pag * num) - (pag - i)	
			}
			setActivePages(XactivePages)
		}	
	}

	const changeActiveDown = async () =>{
		if(activePag != 1){
			setactivePag(activePag - 1)
			let num = activePag - 1
			for (let i = 0; i < pag; i++){
				XactivePages[i] = (pag * num) - (pag - i)	
			}
			setActivePages(XactivePages)
		}	
	}


	// Первая страница
	const changeActivePagesFirst = async () =>{
		let num = 1
		setactivePag(num)
		for (let i = 0; i < pag; i++){
			XactivePages[i] = (pag * num) - (pag - i)	
		}
		setActivePages(XactivePages)
	}

	// Последняя страница
	const changeActivePagesLast = async () =>{
		let num = pages
		setactivePag(num)
		for (let i = 0; i < pag; i++){
			XactivePages[i] = (pag * num) - (pag - i)	
		}
		setActivePages(XactivePages)
	}
	const checkIndex = (index) => {
		for (let i = 0; i < activePages.length; i++){
			if (index == activePages[i]){
				return true
			}
		}
		return false
	}
	const navigate = useNavigate();
	const link = (id) =>{

	axios.get(`/users/${id}`).then(res =>{
		navigate(`/users/${id}`)
	}).catch(() => {
		axios.get(`/posts/${id}`).then(res =>{
			navigate(`/posts/${id}`)
		}).catch(() => {
			alert('Пользователь или статья былы удалены!')
		})
		
	})
	// navigate(`/users/${id}`)
	}
	const mainComments = () =>{
		if(comments){
			main.push(
				<header class="block__header  _flex--sb">
                <h2>Comments</h2>
          		</header>

				,(comments).map((obj, index) => (
				checkIndex(index) &&(
				<li class="articles__item">
				<article class="article article--minimized">
					<header class="comment__header block__header flex gap comment_block">
						<div className="gap">
							<h3 class="article__title comment__title">{obj.title}</h3>
							<div className="flex gap comment_fullName">
								{obj.user !== null ? (<Link to = {`/users/${obj.user._id}`}><div class=" article__semi-title comment__author">{obj.user.fullName}</div></Link>):(
									<div class=" article__semi-title comment__author"><i>Пользователь удалён</i></div>
								)}
								
								{/* <div class=" article__semi-title comment__author">{date_comments}</div> */}
								{day(obj.createdAt)}
								{hour(obj.createdAt)}
								{fullDate(index)}
								<div class=" article__semi-title comment__author">{date_comment[index]}</div>
							</div>
						</div><br />
						{/* {userData &&(
							obj.user !== null && (
							userData._id === obj.user._id && (
								<button onClick={() => removeComment(obj)}><img src={close} alt="" width='20px'/></button>
							)
							)
						)} */}
						
					</header>
					<main class="article__main comment__main">

					{/* {pages &&
					(pages).map((obj, index) => (
						<p>{index}</p>
					))} */}
					
						<p class="article__text comment__text">{obj.text}</p>
						<button class="btn read-more-btn" onClick={() => link(obj.post)}>Read more</button>
					</main>
				</article>
				</li>
				)
				))
				)
		}
	}
	mainComments()
	pushPages()
	

	
	return (
		<main>
       <section class=" section comments">
				<div class="container">
					<ul class="articles__list">
						{main}
					</ul>
					<div class="posts__pagination">
						<div class="pagination__nav">
							<div class="pagination__prev-actions pagination__page-list">
								<button class="pagination__controls" onClick={changeActivePagesFirst}><img src={first} alt="select"/></button>
								<button class="pagination__controls" onClick={changeActiveDown}><img src={prev} alt="select"/></button>
							</div>
							<div class="pagination__prev-actions pagination__page-list">

								{/* <a class="pagination__controls pagination__controls--active">1</a> */}
								{listToRender}
							</div>
							<div class="pagination__prev-actions pagination__page-list">
								<button class="pagination__controls" onClick={changeActiveUp}><img src={next} alt="select"/></button>
								<button class="pagination__controls" onClick={changeActivePagesLast}><img src={last} alt="select"/></button>
							</div>
						</div>
		
						<div class="pagination__page-size">
							<label for="page-size">Page size:</label>
							<input type="text" class="page-size__input" id="page-size" defaultValue='5' onChange ={(e) => setPag(e.target.value)}/>
							{/* <button href="#" class="page-size__select"><img src={select} width="15px" alt="select"/></button> */}
							{/* <button href="#" class="page-size__select"><img src={select} width="15px" alt="select" onClick={acceptSetPag}/></button> */}
							min 5
						</div>
					</div>
				</div>
			</section>

    </main>
	);
  };
