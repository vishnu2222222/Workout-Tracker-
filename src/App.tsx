import { Routes, Route } from 'react-router-dom'
import { WorkoutProvider } from './context/WorkoutContext'
import HomeScreen from './screens/HomeScreen'
import WorkoutScreen from './screens/WorkoutScreen'
import HistoryScreen from './screens/HistoryScreen'
import WorkoutDetailScreen from './screens/WorkoutDetailScreen'

function App() {
  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/workout/:type" element={<WorkoutScreen />} />
          <Route path="/history" element={<HistoryScreen />} />
          <Route path="/history/:id" element={<WorkoutDetailScreen />} />
        </Routes>
      </div>
    </WorkoutProvider>
  )
}

export default App
