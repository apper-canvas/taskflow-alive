import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import Sidebar from '@/components/organisms/Sidebar'
import TaskView from '@/components/pages/TaskView'
import TodayView from '@/components/pages/TodayView'
import UpcomingView from '@/components/pages/UpcomingView'
import ProjectView from '@/components/pages/ProjectView'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-warm-50 via-white to-warm-100">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 min-h-screen">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <Routes>
                <Route path="/" element={<Navigate to="/today" replace />} />
                <Route path="/inbox" element={<TaskView />} />
                <Route path="/today" element={<TodayView />} />
                <Route path="/upcoming" element={<UpcomingView />} />
                <Route path="/project/:projectId" element={<ProjectView />} />
              </Routes>
            </motion.div>
          </main>
        </div>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  )
}

export default App