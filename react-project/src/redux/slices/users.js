import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from '../../axios'

export const fetchUsers = createAsyncThunk('posts/fetchUsers', async() =>{
	const {data} = await axios.get('/users');
	// console.log('users = ',data)
	return data
})

export const fetchRemovePost = createAsyncThunk('posts/fetchRemove', async(id) =>{
	await axios.delete(`/posts/${id}`);
})

const initialState = {
	users: {
		items: [],
		status: 'loading'
	},
};

const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers:{},
	extraReducers:{
		// Загрузка постов
		[fetchUsers.pending]: (state) =>{
			state.users.items = [];
			state.users.status = 'loading';
		},
		[fetchUsers.fulfilled]: (state,action) =>{
			state.users.items = action.payload;
			state.users.status = 'loaded';
		},
		[fetchUsers.rejected]: (state) =>{
			state.users.items = [];
			state.users.status = 'error';
		},
		// Удаление
		[fetchRemovePost.pending]: (state, action) =>{
			state.posts.items = state.posts.items.filter((obj) => obj._id !== action.payload);
		},
	}
})

export const usersReducer = usersSlice.reducer;