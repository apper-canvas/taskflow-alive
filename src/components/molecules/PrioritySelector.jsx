import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const priorities = [
  { value: 0, label: 'Low', color: 'bg-gray-500', icon: 'Flag' },
  { value: 1, label: 'Normal', color: 'bg-blue-500', icon: 'Flag' },
  { value: 2, label: 'High', color: 'bg-orange-500', icon: 'Flag' },
  { value: 3, label: 'Urgent', color: 'bg-red-500', icon: 'AlertTriangle' }
]

const PrioritySelector = ({ 
  value = 1, 
  onChange, 
  className = '',
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedPriority = priorities.find(p => p.value === value) || priorities[1]
  
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16
  
  return (
    <div className={`relative ${className}`}>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-warm-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <div className={`w-3 h-3 rounded-full ${selectedPriority.color}`} />
        <span className="text-sm font-medium text-gray-700">{selectedPriority.label}</span>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={iconSize} 
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
            className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            {priorities.map((priority) => (
              <motion.button
                key={priority.value}
                type="button"
                whileHover={{ backgroundColor: '#F9F5F1' }}
                onClick={() => {
                  onChange(priority.value)
                  setIsOpen(false)
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-left hover:bg-warm-100 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
              >
                <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                <ApperIcon name={priority.icon} size={iconSize} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{priority.label}</span>
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

export default PrioritySelector