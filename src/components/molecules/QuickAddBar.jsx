import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import PrioritySelector from '@/components/molecules/PrioritySelector'
import DatePicker from '@/components/molecules/DatePicker'
import ProjectSelector from '@/components/molecules/ProjectSelector'
import { taskService } from '@/services/api/taskService'

const QuickAddBar = ({ onTaskAdded, defaultProject = 'inbox' }) => {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState(1)
  const [dueDate, setDueDate] = useState(null)
  const [projectId, setProjectId] = useState(defaultProject)
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    
    setLoading(true)
    try {
      const newTask = await taskService.create({
        title: title.trim(),
        priority,
        dueDate,
        projectId
      })
      
      setTitle('')
      setPriority(1)
      setDueDate(null)
      setProjectId(defaultProject)
      setIsExpanded(false)
      
      if (onTaskAdded) {
        onTaskAdded(newTask)
      }
      
      toast.success('Task created successfully!')
    } catch (error) {
      toast.error('Failed to create task')
      console.error('Error creating task:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      setIsExpanded(false)
      setTitle('')
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100 p-4"
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon 
                name="Plus" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                onKeyDown={handleKeyDown}
                placeholder="Add a task... (type and press Enter)"
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm focus:shadow-md"
              />
            </div>
          </div>
          
          {title.trim() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2"
            >
              <Button 
                type="submit" 
                loading={loading}
                size="md"
                className="shrink-0"
              >
                Add Task
              </Button>
            </motion.div>
          )}
        </div>
        
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
            className="mt-3 flex flex-wrap items-center gap-3"
          >
            <ProjectSelector 
              value={projectId}
              onChange={setProjectId}
            />
            <DatePicker 
              value={dueDate}
              onChange={setDueDate}
            />
            <PrioritySelector 
              value={priority}
              onChange={setPriority}
            />
            
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsExpanded(false)
                setTitle('')
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <ApperIcon name="X" size={16} />
            </motion.button>
          </motion.div>
        )}
      </form>
    </motion.div>
  )
}

export default QuickAddBar