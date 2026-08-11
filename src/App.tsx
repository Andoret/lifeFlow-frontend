import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Fallback from './components/fallback.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
const HomeView = lazy(() => import('./views/home/Home.tsx'))
const TasksView = lazy(() => import('./views/tasks/Tasks.tsx'))
const ScheduleView = lazy(() => import('./views/schedule/Schedule.tsx'))
const FitnessView = lazy(() => import('./views/fitness/Fitness.tsx'))
const ExpensesView = lazy(() => import('./views/expenses/Expenses.tsx'))
const KitchenView = lazy(() => import('./views/kitchen/Kitchen.tsx'))
const AuthView = lazy(() => import('./views/auth/Auth.tsx'))

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Suspense fallback={<Fallback />}>
          <AuthView />
        </Suspense>} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Suspense fallback={<Fallback />}>
            <HomeView />
          </Suspense>} />
          <Route path="/tareas" element={<Suspense fallback={<Fallback />}>
            <TasksView />
          </Suspense>} />
          <Route path="/agenda" element={<Suspense fallback={<Fallback />}>
            <ScheduleView />
          </Suspense>} />
          <Route path="/fitness" element={<Suspense fallback={<Fallback />}>
            <FitnessView />
          </Suspense>} />
          <Route path="/gastos" element={<Suspense fallback={<Fallback />}>
            <ExpensesView />
          </Suspense>} />
          <Route path="/cocina" element={<Suspense fallback={<Fallback />}>
            <KitchenView />
          </Suspense>} />
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
