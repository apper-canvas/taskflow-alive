import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { projectService } from '@/services/api/projectService'

const ProjectSelector = ({ 
  value, 
  onChange, 
  className = '',
  ...props 
}) => {
  const [projects, setProjects] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadProjects()
  }, [])
  
  const loadProjects = async () => {
    try {
      const data = await projectService.getAll()
      setProjects(data)
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const selectedProject = projects.find(p => p.id === value) || projects[0]
  
  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg animate-pulse">
        <div className="w-4 h-4 bg-gray-300 rounded" />
        <div className="w-20 h-4 bg-gray-300 rounded" />
      </div>
    )
  }
  
  return (
    <div className={`relative ${className}`}>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-warm-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        {...props}
      >
        {selectedProject && (
          <>
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: selectedProject.color }}
            />
            <ApperIcon name={selectedProject.icon} size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{selectedProject.name}</span>
          </>
        )}
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-gray-400" 
        />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 w-full min-w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            {projects.map((project) => (
              <motion.button
                key={project.id}
                type="button"
                whileHover={{ backgroundColor: '#F9F5F1' }}
                onClick={() => {
                  onChange(project.id)
                  setIsOpen(false)
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-left hover:bg-warm-100 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: project.color }}
                />
                <ApperIcon name={project.icon} size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{project.name}</span>
                {project.taskCount > 0 && (
                  <span className="ml-auto text-xs text-gray-500">{project.taskCount}</span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default ProjectSelector