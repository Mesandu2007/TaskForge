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
        status: { $ne: 'Completed' }, 
        reminderSent: false
      }).populate('user');

      if (tasks.length === 0) return;

      const io = app.get('io');
      const users = app.get('users');

      for (const task of tasks) {
        try {
          if (task.user && task.user._id) {
            const userId = task.user._id.toString();
            const userSockets = users.get(userId);

            if (userSockets && userSockets.size > 0) {
              console.log(`[ALIVE] Notifying user ${userId} for task: ${task.title}`);
              userSockets.forEach((socketId) => {
                io.to(socketId).emit('reminder', {
                  message: `Task "${task.title}" is due soon!`,
                  dueDate: task.dueDate
                });
              });
            } else {
              console.log(`[OFFLINE] User ${userId} not connected for task "${task.title}".`);
            }

            
            task.reminderSent = true;
            await task.save();
          } else {
          
            console.warn(`[SKIP] Task "${task.title}" has no associated user.`);
            task.reminderSent = true;
            await task.save();
          }
        } catch (taskErr) {
          console.error(`Error processing reminder for task ${task._id}:`, taskErr);
        }
      }

    } catch (err) {
      console.error("Reminder Job Error:", err);
    }
  });
};

module.exports = startReminderJob;