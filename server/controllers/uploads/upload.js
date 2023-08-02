const router = require("express").Router();
const { Brand, Category, Book, Prod_Images, APlus_Images } = require('../../models')
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//send new book PDF/ZIP TO Cloudinary
router.post('/book/file', upload.single('file'), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    cloudinary.uploader.upload_stream({
      resource_type: 'auto',
      public_id: `Downloads/${req.file.originalname}`
    }, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to upload file to Cloudinary' });
      }
      console.log(result);
      res.status(200).json({ message: 'File uploaded successfully' });
    }).end(fileBuffer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file to Cloudinary' });
  }
});



//send thumbnails to cloudinary
router.post('/book/thumbnails', upload.array('thumbnails'), async (req, res) => {
  try {
    const thumbnails = req.files;
    const promises = [];
    const imageUrls = []; // Array to store the Cloudinary URLs

    thumbnails.forEach(thumbnail => {
      const promise = new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          resource_type: 'image',
          public_id: `Thumbnails/${thumbnail.originalname}`
        }, (error, result) => {
          if (error) {
            console.error(error);
            reject(error);
          } else {
            const imageUrl = result.secure_url; // Get the Cloudinary URL
            imageUrls.push(imageUrl); // Store the URL in the array
            console.log(result);
            resolve(result);
          }
        }).end(thumbnail.buffer);
      });

      promises.push(promise);
    });

    await Promise.all(promises);

    res.status(200).json({ message: 'Files uploaded successfully', imageUrls });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload files to Cloudinary' });
  }
});

//send new book data to db
router.post('/book/data', async (req, res) => {
  console.log("SENDING BOOK DATA")
  try {
    const bookData = await Book.create({
      title: req.body.title,
      display_title: req.body.display_title,
      subtitle: req.body.subtitle,
      brand_id: req.body.brand_id,
      category_id: req.body.category_id,
      description: req.body.description,
      type: req.body.type,
      extension: req.body.extension,
      front_thumbnail: req.body.front_thumbnail,
      back_thumbnail: req.body.back_thumbnail
    });
    res.status(200).json(bookData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Send product image data to db
router.post('/book/productimg/data', async (req, res) => {
  console.log("SENDING BOOK DATA ")
  try {
    const imageData = await Prod_Images.create({
      product_id: req.body.product_id,
      name: req.body.name,
      alt_text: req.body.alt_text,
      url: req.body.url
    });
    res.status(200).json(imageData)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "EEEERRRRROOOOOORRRRR"
    });
  }
})

//send product images to Cloudinary

router.post('/book/productimage', upload.single('productimage'), async (req, res) => {
  try {
    const productImage = req.file;
    console.log(req.file)
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        resource_type: 'image',
        public_id: `Product-Pics/${productImage.originalname}`
      }, (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          console.log(result);
          resolve(result);
        }
      }).end(productImage.buffer);
    });

    const imageUrl = result.secure_url; // Extract the Cloudinary image URL from the result

    res.status(200).json({ message: 'File uploaded successfully', imageUrl });
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ error: 'Failed to upload file to Cloudinary', detail: error.message });
  }
});

//send product images to Cloudinary

router.post('/book/aplusimage', upload.single('productimage'), async (req, res) => {
  try {
    console.log("SENDING A+ CONTENT TO CLOUDINARY")
    const productImage = req.file;
    console.log(req.file)
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        resource_type: 'image',
        public_id: `A-Plus-Images/${productImage.originalname}`
      }, (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          console.log(result);
          resolve(result);
        }
      }).end(productImage.buffer);
    });

    const imageUrl = result.secure_url; // Extract the Cloudinary image URL from the result

    res.status(200).json({ message: 'File uploaded successfully', imageUrl });
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ error: 'Failed to upload file to Cloudinary', detail: error.message });
  }
});

//Send A+ image data to db
router.post('/book/aplusimage/data', async (req, res) => {
  console.log("SENDING A+ CONTENT DATA");
  try {
    const imageData = await APlus_Images.create({
      product_id: req.body.product_id,
      alt_text: req.body.alt_text,
      name: req.body.name,
      url: req.body.url
    });
    res.status(200).json({ message: "A+ content upload success" });
  } catch (err) {
    console.log(err);
  }
});

//create new category
router.post('/category', async (req, res) => {
  try {
    const category = await Category.create({
      category_name: req.body.category_name
    });
    res.status(200).json(category)
  } catch (err) {
    console.log(err);
    res.status(500).json(err)
  }
})

//get all categories
router.get('/category', async (req, res) => {
  console.log("ROUTE HIT")
  try {
    const allCategories = await Category.findAll({
      order: [["id", "ASC"]],
    });
    const categories = allCategories.map((category) => category.get({ plain: true }))
    res.send(categories)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

//create new brand
router.post('/brand', async (req, res) => {
  try {
    const brand = await Brand.create({
      brand_name: req.body.brand_name
    });
    res.status(200).json(brand)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

//get all brands
router.get('/brand', async (req, res) => {
  console.log("ROUTE HIT")
  try {
    const allBrands = await Brand.findAll({
      order: [["id", "ASC"]],
    });
    const brands = allBrands.map((brand) => brand.get({ plain: true }))
    res.send(brands)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})
module.exports = router;