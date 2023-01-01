const express = require("express");
const { body, validationResult } = require("express-validator");
const { generate, compare } = require("../../lib/passwordHelper");
const { issueJWT, verifyAccessToken } = require("../../lib/jwtHelper");
const { sequelize } = require("../../models");
const router = express.Router();

router.post(
  "/create",
  body("name").not().isEmpty().trim().escape(),
  body("gender").not().isEmpty().trim().escape(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let { name, email, password, gender } = req.body;
      // console.log(sequelize)
      const existingUser = await sequelize.models.Users.findOne({
        where: { email: email },
      });
      if (!existingUser) {
        password = generate(password);
        let user = await sequelize.models.Users.create({
          email: email,
          password: password,
          gender: gender,
          name: name,
          status: "active",
        });
        if (user) {
          res.setHeader("Content-Type", "application/json");
          res.status(200).send({ message: "User created successfully" });
        } else {
          res.setHeader("Content-Type", "application/json");
          res.status(400).send({ message: "Fail to create user" });
        }
      } else {
        res.setHeader("Content-Type", "application/json");
        res.status(400).send({ message: "E-mail already in use" });
      }
    } catch (error) {
      console.error(error);
    }
  }
);

router.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let { email, password } = req.body;
      // console.log(sequelize)
      const existingUser = await sequelize.models.Users.findOne({
        where: { email: email },
      });
      console.log("user ->" + JSON.stringify(existingUser)); //
      if (!existingUser || existingUser.status != "active") {
        res.setHeader("Content-Type", "application/json");
        res.send("invalid username or password");
      } else {
        const validatePwd = compare(password, existingUser.password);
        if (!validatePwd) {
          return res.status(400).send({ message: "Invalid user" });
        } else {
          const accessToken = issueJWT(existingUser.dataValues);
          return res.status(200).json({
            error: "",
            message: "Access granted",
            accessToken: accessToken,
          });
        }
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "500", message: "Fail to login the user" });
    }
  }
);

router.get("/users", async (req, res) => {
  const authHeader = req.headers["authorization"];
  console.log("authHeader => " + authHeader);
  if (!authHeader || authHeader == undefined) {
    res.status(403).json({ error: "Invalid authorization header" });
  } else {
    const token = authHeader;
    console.log(token);
    const isValidToken = verifyAccessToken(token);
    console.log(isValidToken);
    if (isValidToken) {
      const result = await sequelize.models.Users.findAll();
      console.log("result => ", JSON.stringify(result));
      res.status(200).json({ data: result });
    } else {
      res.status(403).json({ message: "unauthenticated" });
    }
  }
});

router.put(
  "/update",
  body("email").not().isEmpty().isEmail().normalizeEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { name, email, password, gender, status } = req.body;
    // console.log(sequelize)
    let user = await sequelize.models.Users.findOne({
      where: { email: email },
    });
    if(name !== undefined && name !== "") {
        user.name = name;
    }
    if(email !== undefined && email !== "") {
        user.email = email;
    }
    if(password !== undefined && password !== "") {
        password = generate(password);
        user.password = password;
    }
    if(gender !== undefined && gender !== "") {
        user.gender = gender;
    }
    if(status !== undefined && status !== "") {
        user.status = status;
    }
  }
);

router.delete(
  "/delete",
  body("email").not().isEmpty().isEmail().normalizeEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { email } = req.body;
    // console.log(sequelize)
    let user = await sequelize.models.Users.findOne({
      where: { email: email },
    });

    if (user) {
      try {
        await sequelize.models.Users.destroy({
          where: {
            email: email,
          },
        });
        res.status(200).json({ message: "Successfully delete user" });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Something went wrong when try to delete user" });
      }
    } else {
      res.status(400).json({ message: "Invalid user" });
    }
  }
);

module.exports = router;
