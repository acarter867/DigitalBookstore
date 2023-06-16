const router = require('express').Router();
const { Book } = require('../../models');
const {Op} = require('sequelize');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });


//get book by id
router.get('/book/:id', async(req, res) => {
    try{
        const bookData = await Book.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!bookData){
            res.status(404).json({
                message: "Boook Not Found"
            })
        }else{
            res.status(200).json(bookData)
        }
        
    }catch(err){
        res.status(500).json(err);
    }
});

//get ALL books of specific category
router.get('/book/category/:category_id', async(req, res) => {
    try{
        const bookData = await Book.findAll({
            where: {
                category_id: req.params.category_id
            }
        });

        if(!bookData){
            res.status(404).json({
                message: "Category Not Found"
            });
        }else{
            res.status(200).json(bookData)
        }
    }catch(err){
        res.status(500).json(err)
    }
});

//get ALL books of specific brand
router.get('/book/brand/:brand_id', async(req, res) => {
    try{
        const bookData = await Book.findAll({
            where:{
                brand_id: req.params.brand_id
            }
        });
        if(!bookData){
            res.status(404).json({
                message: "Brand Not Found"
            });
        }else{
            res.status(200).json(bookData)
        }
    }catch(err){
        res.status(500).json(err)
    }
});

//Search books by title 
router.get('/book/title/:query', async(req, res) => {
    const query = req.params.query;
    console.log(query)
    console.log()
    try {
      const bookData = await Book.findAll({
        where: {
            title: {
                [Op.like]: `%${query}%` 
            }
        }
      });
      if(!bookData){
        res.status(404).json({
            message: "Book Not Found"
        })
      }else{
        res.status(200).json(bookData)
      }
  
    }catch(err){
        res.status(500).json(err)
    }
});

//Search books by description
router.get('/book/description/:query', async(req, res) => {
    const query = req.params.query;

    try{
        const bookData = await Book.findAll({
            where: {
                description: {
                    [Op.like]: `%${query}%`
                }
            }
        });
        if(!bookData){
            res.status(404).json({
                message: "Book Not Found!"
            })
        }else{
            res.status(200).json(bookData)
        }
    }catch(err){
        res.status(500).json(err)
    }
});
module.exports = router;