import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import QuickAddBar from '@/components/molecules/QuickAddBar'
import TaskList from '@/components/organisms/TaskList'
import { taskService } from '@/services/api/taskService'

const TaskView = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    loadTasks()
  }, [])
  
  const loadTasks = async () => {
    try {
      setError('')
      const data = await taskService.getByProject('inbox')
      setTasks(data)
    } catch (error) {
      setError('Failed to load tasks')
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleTaskAdded = (newTask) => {
    if (newTask.projectId === 'inbox') {
      setTasks(prev => [newTask, ...prev])
    }
  }
  
  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
  }
  
  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertCircle" size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadTasks}
            className="btn-primary"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-white to-warm-100">
      <QuickAddBar onTaskAdded={handleTaskAdded} defaultProject="inbox" />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Inbox" size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
                <p className="text-gray-600">Capture everything on your mind</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {tasks.filter(t => !t.completed).length}
              </p>
              <p className="text-sm text-gray-600">active tasks</p>
            </div>
          </div>
          
          <TaskList
            tasks={tasks.filter(task => !task.completed)}
            loading={loading}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            emptyMessage="Your inbox is empty! Add a task above to get started."
            emptyIcon="Inbox"
          />
          
          {tasks.filter(task => task.completed).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <ApperIcon name="CheckCircle2" size={18} className="mr-2 text-green-600" />
                Completed ({tasks.filter(task => task.completed).length})
              </h3>
              <TaskList
                tasks={tasks.filter(task => task.completed)}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default TaskView