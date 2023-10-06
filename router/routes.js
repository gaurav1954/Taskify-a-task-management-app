const express = require("express")
const User = require('../models/users')
const Task = require('../models/task')
const bcrypt = require('bcrypt')
const router = express.Router()
const methodOverride = require('method-override')
router.use(methodOverride('_method'))
function check(req, res, next) {
    if (req.session.UID) {
        next()
    }
    else {
        res.redirect("/login")
    }
}

router.get('/register', (req, res) => {
    res.render("task-views/register");
});
router.post('/register', async (req, res) => {
    let { username, password, email } = req.body
    password = await bcrypt.hash(password.trim(), 12);
    const user = new User({
        username,
        password,
        email
    })
    await user.save()
    res.redirect('/login')
})
router.get('/login', (req, res) => {
    res.render("task-views/login");
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findAndValidate(username, password);

    if (!user) {
        req.flash('error', 'Invalid username or password');
        return res.redirect('/login'); // Redirect back to the login page
    } else {
        req.session.UID = user._id;
        console.log('User logged in:', user._id);
        // Example in a route handler
        req.flash('success', 'Successfully logged in');

        res.redirect(`/show`);
    }
});

router.get("/ses", async (req, res) => {
    const id = req.session.UID;
    const user = await User.findOne({ username: 'gaurav' }).populate("tasks");
    const { tasks } = user;
    console.log(user.tasks);
    res.send(tasks);
});

router.get("/logout", async (req, res) => {
    console.log('User logged out:', req.session.UID);
    req.session.destroy()
    res.redirect("/login");
});
router.get('/show', check, async (req, res) => {

    const id = req.session.UID;
    const user = await User.findById(id).populate("tasks");
    const { tasks } = user;

    if (tasks.length === 0) {
        return res.render('task-views/welcome', { user });
    }

    tasks.sort((a, b) => {
        const dateA = new Date(a.duedate);
        const dateB = new Date(b.duedate);

        if (dateA < dateB) {
            return -1;
        }
        if (dateA > dateB) {
            return 1;
        }
        return 0;
    });

    const formattedTasks = tasks.map(task => {
        const date = new Date(task.duedate);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString(undefined, options);
        return { ...task._doc, duedate: formattedDate };
    });

    return res.render('task-views/show', { tasks: formattedTasks });

});



router.get("/new", check, async (req, res) => {
    const id = req.session.UID;
    // Await the asynchronous functionm
    const user = await User.findById(id);
    res.render('task-views/new')
});
router.post("/new", async (req, res) => {
    const id = req.session.UID;
    const user = await User.findById(id)
    const task = new Task(req.body);
    user.tasks.push(task)
    await task.save()
        .then(() => {
            console.log("sucessfully saved")
        })
        .catch(() => {
            console.log("err")
        })
    await user.save()
    console.log(task)
    res.redirect("/show")
})
router.get('/:id/edit', async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id)
    const formattedDate = new Date(task.duedate).toISOString().split('T')[0];
    res.render('task-views/edit', { task, formattedDate })

})
router.patch('/edit/:id', async (req, res) => {
    const { id } = req.params
    const { title, duedate, description, priority, comments } = req.body
    const ab = await Task.findByIdAndUpdate(id, { title, duedate, description, priority, comments })
    res.redirect('/show')
})
router.delete('/:id', async (req, res) => {
    const { id } = req.params
    const task = await Task.findById(id)
    const user = await User.findOne({ tasks: { $in: [id] } })
    user.tasks.pull(id);
    await user.save();
    await Task.findByIdAndDelete(id)
    res.redirect('/show')
})
module.exports = router