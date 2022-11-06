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

export default function PostEdit() {
	// Получаем id статьи из параметров (из Link)
	const {id} = useParams();

	// Записываем результат в data
	const [data, setData] = React.useState();
	React.useEffect(() =>{
		axios.get(`/posts/${id}`).then(res =>{
			setData(res.data);
		}).catch((err) => {
			console.warn(err);
			alert('Ошибка при получении статьи')
		})
	}, [])
	console.log('params', id)
	console.log('data', data)

	// Удаляем статью
	const navigate = useNavigate();
	const removePost = async (obj) =>{
		await axios.delete(`/posts/${obj._id}`).then(navigate('/posts'));
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
		console.log('date ', data.createdAt)
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
		console.log('date ready', date);
	}
	

	return (
		<>
		{data && (
			 <main>
			 <section class="form">
				 <div class="container">
					 <form action="" id="post-editing-form" class="form">
	 
						 <div class="block__header">
							 <h2 class="form__name">Edit post</h2>
						 </div>
						 <label for="post-title" class="form__label">Title</label>
						 <input type="text" class="form__input" defaultValue={data.title}></input>
	 
						 <label for="post-body" class="form__label">Body</label>
						 <textarea class="form__input form__input-textarea" rows="15" >{data.title}</textarea>
					   
						 <input id="post-submit" type="submit" class="btn" value="Save"/>
					 </form>
				 </div>
			 </section>
		 </main>
		)}
		</>
	);
  };
