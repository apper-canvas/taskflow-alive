import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import ProjectModal from '@/components/organisms/ProjectModal'
import { projectService } from '@/services/api/projectService'
import { taskService } from '@/services/api/taskService'

const Sidebar = () => {
  const [projects, setProjects] = useState([])
  const [todayCount, setTodayCount] = useState(0)
  const [upcomingCount, setUpcomingCount] = useState(0)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      const [projectsData, todayTasks, upcomingTasks] = await Promise.all([
        projectService.getAll(),
        taskService.getTodayTasks(),
        taskService.getUpcomingTasks()
      ])
      
      setProjects(projectsData)
      setTodayCount(todayTasks.filter(t => !t.completed).length)
      setUpcomingCount(upcomingTasks.filter(t => !t.completed).length)
    } catch (error) {
      console.error('Failed to load sidebar data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSearch = async (query) => {
    setSearchQuery(query)
    
    if (query.trim()) {
      try {
        const results = await taskService.search(query)
        setSearchResults(results)
        setShowSearchResults(true)
      } catch (error) {
        console.error('Search failed:', error)
        setSearchResults([])
      }
    } else {
      setShowSearchResults(false)
      setSearchResults([])
    }
  }
  
  const handleProjectCreate = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData)
      setProjects(prev => [...prev, newProject])
      setShowProjectModal(false)
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }
  
  const handleProjectUpdate = async (projectId, projectData) => {
    try {
      const updatedProject = await projectService.update(projectId, projectData)
      setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p))
      setShowProjectModal(false)
      setEditingProject(null)
    } catch (error) {
      console.error('Failed to update project:', error)
    }
  }
  
  const handleProjectDelete = async (projectId) => {
    try {
      await projectService.delete(projectId)
      setProjects(prev => prev.filter(p => p.id !== projectId))
      setShowProjectModal(false)
      setEditingProject(null)
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }
  
  const navItems = [
    {
      path: '/inbox',
      label: 'Inbox',
      icon: 'Inbox',
      count: 0
    },
    {
      path: '/today',
      label: 'Today',
      icon: 'Calendar',
      count: todayCount
    },
    {
      path: '/upcoming',
      label: 'Upcoming',
      icon: 'CalendarDays',
      count: upcomingCount
    }
  ]
  
  return (
    <>
      <aside className="w-64 bg-gradient-to-b from-warm-100 to-warm-200 border-r border-warm-300 h-screen sticky top-0 flex flex-col">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search tasks..."
            className="mb-4"
          />
        </div>
        
        <nav className="flex-1 px-4 pb-4">
          <div className="space-y-1 mb-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? 'active' : ''}`
                }
              >
                <ApperIcon name={item.icon} size={18} />
                <span className="flex-1">{item.label}</span>
                {item.count > 0 && (
                  <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Projects
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProjectModal(true)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <ApperIcon name="Plus" size={16} />
              </motion.button>
            </div>
            
            <div className="space-y-1">
              {loading ? (
                [...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <div className="w-3 h-3 bg-gray-300 rounded-full" />
                      <div className="w-4 h-4 bg-gray-300 rounded" />
                      <div className="h-4 bg-gray-300 rounded flex-1" />
                    </div>
                  </div>
                ))
              ) : (
                projects.filter(p => p.id !== 'inbox').map((project) => (
                  <NavLink
                    key={project.id}
                    to={`/project/${project.id}`}
                    className={({ isActive }) =>
                      `sidebar-item group ${isActive ? 'active' : ''}`
                    }
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: project.color }}
                    />
                    <ApperIcon name={project.icon} size={16} />
                    <span className="flex-1 truncate">{project.name}</span>
                    {project.taskCount > 0 && (
                      <span className="text-xs text-gray-500">
                        {project.taskCount}
                      </span>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setEditingProject(project)
                        setShowProjectModal(true)
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all duration-200 ml-1"
                    >
                      <ApperIcon name="MoreHorizontal" size={14} />
                    </motion.button>
                  </NavLink>
                ))
              )}
            </div>
          </div>
        </nav>
        
        {/* Search Results Overlay */}
        <AnimatePresence>
          {showSearchResults && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-20 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              {searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center space-x-3 p-2 hover:bg-warm-50 rounded-md cursor-pointer"
                    >
                      <ApperIcon name="Search" size={14} className="text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-gray-500 truncate">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <ApperIcon name="Search" size={20} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No tasks found for "{searchQuery}"</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {showSearchResults && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowSearchResults(false)}
          />
        )}
      </aside>
      
      {/* Project Modal */}
      {showProjectModal && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            setShowProjectModal(false)
            setEditingProject(null)
          }}
          onCreate={handleProjectCreate}
          onUpdate={handleProjectUpdate}
          onDelete={handleProjectDelete}
        />
      )}
    </>
  )
}

export default Sidebar