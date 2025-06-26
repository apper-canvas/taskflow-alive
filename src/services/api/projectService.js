import projectsData from '@/services/mockData/projects.json'

let projects = [...projectsData]

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const projectService = {
  async getAll() {
    await delay()
    return [...projects]
  },

  async getById(id) {
    await delay()
    const project = projects.find(p => p.id === id)
    return project ? { ...project } : null
  },

  async create(projectData) {
    await delay()
    const maxId = Math.max(...projects.filter(p => p.id !== 'inbox').map(p => parseInt(p.id)), 0)
    const newProject = {
      id: (maxId + 1).toString(),
      name: projectData.name,
      color: projectData.color || '#6B7280',
      icon: projectData.icon || 'Folder',
      order: projects.length,
      taskCount: 0
    }
    projects.push(newProject)
    return { ...newProject }
  },

  async update(id, updates) {
    await delay()
    const index = projects.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Project not found')
    
    projects[index] = { ...projects[index], ...updates }
    return { ...projects[index] }
  },

  async delete(id) {
    await delay()
    if (id === 'inbox') throw new Error('Cannot delete inbox')
    
    const index = projects.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Project not found')
    
    const deletedProject = projects[index]
    projects.splice(index, 1)
    return { ...deletedProject }
  },

  async updateTaskCount(projectId, count) {
    await delay()
    const index = projects.findIndex(p => p.id === projectId)
    if (index !== -1) {
      projects[index].taskCount = count
      return { ...projects[index] }
    }
    return null
  }
}