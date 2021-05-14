const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Tag = require("../models/Tag");
const bcrypt = require("bcrypt");

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


// ADD A PRODUCT ROUTE

// GET = display the ADD PRODUCT(SNEAKER)

router.get("/prod-add", (req, res) => {
  res.render("products_add.hbs");
});



// TO DO MEXIGANG!!

router.get("/sneakers/:cat", (req, res) => {
  res.render("products");
});

router.get("/one-product/:id", (req, res) => {
  res.render("baz");
});


module.exports = router;
