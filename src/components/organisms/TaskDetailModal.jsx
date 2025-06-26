import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import PrioritySelector from '@/components/molecules/PrioritySelector'
import DatePicker from '@/components/molecules/DatePicker'
import ProjectSelector from '@/components/molecules/ProjectSelector'
import { taskService } from '@/services/api/taskService'

const TaskDetailModal = ({ task, onClose, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    dueDate: task.dueDate,
    projectId: task.projectId
  })
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    
    setLoading(true)
    try {
      const updatedTask = await taskService.update(task.id, {
        ...formData,
        title: formData.title.trim()
      })
      
      onUpdate(updatedTask)
      toast.success('Task updated successfully!')
    } catch (error) {
      toast.error('Failed to update task')
      console.error('Error updating task:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await taskService.delete(task.id)
      onDelete(task.id)
      toast.success('Task deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete task')
      console.error('Error deleting task:', error)
    } finally {
      setDeleteLoading(false)
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="card-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Task</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <ApperIcon name="X" size={20} />
              </motion.button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Task Title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add a description (optional)"
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project
                  </label>
                  <ProjectSelector
                    value={formData.projectId}
                    onChange={(projectId) => setFormData(prev => ({ ...prev, projectId }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <PrioritySelector
                    value={formData.priority}
                    onChange={(priority) => setFormData(prev => ({ ...prev, priority }))}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <DatePicker
                  value={formData.dueDate}
                  onChange={(dueDate) => setFormData(prev => ({ ...prev, dueDate }))}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  icon="Trash2"
                >
                  Delete
                </Button>
                
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={!formData.title.trim()}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="card-elevated w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Task</h3>
                    <p className="text-sm text-gray-600">This action cannot be undone.</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete "{task.title}"?
                </p>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    loading={deleteLoading}
                    onClick={handleDelete}
                  >
                    Delete Task
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}

export default TaskDetailModal