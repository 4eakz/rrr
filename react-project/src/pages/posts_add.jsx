import React from 'react';
import { useNavigate } from "react-router-dom";
import axios from '../axios.js'
import '../components/normalize.css'
import '../components/style.css'
import '../components/article.css'
import '../components/pagination.css'
import '../components/myFastCss.css'
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuth, fetchAuthMe } from '../redux/slices/auth.js';
export default function Posts_add() {
	const inputFileRef = React.useRef(null)
	const [imageUrl, setImageUrl] = React.useState('');
	const handleChangeFule = async (event) => {
		console.log(event.target.files)
		try {
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
	const onChange = React.useCallback((value) => {
		setText(value);
	}, [])
	console.log({ title, text })

	const dispatch = useDispatch();
	React.useEffect(() => {
		dispatch(fetchAuthMe())
	}, [])
	const userData = useSelector(state => state.auth.data);
	const user = userData;
	const navigate = useNavigate();
	const onSubmit = async () => {
		try {
			console.log(imageUrl)
			const fields = {
				title, text, user, imageUrl
			}
			await axios.post('/posts', fields).then(navigate('/posts'));
		} catch (err) {
			console.warn(err);
			alert('Ошибка при создании статьи!')
		}
	}
	return (
		<main>
			<section class="form">
				<form action="" id="post-creating-form" class="form">
					<div class="AR">
						<div class="container-xl ">
							<div class="alert alert-dark shadow-sm " role="alert">
								<div clss="vert">
								</div>
								<div class="col-6 offset-3">
									<h2>Create post</h2>
									<div class="alert alert-secondary shadow-sm" role="alert">
										<div class="mb-3">
											<label for="postTitle" class="form__label">Заголовок</label>
											<input type="text" id="postTitle" class="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
										</div>
										<div class="form-group">
											<label for="postBody" class="form__label">Содержание</label>
											<textarea id="postBody" class="form-control" rows="12" value={text} onChange={(e) => setText(e.target.value)}></textarea>
										</div>
										<br />
										{imageUrl && (
											<div className='mb20'><img class="imgr" src={`http://localhost:4444${imageUrl}`} alt="" /></div>
										)}
										<div class="tt">

											<a onClick={() => inputFileRef.current.click()}> <button class='btn btn-dark'>Вставить картинку ←</button></a>
											<input ref={inputFileRef} hidden type="file" id="upload" onChange={handleChangeFule} />

											{imageUrl && (

												<>
													<a onClick={() => onClickRemoveImage()}><p class='btn btn-dark'>Убрать картинку ←</p></a>
												</>
											)}
											<p type="submit" class="btn btn-dark" value="Add post" onClick={onSubmit} >Add post</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</section>

		</main>
	);
};
