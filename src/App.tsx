import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Fallback from './components/fallback.tsx'
const HomeView = lazy(() => import('./views/Home.tsx'))
const TasksView = lazy(() => import('./views/Tasks.tsx'))
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Suspense fallback={<Fallback />}>
          <HomeView />
        </Suspense>} />
        <Route path="/task/" element={<Suspense fallback={<Fallback />}>
          <TasksView />
        </Suspense>} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
