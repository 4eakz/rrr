import CommentModel from '../modules/comments.js';

export const getAll = async (req,res) =>{
	try{
		const comments = await CommentModel.find().populate('user').exec();
		res.json(comments)
	} catch (err){
		console.log(err)
		res.status(500).json({
			message:"Не удалось найти комментарии"
		})
	}
}

export const getPost = async (req,res) =>{
	try{
		const postId = req.params.id;

		CommentModel.find({
			post: postId
		},
		(err,doc) =>{
			if (err){
				console.log(err)
				return res.status(500).json({
				message:"Не удалось вернуть комментарии"
				});
			}
			if (!doc){
				return res.status(404).json({
					message:'Комментарии не найдены'
				});
			}
			res.json(doc)
		}).populate('user');
		
	} catch (err){
		console.log(err)
		res.status(500).json({
			message:"Не удалось найти комментарийй"
		})
	}
}

export const remove = async (req,res) =>{
	try{
		const postId = req.params.id;
		
		CommentModel.findOneAndRemove({
			_id: postId,
		}, (err, doc) =>{
			if (err){
				console.log(err)
				res.status(500).json({
				message:"Не удалось удалить статью"
				})
			}
			
			if (!doc){
				return res.status(404).json({
					message:'Статья не найдена'
				});
			}

			res.json({
				success: true,
			})
		});

	} catch (err){
		console.log(err)
		res.status(500).json({
			message:"Не удалось найти статью"
		})
	}
}

export const create = async (req,res) =>{
	try {
		const doc = new CommentModel({
			title: req.body.title,
			text: req.body.text,
			// imageUrl:req.body.imageUrl,
			post: req.body.post,
			user: req.body.user,
			// user: req.params.id,
		})

		const post = await doc.save()
		res.json(post)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message:"Не удалось создать комментарий"
		})
	}
}

// export const update = async (req,res) =>{
// 	try {
// 		const postId = req.params.id;
// 		await PostModel.updateOne({
// 			_id: postId 
// 		},
// 		{
// 			title: req.body.title,
// 			text: req.body.text,
// 			imageUrl:req.body.imageUrl,
// 			tags: req.body.tags,
// 			user: req.userId,
// 		})
// 		res.json({
// 			success: true
// 		})
// 	} catch (err) {
// 		console.log(err)
// 		res.status(500).json({
// 			message:"Не удалось обновить статью"
// 		})
// 	}
// }