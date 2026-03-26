import { v4 as uuidv4 } from 'uuid';

let tasks = [
  { id: uuidv4(), title: 'Learn Express', completed: false }
];

// @desc    Get all tasks
// @route   GET /api/tasks
exports.getTasks = (req, res) => {
  let resultTasks = [...tasks];

  if (req.query.title) {
    resultTasks = resultTasks.filter(task =>
      task.title.toLowerCase().includes(req.query.title.toLowerCase())
    );
  }

  res.status(200).json({
    success: true,
    data: resultTasks,
    message: "Tasks retrieved successfully"
  });
};

// @desc    Get single task
// @route   GET /api/tasks/:id
exports.getTask = (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: `Task not found with id of ${req.params.id}`
    });
  }

  res.status(200).json({
    success: true,
    data: task,
    message: "Task retrieved successfully"
  });
};

// @desc    Create new task
// @route   POST /api/tasks
exports.createTask = (req, res) => {
  const { title, completed } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({
      success: false,
      message: "Please add a valid title (string required)"
    });
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: "completed field must be a boolean"
    });
  }

  const task = {
    id: uuidv4(),
    title,
    completed: completed || false
  };

  tasks.push(task);

  res.status(201).json({
    success: true,
    data: task,
    message: "Task created successfully"
  });
};

// @desc    Update task
// @route   PUT /api/tasks/:id
exports.updateTask = (req, res) => {
  const { title, completed } = req.body;
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Task not found with id of ${req.params.id}`
    });
  }

  if (title !== undefined && typeof title !== 'string') {
    return res.status(400).json({
      success: false,
      message: "valid title string is required"
    });
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: "completed field must be a boolean"
    });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title !== undefined ? title : tasks[taskIndex].title,
    completed: completed !== undefined ? completed : tasks[taskIndex].completed
  };

  res.status(200).json({
    success: true,
    data: tasks[taskIndex],
    message: "Task updated successfully"
  });
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
exports.deleteTask = (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Task not found with id of ${req.params.id}`
    });
  }

  tasks.splice(taskIndex, 1);

  res.status(200).json({
    success: true,
    data: {},
    message: "Task removed successfully"
  });
};

// @desc    Get API Stats
// @route   GET /api/stats
exports.getStats = (req, res) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  res.status(200).json({
    success: true,
    data: {
      total,
      completed,
      pending
    },
    message: "Stats retrieved successfully"
  });
};
