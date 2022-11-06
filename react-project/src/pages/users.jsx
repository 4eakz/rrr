import React from 'react';
import {Link} from "react-router-dom";
import axios from '../axios.js'
import '../components/normalize.css'
import '../components/style.css'
import '../components/article.css'
import '../components/pagination.css'
import '../components/myFastCss.css'
import { fetchPosts} from '../redux/slices/posts.js';
import {fetchUsers} from '../redux/slices/users.js';
import {useNavigate} from "react-router-dom";
import  { useDispatch, useSelector} from 'react-redux';
import {selectIsAuth, fetchAuthMe} from '../redux/slices/auth.js';


export default function Users() {

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);
	React.useEffect(() =>{
		dispatch(fetchPosts())
	}, [])
	const {posts} = useSelector(state => state.posts);
	React.useEffect(() =>{
		dispatch(fetchAuthMe())
	}, [])
	const userData = useSelector(state => state.auth.data);
	
	const [usersLength, setusersLength] = React.useState();
	const [commentLength, setCommentLength] = React.useState();
	const [users, setUsers] = React.useState();
	React.useEffect(() =>{
		axios.get(`/users`).then(res =>{
			setUsers(res.data);
			setusersLength(res.data.length)
		}).catch((err) => {
			console.warn(err);
			alert('Ошибка при получении комментариев')
		})

	}, [])

	const [comments, setComment] = React.useState();
	React.useEffect(() =>{
		axios.get(`/comments`).then(res =>{

			setComment(res.data);
	
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

	return (
		
		<main>
			 <div class="AR">
				
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous"></link>
<div class="container-xl ">
	 <div class="alert alert-dark shadow-sm">
	 <div class="col-6 offset-3">
    <section class="posts">
        <div class="container">
			{users && (
					(users).map((obj, index) => (
						<div class='post'>
							 <a >
                         	<div class="alert alert-secondary shadow-sm">
							<div className="post_header">
								
							<Link to = {`/users/${obj._id}`}>
								
								<h3 class="fw-bolder" className='post_h3'><i><a class="nav-link active" aria-current="page">{obj.fullName}</a></i></h3>
								
								</Link>
							</div>
							<hr/>
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
							</a>
							
						</div>
					
				))
			)}

           
        </div>
    </section>
	</div>
	</div>
	</div>
	</div>
</main>
	);
  };