import { useState } from 'react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const quickOptions = [
  { label: 'Today', getValue: () => new Date() },
  { label: 'Tomorrow', getValue: () => { const d = new Date(); d.setDate(d.getDate() + 1); return d; } },
  { label: 'This Weekend', getValue: () => { const d = new Date(); const day = d.getDay(); const diff = 6 - day; d.setDate(d.getDate() + diff); return d; } },
  { label: 'Next Week', getValue: () => { const d = new Date(); d.setDate(d.getDate() + 7); return d; } }
]

const DatePicker = ({ 
  value, 
  onChange, 
  placeholder = "Set due date",
  className = '',
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [customDate, setCustomDate] = useState('')
  
  const handleQuickSelect = (option) => {
    const date = option.getValue()
    onChange(date.toISOString())
    setIsOpen(false)
  }
  
  const handleCustomDate = (e) => {
    const dateValue = e.target.value
    setCustomDate(dateValue)
    if (dateValue) {
      const date = new Date(dateValue)
      onChange(date.toISOString())
    }
  }
  
  const handleClear = () => {
    onChange(null)
    setCustomDate('')
    setIsOpen(false)
  }
  
  const displayValue = value 
    ? format(new Date(value), 'MMM d, yyyy')
    : placeholder
  
  return (
    <div className={`relative ${className}`}>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 bg-white border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          value 
            ? 'border-primary-200 text-primary-700 bg-primary-50' 
            : 'border-gray-200 text-gray-600 hover:bg-warm-50'
        }`}
        {...props}
      >
        <ApperIcon name="Calendar" size={16} />
        <span className="text-sm font-medium">{displayValue}</span>
        {value && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            onClick={(e) => {
              e.stopPropagation()
              handleClear()
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" size={14} />
          </motion.button>
        )}
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <div className="p-3">
              <div className="space-y-1 mb-3">
                {quickOptions.map((option) => (
                  <motion.button
                    key={option.label}
                    type="button"
                    whileHover={{ backgroundColor: '#F9F5F1' }}
                    onClick={() => handleQuickSelect(option)}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-warm-100 rounded-md transition-colors duration-150"
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
              
              <div className="border-t pt-3">
                <input
                  type="date"
                  value={customDate}
                  onChange={handleCustomDate}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
              
              {value && (
                <div className="border-t pt-3 mt-3">
                  <motion.button
                    type="button"
                    whileHover={{ backgroundColor: '#FEF2F2' }}
                    onClick={handleClear}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
                  >
                    Clear due date
                  </motion.button>
                </div>
              )}
            </div>
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

export default DatePicker