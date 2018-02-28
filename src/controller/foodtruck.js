import mongoose from 'mongoose'
import { Router } from 'express'
import FoodTruck from '../model/foodtruck'
import Review from '../model/review'
import bodyParser from 'body-parser'

//lock down
import { authenticate } from '../middleware/authMiddleware'

export default({config,db}) => {
	let api = Router()

	//v1/foodtruck/add
	//authenticate middleware
	api.post('/add', authenticate, (req,res) => {
		let newFoodTruck = new FoodTruck()
		newFoodTruck.name = req.body.name
		newFoodTruck.foodtype = req.body.foodtype
		newFoodTruck.avgcost = req.body.avgcost
		newFoodTruck.geometry.coordinates = req.body.geometry.coordinates

		console.log(newFoodTruck)

		newFoodTruck.save(err => {
			if(err){
				res.send(err)
			}
			res.json({message:'FoodTruck saved successfully'})
		});
	});

	//v1/foodtruck - read
	api.get('/', (req,res) => {
		FoodTruck.find({}, (err,foodtrucks) =>{
			if(err){
				res.send(err)
			}
			res.json({foodtrucks})
		})
	})

	//v1/foodtruck/:id - read 1
	api.get('/:id', (req,res) => {
		FoodTruck.findById(req.params.id, (err,foodtruck) => {
			if(err){
				res.send(err)
			}
			res.json(foodtruck);
		})
	})

	//v1/foodtruck/:id -- update
	api.put('/:id', (req,res) => {
		FoodTruck.findById(req.params.id, (err,foodtruck) => {
			if(err){
				res.send(err)
			}
			foodtruck.name = req.body.name
			foodtruck.foodtype = req.body.foodtype
			foodtruck.save(err => {
				if(err){
					res.send(err)
				}
				res.json({message:'FoodTruck updated'})
			})
		})
	})

	//v1/foodtruck/:id -- delete
	api.delete('/:id', (req,res) => {
		FoodTruck.remove({_id:req.params.id}, (err,foodtruck) => {
			if(err){
				res.send(err)
			}
			res.json({message:'FoodTruck Removed'})
		})
	})

	//add a review
	//v1/foodtruck/reviews/add/:id
	api.post('/reviews/add/:id', (req,res) => {
		FoodTruck.findById(req.params.id, (err,foodtruck) => {
			if(err){
				res.send(err)
			}
			let newReview = new Review()

			newReview.title = req.body.title
			newReview.text = req.body.text
			newReview.foodtruck = foodtruck._id
			newReview.save((err,review) => {
				if(err){
					res.send(err)
				}
				foodtruck.reviews.push(newReview)
				foodtruck.save(err => {
					if(err){
						res.send(err)
					}
					res.json({message:'Food truck review added'})
				})
			})
		})
	})

	//get reviews
	//v1/foodtruck/reviews/:id
	api.get('/reviews/:id', (req,res) => {
		Review.find({foodtruck:req.params.id}, (err,reviews) => {
			if(err){
				res.send(err)
			}
			res.json(reviews)
		})
	})



	return api
}