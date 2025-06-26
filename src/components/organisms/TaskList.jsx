import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TaskItem from "@/components/organisms/TaskItem";
import TaskDetailModal from "@/components/organisms/TaskDetailModal";
import ApperIcon from "@/components/ApperIcon";
const TaskList = ({ 
  tasks = [], 
  loading = false, 
  onTaskUpdate, 
  onTaskDelete,
  emptyMessage = "No tasks found",
  emptyIcon = "CheckCircle2"
}) => {
  const [selectedTask, setSelectedTask] = useState(null)
  const [showModal, setShowModal] = useState(false)
  
  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setShowModal(true)
  }
  
  const handleModalClose = () => {
    setShowModal(false)
    setSelectedTask(null)
  }
  
  const handleTaskUpdate = (updatedTask) => {
    if (onTaskUpdate) {
      onTaskUpdate(updatedTask)
    }
    handleModalClose()
  }
  
  const handleTaskDelete = (taskId) => {
    if (onTaskDelete) {
      onTaskDelete(taskId)
    }
    handleModalClose()
  }
  
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="card p-4 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center py-12"
      >
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-warm-200 to-warm-300 rounded-full flex items-center justify-center">
            <ApperIcon name={emptyIcon} size={24} className="text-warm-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">All done!</h3>
        <p className="text-gray-600">{emptyMessage}</p>
      </motion.div>
    )
  }
  
  return (
    <>
      <div className="space-y-2">
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onClick={() => handleTaskClick(task)}
              onUpdate={onTaskUpdate}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {showModal && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={handleModalClose}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
        />
      )}
    </>
  )
}

export default TaskList