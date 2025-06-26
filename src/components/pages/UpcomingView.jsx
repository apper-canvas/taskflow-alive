import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, addDays, isToday, isTomorrow, isThisWeek } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import QuickAddBar from '@/components/molecules/QuickAddBar'
import TaskList from '@/components/organisms/TaskList'
import { taskService } from '@/services/api/taskService'

const UpcomingView = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    loadTasks()
  }, [])
  
  const loadTasks = async () => {
    try {
      setError('')
      const data = await taskService.getUpcomingTasks(7)
      setTasks(data)
    } catch (error) {
      setError('Failed to load upcoming tasks')
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleTaskAdded = (newTask) => {
    // Add to upcoming view if it has a future due date
    if (newTask.dueDate) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const dueDate = new Date(newTask.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      
      if (dueDate.getTime() > today.getTime()) {
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
  
  const groupTasksByDate = () => {
    const grouped = {}
    const today = new Date()
    
    // Create date groups for the next 7 days
    for (let i = 1; i <= 7; i++) {
      const date = addDays(today, i)
      const dateKey = format(date, 'yyyy-MM-dd')
      grouped[dateKey] = {
        date,
        tasks: []
      }
    }
    
    // Group tasks by their due date
    tasks.forEach(task => {
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate)
        const dateKey = format(dueDate, 'yyyy-MM-dd')
        
        if (grouped[dateKey]) {
          grouped[dateKey].tasks.push(task)
        }
      }
    })
    
    return Object.values(grouped).filter(group => group.tasks.length > 0)
  }
  
  const getDateLabel = (date) => {
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isThisWeek(date)) return format(date, 'EEEE')
    return format(date, 'MMM d, yyyy')
  }
  
  const activeTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)
  const groupedTasks = groupTasksByDate()
  
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
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="CalendarDays" size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Upcoming</h1>
                <p className="text-gray-600">Next 7 days</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {activeTasks.length}
              </p>
              <p className="text-sm text-gray-600">upcoming tasks</p>
            </div>
          </div>
          
          {/* Weekly Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Week at a Glance</h3>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(7)].map((_, index) => {
                const date = addDays(new Date(), index + 1)
                const dateKey = format(date, 'yyyy-MM-dd')
                const dayTasks = tasks.filter(task => {
                  if (!task.dueDate) return false
                  return format(new Date(task.dueDate), 'yyyy-MM-dd') === dateKey
                })
                
                return (
                  <div key={dateKey} className="text-center">
                    <div className="text-xs font-medium text-gray-600 mb-1">
                      {format(date, 'EEE')}
                    </div>
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {format(date, 'd')}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      dayTasks.length > 0 
                        ? 'bg-primary-100 text-primary-800' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {dayTasks.length}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
          
          {/* Grouped Tasks by Date */}
          {groupedTasks.length > 0 ? (
            <div className="space-y-8">
              {groupedTasks.map((group, index) => (
                <motion.div
                  key={format(group.date, 'yyyy-MM-dd')}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getDateLabel(group.date)}
                    </h3>
                    <div className="text-sm text-gray-500">
                      {format(group.date, 'MMM d')}
                    </div>
                    <div className="flex-1 border-t border-gray-200" />
                    <div className="text-sm text-gray-500">
                      {group.tasks.filter(t => !t.completed).length} active
                    </div>
                  </div>
                  
                  <TaskList
                    tasks={group.tasks.filter(t => !t.completed)}
                    onTaskUpdate={handleTaskUpdate}
                    onTaskDelete={handleTaskDelete}
                  />
                  
                  {group.tasks.filter(t => t.completed).length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">
                        Completed ({group.tasks.filter(t => t.completed).length})
                      </h4>
                      <TaskList
                        tasks={group.tasks.filter(t => t.completed)}
                        onTaskUpdate={handleTaskUpdate}
                        onTaskDelete={handleTaskDelete}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <ApperIcon name="CalendarDays" size={24} className="text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-600">No upcoming tasks in the next 7 days.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default UpcomingView