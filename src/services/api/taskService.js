import tasksData from '@/services/mockData/tasks.json'

let tasks = [...tasksData]

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const taskService = {
  async getAll() {
    await delay()
    return [...tasks]
  },

  async getById(id) {
    await delay()
    const task = tasks.find(t => t.id === id)
    return task ? { ...task } : null
  },

  async getByProject(projectId) {
    await delay()
    return tasks.filter(t => t.projectId === projectId).map(t => ({ ...t }))
  },

  async getTodayTasks() {
    await delay()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return tasks.filter(t => {
      if (!t.dueDate) return false
      const dueDate = new Date(t.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate.getTime() <= today.getTime()
    }).map(t => ({ ...t }))
  },

  async getUpcomingTasks(days = 7) {
    await delay()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const futureDate = new Date(today)
    futureDate.setDate(futureDate.getDate() + days)
    
    return tasks.filter(t => {
      if (!t.dueDate) return false
      const dueDate = new Date(t.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate.getTime() > today.getTime() && dueDate.getTime() <= futureDate.getTime()
    }).map(t => ({ ...t }))
  },

  async create(taskData) {
    await delay()
    const maxId = Math.max(...tasks.map(t => parseInt(t.id)), 0)
    const newTask = {
      id: (maxId + 1).toString(),
      title: taskData.title,
      description: taskData.description || '',
      projectId: taskData.projectId || 'inbox',
      priority: taskData.priority || 1,
      dueDate: taskData.dueDate || null,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      order: tasks.length + 1
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, updates) {
    await delay()
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    
    tasks[index] = { ...tasks[index], ...updates }
    return { ...tasks[index] }
  },

  async delete(id) {
    await delay()
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    
    const deletedTask = tasks[index]
    tasks.splice(index, 1)
    return { ...deletedTask }
  },

  async complete(id) {
    await delay()
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    
    tasks[index].completed = true
    tasks[index].completedAt = new Date().toISOString()
    return { ...tasks[index] }
  },

  async uncomplete(id) {
    await delay()
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    
    tasks[index].completed = false
    tasks[index].completedAt = null
    return { ...tasks[index] }
  },

  async search(query) {
    await delay()
    const lowercaseQuery = query.toLowerCase()
    return tasks.filter(t => 
      t.title.toLowerCase().includes(lowercaseQuery) ||
      t.description.toLowerCase().includes(lowercaseQuery)
    ).map(t => ({ ...t }))
  }
}