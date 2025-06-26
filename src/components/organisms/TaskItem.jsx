import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, isToday, isPast, isThisWeek } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Checkbox from '@/components/atoms/Checkbox'
import Badge from '@/components/atoms/Badge'
import { taskService } from '@/services/api/taskService'
import { projectService } from '@/services/api/projectService'

const priorityConfig = {
  0: { label: 'Low', color: 'bg-gray-400', textColor: 'text-gray-600' },
  1: { label: 'Normal', color: 'bg-blue-500', textColor: 'text-blue-600' },
  2: { label: 'High', color: 'bg-orange-500', textColor: 'text-orange-600' },
  3: { label: 'Urgent', color: 'bg-red-500', textColor: 'text-red-600' }
}

const TaskItem = ({ task, onClick, onUpdate }) => {
  const [project, setProject] = useState(null)
  const [isCompleting, setIsCompleting] = useState(false)
  
  useEffect(() => {
    loadProject()
  }, [task.projectId])
  
  const loadProject = async () => {
    try {
      const projectData = await projectService.getById(task.projectId)
      setProject(projectData)
    } catch (error) {
      console.error('Failed to load project:', error)
    }
  }
  
  const handleComplete = async (e) => {
    e.stopPropagation()
    setIsCompleting(true)
    
    try {
      const updatedTask = task.completed 
        ? await taskService.uncomplete(task.id)
        : await taskService.complete(task.id)
      
      if (onUpdate) {
        onUpdate(updatedTask)
      }
      
      toast.success(task.completed ? 'Task reopened!' : 'Task completed!')
    } catch (error) {
      toast.error('Failed to update task')
      console.error('Error updating task:', error)
    } finally {
      setIsCompleting(false)
    }
  }
  
  const getDueDateDisplay = () => {
    if (!task.dueDate) return null
    
    const dueDate = new Date(task.dueDate)
    const isOverdue = isPast(dueDate) && !isToday(dueDate)
    
    let dateText = ''
    let variant = 'default'
    
    if (isToday(dueDate)) {
      dateText = 'Today'
      variant = 'warning'
    } else if (isOverdue) {
      dateText = `Overdue ${format(dueDate, 'MMM d')}`
      variant = 'error'
    } else if (isThisWeek(dueDate)) {
      dateText = format(dueDate, 'EEE')
      variant = 'info'
    } else {
      dateText = format(dueDate, 'MMM d')
      variant = 'default'
    }
    
    return (
      <Badge variant={variant} size="xs" icon="Calendar">
        {dateText}
      </Badge>
    )
  }
  
  const priority = priorityConfig[task.priority] || priorityConfig[1]
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`card p-4 cursor-pointer relative group ${
        task.completed ? 'opacity-75' : ''
      }`}
    >
      {/* Priority Flag */}
      {task.priority > 1 && (
        <div className={`priority-flag priority-${priority.label.toLowerCase()}`} />
      )}
      
      <div className="flex items-start space-x-3">
        <div className="mt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={handleComplete}
            variant={task.completed ? 'success' : 'default'}
            disabled={isCompleting}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-gray-900 ${
                task.completed ? 'line-through text-gray-500' : ''
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`text-sm mt-1 ${
                  task.completed ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center space-x-2 mt-2">
                {project && project.id !== 'inbox' && (
                  <div className="flex items-center space-x-1">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-xs text-gray-500 font-medium">
                      {project.name}
                    </span>
                  </div>
                )}
                
                {getDueDateDisplay()}
                
                {task.priority > 1 && (
                  <Badge variant="default" size="xs">
                    <ApperIcon name="Flag" size={10} className={priority.textColor} />
                    <span className={priority.textColor}>{priority.label}</span>
                  </Badge>
                )}
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskItem