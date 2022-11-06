import React from 'react';
import '../components/normalize.css'
import '../components/style.css'
import '../components/article.css'
import '../components/pagination.css'
import '../components/myFastCss.css'
import axios from '../axios.js'
import {useNavigate, Link , useParams} from "react-router-dom";
import  { useDispatch, useSelector} from 'react-redux';
import {selectIsAuth, fetchAuthMe} from '../redux/slices/auth.js';
import close from './img/close.png'
export default function Comments() {
	const [comments, setComment] = React.useState();
	React.useEffect(() =>{
		axios.get(`/comments`).then(res =>{
	
			setComment(res.data);
			setQuantity(res.data.length);
			setPag('5');
		}).catch((err) => {
			console.warn(err);
			alert('Ошибка при получении комментариев')
		})

	}, [])
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
	let [pag, setPag] = React.useState();

	let [activePag, setactivePag] = React.useState(1);
	let [activePages, setActivePages] = React.useState(['0','1','2','3','4']);
	const [quantity, setQuantity] = React.useState();

	let pages
	if(pag >= 5){
		pages = Math.ceil(quantity / pag) 
	}
	else{
		setPag(5)
		
	}

	

	let listToRender = []
	let main = []

	const pushPages = () =>{
		if(comments){
			for (let i = 1; i <= pages; i++) {
				listToRender.push(<button class="page-link" onClick={() => changeActivePages(i)}>{i}</button>)
			}
		}
	}
	let XactivePages = ['0','1','2','3','4']

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
	const changeActivePagesFirst = async () =>{
		let num = 1
		setactivePag(num)
		for (let i = 0; i < pag; i++){
			XactivePages[i] = (pag * num) - (pag - i)	
		}
		setActivePages(XactivePages)
	}
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
	}
	const mainComments = () =>{
		if(comments){
			main.push(

				<header class="block__header  _flex--sb">
                <h2>Comments</h2>
          		</header>

,(comments).map((obj, index) => (
	checkIndex(index) &&(
					
							<div class="alert alert-secondary shadow-sm" role="alert">
				<article class="article article--minimized">
					<header class="comment__header block__header flex gap comment_block">
						<div className="gap">
							<h3 class="article__title comment__title">{obj.title}</h3>
							<div className="flex gap comment_fullName">
								{obj.user !== null ? (<Link to = {`/users/${obj.user._id}`}><div class=" article__semi-title comment__author">{obj.user.fullName}</div></Link>):(
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
						<button class="btn read-more-btn btn-dark" onClick={() => link(obj.post)}>Read more</button>
					</main>
				</article>
				</div>
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
						<nav aria-label="Page navigation example">
						<ul class="pagination justify-content-center">
						<li class="page-item"><a class="page-link" onClick={changeActiveDown}>Previous</a></li>
						{listToRender}
						<li class="page-item"><a class="page-link" onClick={changeActiveUp}>Next</a></li>
					</ul>
					</nav>
				</div>
			</section>
			
   	 </main>
		);
	
 	};
