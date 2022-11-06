import express from 'express';
import mongoose from 'mongoose';
import multer from "multer"
import cors from 'cors';
import { registerValidation, loginValidation, postCreateValidation} from './validations.js';
import * as UserController from './controlers/UserController.js';
import * as PostController from './controlers/PostController.js';
import * as CommentsController from './controlers/CommentsController.js';
import checkAuth from './utils/checkAuth.js';
import handleValidationErrors from './utils/handleValidationErrors.js';
mongoose
.connect('mongodb+srv://qwerty:qwerty123@cluster0.ivyl8eo.mongodb.net/auth_roles?retryWrites=true&w=majority')
.then(() =>console.log('DB OK'))
.catch((err) =>console.log('DB ERROR', err));

const app = express();

const storage = multer.diskStorage({
	destination: (req,res, cb) =>{
		cb(null, 'uploads')
	},
	filename: (_, file, cb) =>{
		cb(null, file.originalname)
	},
});

const upload = multer({ storage });
app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'));

app.post('/auth/login',loginValidation, handleValidationErrors,UserController.login); 
app.post('/auth/register',registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/uploads',checkAuth, upload.single('image'), (req,res) => {
	res.json({
		url : `/uploads/${req.file.originalname}`,
	});
});

app.post('/comments', checkAuth, CommentsController.create);
app.get('/comments', CommentsController.getAll);
app.get('/comments/:id', CommentsController.getPost);
app.delete('/comments/:id', checkAuth, CommentsController.remove);

app.get('/users', UserController.getAll);
app.get('/users/:id', UserController.getOne);
app.patch('/users/:id', checkAuth, UserController.update);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.get('/posts/user/:id', PostController.getUser);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(4444, (err) =>{
    if (err){
        return console.log(e);
    }
    console.log('Server OK')
});