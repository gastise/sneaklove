const express = require("express");
const router = express.Router();
const Sneaker = require("../models/Sneaker");
const User = require("../models/User");
const Tag = require("../models/Tag");
const bcrypt = require("bcrypt");
const uploader = require("../config/cloudinary");
const protectPrivateRoute = require("./../middlewares/protectPrivateRoute");
const TagModel = require("../models/Tag");


console.log(`\n\n
-----------------------------
-----------------------------
wax on / wax off !
-----------------------------
-----------------------------\n\n`);

// GET- DISPLAY THE HOME PAGE
router.get("/", (req, res) => {
  res.render("index.hbs");
});


// SIGN IN PROCESS

// GET = display the Signin form

router.get("/signin", (req, res) => {
  res.render("signin.hbs");
});

// POST = send the Signin form

router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  const foundUser = await User.findOne({ email: email });

  if (!foundUser) {
    req.flash("error", "Invalid Credentials");
    res.redirect("/signin");
  } else {
    const isSamePassword = bcrypt.compareSync(password, foundUser.password);
    if (!isSamePassword) {
      req.flash("error", "Invalid Credentials");
      res.redirect("/signin");
    } else {
      const userObject = foundUser.toObject();
      delete userObject.password;
      req.session.currentUser = userObject;

      req.flash("Success", "Wouhou Success!");
      res.redirect("/");
    }
  }
});

// SIGN OUT PROCESS

router.get("/logout", (req, res, next) => {
  req.session.destroy(function (err) {
    res.redirect("/signin");
  });
});

// SIGN UP PROCESS

// GET = display the Sign up form

router.get("/signup", (req, res) => {
  res.render("signup.hbs");
});

// POST = send the Sign up form

router.post("/signup", async (req, res, next) => {
  try {
    const newUser = { ...req.body };
    const foundUser = await User.findOne({ email: newUser.email });
    console.log(newUser);
    if (foundUser) {
      req.flash("warning", "email already registered");
      res.redirect("/signup");
    } else {
      const hashedPassword = bcrypt.hashSync(newUser.password, 10);
      newUser.password = hashedPassword;
      await User.create(newUser);
      req.flash("success", "congrats! You are registered");
      res.redirect("/signin");
    }
  } catch (err) {
    var errorMsg = "";
    for (field in err.errors) {
      errorMsg += err.errors[field].message + "\n";
    }
    req.flash("error", errorMsg);
    res.redirect("/signup");
  }
});


// ADD A PRODUCT (SNEAKER)

// GET = submit a PRODUCT (SNEAKER)

router.get("/prod-add", protectPrivateRoute,async(req, res,next) => {
  try {
    const tags= await Tag.find()
    console.log("this is tags label>>>",tags[0].label);
    console.log("this is tags alone>>>",tags[0]);
    res.render("products_add.hbs",{tags});
  } catch (err) {
    next(err);
  }
});

// POST = submit a PRODUCT (SNEAKER)

router.post("/prod-add", uploader.single("picture"), async (req, res, next) => {
  const newSneaker = { ...req.body };
  console.log(newSneaker);
  if (!req.file) newSneaker.picture = undefined;
  else newSneaker.picture = req.file.path;
  try {
    await Sneaker.create(newSneaker);
    res.redirect("/sneakers/collection");
  } catch (err) {
    next(err);
  }
});

// GET = submit a PRODUCT (TAG)

router.get("/tag-add", protectPrivateRoute,(req, res) => {
  res.render("products_add.hbs");
});

// POST = submit a PRODUCT (TAG)

router.post("/tag-add", async (req, res, next) => {
  const newTag = { ...req.body };
  console.log(newTag);
  try {
    await Tag.create(newTag);
    res.redirect("/prod-add");
  } catch (err) {
    next(err);
  }
});

//DISPLAY PRODUCTS BY CATEGORY

router.get("/sneakers/:cat", (req, res) => {
  res.render("products");
});


//ONE MORE TASK FOR THE MEXIGANG -_-

//DISPLAY ONE PRODUCT BY ID

router.get("/one-product/:id", (req, res) => {
  res.render("sneakers/");
});

//UPDATE ONE PRODUCT BY ID

module.exports = router;
