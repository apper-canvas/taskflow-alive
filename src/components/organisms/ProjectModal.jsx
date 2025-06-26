import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'

const projectColors = [
  '#DC4C3F', '#F59E0B', '#22C55E', '#3B82F6', '#8B5CF6',
  '#EF4444', '#F97316', '#84CC16', '#06B6D4', '#A855F7',
  '#EC4899', '#6B7280', '#14B8A6', '#F59E0B', '#10B981'
]

const projectIcons = [
  'Folder', 'Briefcase', 'Code', 'TrendingUp', 'User',
  'Heart', 'Home', 'Car', 'Plane', 'Camera',
  'Music', 'Book', 'Coffee', 'Gamepad2', 'Palette'
]

const ProjectModal = ({ project, onClose, onCreate, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    color: project?.color || projectColors[0],
    icon: project?.icon || 'Folder'
  })
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    
    setLoading(true)
    try {
      if (project) {
        await onUpdate(project.id, {
          ...formData,
          name: formData.name.trim()
        })
        toast.success('Project updated successfully!')
      } else {
        await onCreate({
          ...formData,
          name: formData.name.trim()
        })
        toast.success('Project created successfully!')
      }
    } catch (error) {
      toast.error(project ? 'Failed to update project' : 'Failed to create project')
      console.error('Error with project:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await onDelete(project.id)
      toast.success('Project deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete project')
      console.error('Error deleting project:', error)
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
          className="card-elevated w-full max-w-md"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {project ? 'Edit Project' : 'New Project'}
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <ApperIcon name="X" size={20} />
              </motion.button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Project Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter project name"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Color
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {projectColors.map((color) => (
                    <motion.button
                      key={color}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        formData.color === color 
                          ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-400' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {projectIcons.map((iconName) => (
                    <motion.button
                      key={iconName}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFormData(prev => ({ ...prev, icon: iconName }))}
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                        formData.icon === iconName
                          ? 'border-primary-500 bg-primary-50 text-primary-600'
                          : 'border-gray-200 hover:border-gray-400 text-gray-600'
                      }`}
                    >
                      <ApperIcon name={iconName} size={18} />
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                {project && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => setShowDeleteConfirm(true)}
                    icon="Trash2"
                  >
                    Delete
                  </Button>
                )}
                
                <div className={`flex space-x-3 ${!project ? 'ml-auto' : ''}`}>
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
                    disabled={!formData.name.trim()}
                  >
                    {project ? 'Save Changes' : 'Create Project'}
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
                    <h3 className="text-lg font-semibold text-gray-900">Delete Project</h3>
                    <p className="text-sm text-gray-600">This action cannot be undone.</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete "{project?.name}"? All tasks in this project will be moved to Inbox.
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
                    Delete Project
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

export default ProjectModal