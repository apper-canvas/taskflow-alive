import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Checkbox = ({ 
  checked = false, 
  onChange, 
  className = '',
  size = 'md',
  variant = 'default',
  ...props 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  const variants = {
    default: checked 
      ? 'bg-gradient-to-r from-primary-500 to-primary-600 border-primary-500' 
      : 'bg-white border-gray-300 hover:border-gray-400',
    success: checked
      ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-500'
      : 'bg-white border-gray-300 hover:border-gray-400'
  }
  
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14
  
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={checked ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.2 }}
      className={`${sizes[size]} ${variants[variant]} rounded border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 ${className}`}
      onClick={onChange}
      {...props}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon 
            name="Check" 
            size={iconSize} 
            className="text-white font-bold" 
          />
        </motion.div>
      )}
    </motion.button>
  )
}

export default Checkbox