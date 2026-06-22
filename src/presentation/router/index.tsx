// src/presentation/router/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/presentation/components/shared/Layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '@/presentation/features/auth/pages/LoginPage'
import { ScenariosPage } from '@/presentation/features/budget/pages/ScenariosPage'
import { ScenarioDetailPage } from '@/presentation/features/budget/pages/ScenarioDetailPage'
import { AccountsPage } from '@/presentation/features/accounts/pages/AccountsPage'
import { CostCentersPage } from '@/presentation/features/cost-centers/pages/CostCentersPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/scenarios" replace /> },
          { path: 'scenarios', element: <ScenariosPage /> },
          { path: 'scenarios/:id', element: <ScenarioDetailPage /> },
          { path: 'accounts', element: <AccountsPage /> },
          { path: 'cost-centers', element: <CostCentersPage /> },
        ],
      },
    ],
  },
])
