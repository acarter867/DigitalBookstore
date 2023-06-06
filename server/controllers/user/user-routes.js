const { User } = require('../../models')
const {Op} = require('sequelize');
const router = require('express').Router()

//Create new user
router.post('/create', async(req, res) => {
    try{
        const userData = await User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });
        req.session.save(() => {
            req.session.username = userData.username;
            req.session.loggedIn = true;
            req.session.userId = userData.id;
            res.status(200).json(userData.id)
        });
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
});

//check username availability
router.get('/username', async(req, res) => {
    try {
      const username = await User.findOne({
        where: {
          username: req.query.username
        }
      });
  
      if (!username) {
        res.status(204).json({message: "Available"});
      } else {
        res.status(200).json({message: "Unavailable"});
      }
    } catch(err) {
      console.log(err);
      res.status(500).json({message: "Something went wrong, please try again"});
    }
  });

//existing user login
router.post('/login', async(req, res) => {
    try{
      const userData = await User.findOne({
        where: {
          [Op.or]: [
            { email: req.body.login },
            { username: req.body.login }
          ]
        }
      })
  
      if(!userData){
        res.status(400).json({message: "Invalid username or email"});
        return;
      }
  
      const isValidPassword = await userData.checkPassword(req.body.password)
  
      if(!isValidPassword){
        res.status(400).json({message: "Invalid Password"});
        return;
      }
  
      req.session.save(() => {
        req.session.username = userData.username;
        req.session.loggedIn = true;
        req.session.userId = userData.id;
        req.session.isAdmin = userData.is_admin;
        const response = { message: "Successful login", userData: userData };
        res.status(200).json(response);
      });
          
    }catch(err){
      console.log(err)
      res.status(500).json(err)
    }
  });

//user logout
router.post('/logout', (req, res) => {
    try{
        if(req.session.loggedIn){
            req.session.destroy(() => {
                res.status(204).json({message: "logged out"}).end();
            });
        }else{
            res.status(500).end()
        }
    }catch(err){
        res.status(500).json(err)
    }
});

//update user password
router.put('/password', async(req, res) => {
    try{
        const userId = req.session.userId;
        const {oldPassword, newPassword} = req.body;

        const userData = await User.findOne({
            where: {
                id: userId
            }
        });

        const isValidPassword = User.checkPassword(oldPassword)

        if(!isValidPassword){
            res.status(200).json({
                message: "Invalid password"
            });
            return;
        }

        userData.password = newPassword;
        await userData.save();

        res.status(200).json({
            message: "Password updated"
        });
    }catch(err){
        res.status(500).json(err)
    }
});

//delete user profile
router.delete('/delete', async(req, res) => {
    try{
        const userId = req.session.userId;

        const userData = await User.findOne({
            where: {
                user_id: userId
            }
        });

        if(!userData){
            res.status(500).json({message: "User not found"});
            return;
        }
        const password = req.body.password;
        const isValidPassword = User.checkPassword(password);

        if(!isValidPassword){
            res.status(500).json({message: "invalid password"})
            return;
        }

        await userData.destroy();
        res.status(200).json({message: "User deleted successfully"})
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
});

router.get('/admin', (req, res) => {
  try{
    if(req.session.loggedIn){
        if(req.session.isAdmin){
        console.log("confirmed admin")
        res.status(200).json({
            message: "Success",
            "isAdmin": true
        });
        return;
    }else{
        console.log(req.session)
        console.log("not admin")
        res.status(204)
    }
  }else{
    res.status(204)
  }}catch(err){
    res.status(500).json(err)
  }

});


module.exports = router