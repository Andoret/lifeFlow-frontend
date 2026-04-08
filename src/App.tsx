import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Fallback from './components/fallback.tsx'
const HomeView = lazy(() => import('./views/home/Home.tsx'))
const TasksView = lazy(() => import('./views/tasks/Tasks.tsx'))
const AuthView = lazy(() => import('./views/auth/Auth.tsx'))
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Suspense fallback={<Fallback />}>
          <HomeView />
        </Suspense>} />
        <Route path="/task/" element={<Suspense fallback={<Fallback />}>
          <TasksView />
        </Suspense>} />
        <Route path="/" element={<Suspense fallback={<Fallback />}>
          <AuthView />
        </Suspense>} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
