import React from 'react';
import {Routes, Route } from "react-router-dom";
import Register from './pages/register.jsx';
import Login from './pages/login.jsx';
import Posts from './pages/posts.jsx';
import Posts_add from './pages/posts_add.jsx';
import Comments from './pages/comments.jsx';
import ER404 from './pages/404.jsx';
import FullPost from './pages/fullPost.jsx';
import FullUser from './pages/fullUser';
import Users from './pages/users.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
// import PostEdit from './pages/postEdit';
import  { useDispatch, useSelector} from 'react-redux';
import { fetchAuthMe , selectIsAuth} from './redux/slices/auth.js';
function App() {
	const isAuth = useSelector(selectIsAuth);
	// const dispatch = useDispatch();
	// React.useEffect(() => {
	// 	dispatch(fetchAuthMe())
	// }, [])
	return (
		<>
		<Routes>
			<Route path='/' element = {<Posts/>}/>
			<Route path='/posts/:id' element = {<FullPost/>}/>
			{/* <Route path='/posts/edit/:id' element = {<PostEdit/>}/> */}
			<Route path='/login' element = {<Login/>}/>
			<Route path='/users' element = {<Users/>}/>
			<Route path='/users/:id' element = {<FullUser/>}/>
			<Route path='/posts' element = {<Posts/>}/>
			<Route path='/posts/add' element = {<Posts_add/>}/>
			<Route path='/comments'  element = {<Comments/>}/>
			<Route path='/register' element = {<Register/>}/>
			<Route path='*' element = {<ER404/>}/>
	 	</Routes>
		</>
  )};

export default App;
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
