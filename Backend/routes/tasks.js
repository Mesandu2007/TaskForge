  
const router = require('express').Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const auth = require('../middleware/auth');


router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE
router.post('/', auth, async (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const{title,description,dueDate,priority}=req.body;
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      user: req.user.id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE

router.put('/:id', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid Task ID format" });
  }

  try {
    const updates = {};

    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.completed !== undefined) updates.completed = req.body.completed;
    if (req.body.dueDate !== undefined) {
      updates.dueDate = req.body.dueDate;
      updates.reminderSent = false; 
    }
    if (req.body.priority !== undefined) updates.priority = req.body.priority;
    if (req.body.description !== undefined) updates.description= req.body.description;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: "Not found" });

    res.json(task);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// DELETE
router.delete('/:id', auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid Task ID format" });
  }

  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;