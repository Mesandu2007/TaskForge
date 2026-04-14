const cron = require('node-cron');
const Task = require('../models/Task');

const startReminderJob = (app) => {
  cron.schedule('* * * * *', async () => {
    console.log("Checking reminders...");

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    try {
      const tasks = await Task.find({
        dueDate: { $lte: tomorrow },
        reminderSent: false
      }).populate('user');

      if (tasks.length === 0) return;

      const io = app.get('io');
      const users = app.get('users');

      const updates = tasks.map(async (task) => {
        if (task.user && task.user._id) {
          const userId = task.user._id.toString();
          
          const userSockets = users.get(userId);

          if (userSockets && userSockets.size > 0) {
            console.log(`[ALIVE] Notifying user ${userId} for task: ${task.title}`);
            // Loop through all active connections (tabs) for this user
            userSockets.forEach((socketId) => {
              io.to(socketId).emit('reminder', {
                message: `Task "${task.title}" is due soon!`,
                dueDate: task.dueDate
              });
            });
            
            task.reminderSent = true;
            return task.save();
          } else {
            
            console.log(`[OFFLINE] User ${userId} not connected for task "${task.title}".`);
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