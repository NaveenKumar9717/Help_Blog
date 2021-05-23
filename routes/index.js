const express = require("express");
const router = express.Router();
const { checkAuth, ensureGuest } = require("../middleware/auth");
const Story = require('../models/Story')
router.get("/", ensureGuest, (req, res) => {
  res.render("Login", {
    layout: "login",
  });
});

router.get("/dashboard", checkAuth, async (req, res) => {
  try{
    
const stories = await Story.find({ user : req.user.id}).lean()


res.render("dashboard", {
  name: req.user.firstName,
  stories,
});


} catch (err){
 console.log(err)
 console.log('error/503') 
}
});

module.exports = router;
