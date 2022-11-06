import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import userModel from '../modules/user.js';

export const register =  async (req,res) =>{
	try {
		const errors = validationResult(req);
	if (!errors.isEmpty()){
		return res.status(400).json(errors.array());
	}

	const password = req.body.password;
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	const doc = new userModel({
		email:req.body.email,
		fullName:req.body.fullName,
		avatarUrl:req.body.avatarUrl,
		passwordHash: hash
	});

	const user = await doc.save();

	const token = jwt.sign({
		_id: user._id,
	}, 'hashingsecretpassord5213',{
		expiresIn: '30d'
	})
 
	const {passwordHash, ...userData} = user._doc

	res.json({
		...userData,
		token
	});
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message:"Не удалось зарегистрироваться"
		})
	}
}
export const login =  async (req,res) =>{
	try {
		const user = await userModel.findOne({email: req.body.email});
		if (!user){
			return res.status(404).json({
				message:"Пользователь не найден"
			});
		}
	
		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
		if (!isValidPass){
			return res.status(400).json({
				message:"Неверный логи или пароль"
			})
		}

		const token = jwt.sign({
			_id: user._id,
		}, 'hashingsecretpassord5213',{
			expiresIn: '30d'
		})
		const {passwordHash, ...userData} = user._doc

		res.json({
			...userData,
			token
		});
	} catch (err){
		console.log(err)
		res.status(500).json({
			message:"Не получилось авторизоваться"
		})
	}
}
export const getMe = async (req,res) =>{
	try{
		const user = await userModel.findById(req.userId);
		if (!user){
			return req.status(404).json({
				message:'Пользователь не найден'
			})
		}
		const {passwordHash, ...userData} = user._doc;

		res.json(userData);
	} catch(err) {
		console.log(err)
		res.status(500).json({
			message:"Нет доступа"
		})
	}
}

export const getAll = async (req,res) => {
	try{
		const users = await userModel.find();
		if (!users){
			return req.status(404).json({
				message:'Пользователь не найден'
			})
		}
		res.json(users);
	} catch(err) {
		console.log(err)
		res.status(500).json({
			message:"Не удалось найти"
		})
	}
}

export const getOne = async (req,res) =>{
	try{
		const userId = req.params.id;

		userModel.findOneAndUpdate({
			_id: userId
		}, 
		{
			returnDocument: 'after',
		},
		(err,doc) =>{
			if (err){
				console.log(err)
				return res.status(500).json({
				message:"Не удалось вернуть пользователя"
				});
			}
			if (!doc){
				return res.status(404).json({
					message:'Пользователь не найдена'
				});
			}
			res.json(doc)
		});

	} catch (err){
		console.log(err)
		res.status(500).json({
			message:"Не удалось найти пользователя"
		})
	}
}

export const update = async (req,res) =>{
	try {
		const userId = req.params.id;
		await userModel.updateOne({
			_id: userId 
		},
		{
			fullName: req.body.fullName,
		})
		res.json({
			success: true
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message:"Не удалось обновить статью"
		})
	}
}