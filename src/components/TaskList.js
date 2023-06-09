import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const unsubscribe = firestore.collection('tasks').onSnapshot((snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });

    return unsubscribe;
  }, []);

  async function addTask() {
    if (!title || !description) {
      console.log('Please provide a title and description for the task.');
      return;
    }

    try {
      await firestore.collection('tasks').add({
        title,
        description,
        createdAt: new Date(),
        completed: false, // Initial value for completion status
      });
      setTitle('');
      setDescription('');
    } catch (error) {
      console.log('Failed to add task:', error);
    }
  }

  async function updateTask(taskId, updatedTask) {
    try {
      await firestore.collection('tasks').doc(taskId).update(updatedTask);
    } catch (error) {
      console.log('Failed to update task:', error);
    }
  }

  async function deleteTask(taskId) {
    try {
      await firestore.collection('tasks').doc(taskId).delete();
    } catch (error) {
      console.log('Failed to delete task:', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-black text-white">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Task List</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-1/3 bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-1/3 bg-gray-700 text-white"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add Task
          </button>
        </div>
        {tasks.map((task) => (
          <div key={task.id} className="border border-gray-300 rounded-md p-4 mb-4">
            <h3 className="text-lg font-bold mb-2">{task.title}</h3>
            <p className="mb-2">{task.description}</p>
            <p className="text-sm text-gray-500">
              Created At: {task.createdAt.toDate().toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              Completion Status: {task.completed ? 'Completed' : 'Incomplete'}
            </p>
            <div className="mt-2">
              <button
                onClick={() =>
                  updateTask(task.id, { completed: !task.completed })
                }
                className={`${
                  task.completed ? 'bg-green-500' : 'bg-yellow-500'
                } text-white px-4 py-2 rounded-md mr-2`}
              >
                {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;
