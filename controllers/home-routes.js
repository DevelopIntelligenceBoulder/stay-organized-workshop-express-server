const router = require("express").Router();

router.get("/", async (req, res) => {
    res.render("home");
});

router.get("/todos", async (req, res) => {
    res.render("todos");
});

router.get("/new_todo", async (req, res) => {
    res.render("new_todo");
});

router.get("/complete_todo", async (req, res) => {
    res.render("complete_todo");
});

module.exports = router;
