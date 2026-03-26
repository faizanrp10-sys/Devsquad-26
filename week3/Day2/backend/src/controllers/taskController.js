const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ owner: req.user.id });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found',
            });
        }

        // Make sure user is task owner
        if (task.owner.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this task',
            });
        }

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.owner = req.user.id;

        const task = await Task.create(req.body);

        res.status(201).json({
            success: true,
            data: task,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found',
            });
        }

        // Make sure user is task owner
        if (task.owner.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to update this task',
            });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found',
            });
        }

        // Make sure user is task owner
        if (task.owner.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to delete this task',
            });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
};
