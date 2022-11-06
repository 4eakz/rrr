import { configureStore } from '@reduxjs/toolkit'
import { postsReducer } from './slices/posts';
import { authReducer } from './slices/auth';
import { usersReducer } from './slices/users';
// import axios from '../axios.js'
const store = configureStore ({
	reducer: {
		posts: postsReducer,
		auth: authReducer,
		users: usersReducer,
	} 
})
export default store ;