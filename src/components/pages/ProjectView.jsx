import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import QuickAddBar from '@/components/molecules/QuickAddBar'
import TaskList from '@/components/organisms/TaskList'
import { taskService } from '@/services/api/taskService'
import { projectService } from '@/services/api/projectService'

const ProjectView = () => {
  const { projectId } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    if (projectId) {
      loadProjectData()
    }
  }, [projectId])
  
  const loadProjectData = async () => {
    try {
      setError('')
      const [projectData, tasksData] = await Promise.all([
        projectService.getById(projectId),
        taskService.getByProject(projectId)
      ])
      
      setProject(projectData)
      setTasks(tasksData)
    } catch (error) {
      setError('Failed to load project')
      console.error('Error loading project:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleTaskAdded = (newTask) => {
    if (newTask.projectId === projectId) {
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
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-50 via-white to-warm-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gray-300 rounded-lg" />
              <div className="space-y-2">
                <div className="h-6 bg-gray-300 rounded w-32" />
                <div className="h-4 bg-gray-300 rounded w-24" />
              </div>
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="card p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-gray-300 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4" />
                      <div className="h-3 bg-gray-300 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (error || !project) {
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Project not found</h3>
          <p className="text-gray-600 mb-4">{error || 'The project you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={loadProjectData}
            className="btn-primary"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }
  
  const activeTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-white to-warm-100">
      <QuickAddBar onTaskAdded={handleTaskAdded} defaultProject={projectId} />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: project.color }}
              >
                <ApperIcon name={project.icon} size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <p className="text-gray-600">{tasks.length} total tasks</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {activeTasks.length}
              </p>
              <p className="text-sm text-gray-600">active tasks</p>
            </div>
          </div>
          
          {/* Project Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="List" size={20} className="text-gray-600" />
                </div>
              </div>
            </div>
            
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
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="CheckCircle2" size={20} className="text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-primary-600">{completionRate}%</p>
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" size={20} className="text-primary-600" />
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Progress Bar */}
          {tasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Project Progress</span>
                <span className="text-sm font-medium text-gray-900">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
                  style={{ backgroundColor: project.color }}
                />
              </div>
            </motion.div>
          )}
          
          {/* Active Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="List" size={18} className="mr-2" />
              Active Tasks
            </h3>
            <TaskList
              tasks={activeTasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              emptyMessage={`No active tasks in ${project.name}. Add one above to get started!`}
              emptyIcon={project.icon}
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
                Completed ({completedTasks.length})
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

export default ProjectView