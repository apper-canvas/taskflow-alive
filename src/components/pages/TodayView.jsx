import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import QuickAddBar from '@/components/molecules/QuickAddBar'
import TaskList from '@/components/organisms/TaskList'
import { taskService } from '@/services/api/taskService'

const TodayView = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    loadTasks()
  }, [])
  
  const loadTasks = async () => {
    try {
      setError('')
      const data = await taskService.getTodayTasks()
      setTasks(data)
    } catch (error) {
      setError('Failed to load today\'s tasks')
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleTaskAdded = (newTask) => {
    // Only add to today view if it's due today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (newTask.dueDate) {
      const dueDate = new Date(newTask.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      
      if (dueDate.getTime() <= today.getTime()) {
        setTasks(prev => [newTask, ...prev])
      }
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
  
  const today = new Date()
  const activeTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)
  const overdueTasks = activeTasks.filter(task => {
    if (!task.dueDate) return false
    const dueDate = new Date(task.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)
    return dueDate.getTime() < todayDate.getTime()
  })
  
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
      <QuickAddBar onTaskAdded={handleTaskAdded} />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Calendar" size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Today</h1>
                <p className="text-gray-600">{format(today, 'EEEE, MMMM d')}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {activeTasks.length}
              </p>
              <p className="text-sm text-gray-600">tasks remaining</p>
            </div>
          </div>
          
          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-blue-600">{activeTasks.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Clock" size={20} className="text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{overdueTasks.length}</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="CheckCircle2" size={20} className="text-green-600" />
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                <ApperIcon name="AlertTriangle" size={18} className="mr-2" />
                Overdue ({overdueTasks.length})
              </h3>
              <TaskList
                tasks={overdueTasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
              />
            </motion.div>
          )}
          
          {/* Today's Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Calendar" size={18} className="mr-2" />
              Today's Tasks
            </h3>
            <TaskList
              tasks={activeTasks.filter(task => !overdueTasks.includes(task))}
              loading={loading}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              emptyMessage="No tasks scheduled for today. Great job staying organized!"
              emptyIcon="Calendar"
            />
          </motion.div>
          
          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <ApperIcon name="CheckCircle2" size={18} className="mr-2 text-green-600" />
                Completed Today ({completedTasks.length})
              </h3>
              <TaskList
                tasks={completedTasks}
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

export default TodayView