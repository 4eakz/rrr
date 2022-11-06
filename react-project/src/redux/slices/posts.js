import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from '../../axios'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async() =>{
	const {data} = await axios.get('/posts');
	return data
})

export const fetchRemovePost = createAsyncThunk('posts/fetchRemove', async(id) =>{
	await axios.delete(`/posts/${id}`);
})

const initialState = {
	posts: {
		items: [],
		status: 'loading'
	},
	tags: {
		items: [],
		status: 'loading'
	}
};

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers:{},
	extraReducers:{
		// Загрузка постов
		[fetchPosts.pending]: (state) =>{
			state.posts.items = [];
			state.posts.status = 'loading';
		},
		[fetchPosts.fulfilled]: (state,action) =>{
			state.posts.items = action.payload;
			state.posts.status = 'loaded';
		},
		[fetchPosts.rejected]: (state) =>{
			state.posts.items = [];
			state.posts.status = 'error';
		},
		// Удаление
		[fetchRemovePost.pending]: (state, action) =>{
			state.posts.items = state.posts.items.filter((obj) => obj._id !== action.payload);
		},
	}
})

export const postsReducer = postsSlice.reducer;