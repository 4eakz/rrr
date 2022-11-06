import React from 'react';
import {useNavigate} from "react-router-dom";
import axios from '../axios.js'
import '../components/normalize.css'
import '../components/style.css'
import '../components/article.css'
import '../components/pagination.css'
import '../components/myFastCss.css'
import  { useDispatch, useSelector} from 'react-redux';
import {selectIsAuth, fetchAuthMe} from '../redux/slices/auth.js';
export default function Posts_add() {
	const inputFileRef = React.useRef(null)
	const [imageUrl, setImageUrl] = React.useState('');
	const handleChangeFule = async (event) => {
		console.log(event.target.files)
		try{
			const formData = new FormData();
			const file = event.target.files[0]
			formData.append('image', file);
			const { data } = await axios.post('/uploads', formData); 
			console.log(data)
			setImageUrl(data.url)

		} catch (err) {
			console.warn(err);
			alert('Ошибка при загрузке файла')
		}
	}
	const onClickRemoveImage = () => {
		setImageUrl('')
	}
	const [title, setTitle] = React.useState('');
	const [text, setText] = React.useState('');
	const onChange = React.useCallback((value)=>{
		setText(value);
	},[])
	console.log({title, text})
	
	const dispatch = useDispatch();
	React.useEffect(() =>{
		dispatch(fetchAuthMe())
	}, [])
	const userData = useSelector(state => state.auth.data);
	const user = userData;
	const navigate = useNavigate();
	const onSubmit = async () => {
		try {
			// setLoading(true);
			console.log(imageUrl)
			const fields = {
				title, text, user, imageUrl
			}
			await axios.post('/posts', fields).then(navigate('/posts'));
			
			// const {data} = await axios.post('/posts', fields);
			// const id = data._id;
			

		} catch (err) {
			console.warn(err);
			alert('Ошибка при создании статьи!')
		}
	}
	return (
		<main>
        <section class="form">
            <div class="container">
                <form action="" id="post-creating-form" class="form">

                    <div class="block__header">
                        <h2 class="form__name">Create post</h2>
                    </div>

                    <p class="form__label">Image</p>
					{imageUrl &&(
						<div className='mb20'><img src={`http://localhost:4444${imageUrl}`} alt="" /></div>

					)}
					<a onClick={() => inputFileRef.current.click()} className='btn_image mb20'><p className='btn_image_text'>Вставить картинку</p></a>
					<input ref={inputFileRef} hidden type="file" id="upload" onChange={handleChangeFule}/>
					{imageUrl &&(
						<>
						<a onClick={() => onClickRemoveImage()} className='btn_image mb20 ml20'><p className='btn_image_text'>Удалить картинку</p></a>
						</>

					)}
                    <label for="postTitle" class="form__label">Title</label>
                    <input type="text" id="postTitle" class="form__input" value={title} onChange ={(e) => setTitle(e.target.value)}/>

                    <label for="postBody" class="form__label">Body</label>
                    <textarea id="postBody"  class="form__input form__input-textarea" rows="15" value={text} onChange ={(e) => setText(e.target.value)}></textarea>
					{/* <label for='inputFile'>123123123</label> */}
					{/* <input id='inputFile hidden' type="file"/> */}
						<input type="submit" class="btn" value="Add post" onClick={onSubmit}/>
					
                    <span class="_caution form__error"></span>
                </form>
				
            </div>
        </section>
		
    </main>
	);
  };
