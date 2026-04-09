const mongoose=require('mongoose');

const taskSchema=new mongoose.Schema({
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    completed: { type: Boolean, default: false },
    dueDate:{type: Date},

    priority:{
        type:String,
        enum:['low','medium','high'],
        default:'medium'

    },
    description: {type: String }


},{timestamps:true});

module.exports=mongoose.model('Task', taskSchema);