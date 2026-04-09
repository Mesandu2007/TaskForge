const cron = require('node-cron');
const Task = require('../models/Task');

const startReminderJob = (app) => {
  cron.schedule('* * * * *', async () => {
    console.log("Checking reminders...");

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    try {
      const tasks = await Task.find({
        dueDate: { $lte: tomorrow, $gte: now },
        reminderSent: false
      }).populate('user');

      const io = app.get('io');
      const users = app.get('users');

      const updates = tasks.map(async (task) => {
        if (task.user) {
          const userId = task.user._id.toString();
          const socketId = users[userId];

          if (socketId) {
            io.to(socketId).emit('reminder', {
              message: `Task "${task.title}" is due soon!`,
              dueDate: task.dueDate
            });
            
            task.reminderSent = true;
            return task.save();
          }
        }
      });

      await Promise.all(updates);

    } catch (err) {
      console.error("Reminder Job Error:", err);
    }
  });
};

module.exports = startReminderJob;