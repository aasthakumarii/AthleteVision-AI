import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import AppLayout from '@/components/layout/AppLayout'

// Lazy load all pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const AthleteDashboard = lazy(() => import('@/pages/athlete/AthleteDashboard'))
const VideoUploadPage = lazy(() => import('@/pages/athlete/VideoUploadPage'))
const ReportsPage = lazy(() => import('@/pages/athlete/ReportsPage'))
const ReportDetailPage = lazy(() => import('@/pages/athlete/ReportDetailPage'))
const CoachDashboard = lazy(() => import('@/pages/coach/CoachDashboard'))
const AthleteSearchPage = lazy(() => import('@/pages/coach/AthleteSearchPage'))
const AthleteProfilePage = lazy(() => import('@/pages/coach/AthleteProfilePage'))
const PlayerComparePage = lazy(() => import('@/pages/coach/PlayerComparePage'))

// Loading fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  )
}

// Protected route wrapper
function PrivateRoute({
  children,
  roles,
}: {
  children: React.ReactNode
  roles?: Array<'ATHLETE' | 'COACH'>
}) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    // Redirect to the right home
    const home = user.role === 'ATHLETE' ? '/athlete/dashboard' : '/coach/dashboard'
    return <Navigate to={home} replace />
  }

  return <>{children}</>
}

// Wrap in Suspense + PrivateRoute
function Protected({
  element,
  roles,
}: {
  element: React.ReactNode
  roles?: Array<'ATHLETE' | 'COACH'>
}) {
  return (
    <PrivateRoute roles={roles}>
      <Suspense fallback={<PageLoader />}>{element}</Suspense>
    </PrivateRoute>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<PageLoader />}>
        <RegisterPage />
      </Suspense>
    ),
  },

  // ── Athlete routes ──────────────────────────────────────────────
  {
    path: '/athlete',
    element: <Protected roles={['ATHLETE']} element={<AppLayout />} />,
    children: [
      { index: true, element: <Navigate to="/athlete/dashboard" replace /> },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AthleteDashboard />
          </Suspense>
        ),
      },
      {
        path: 'upload',
        element: (
          <Suspense fallback={<PageLoader />}>
            <VideoUploadPage />
          </Suspense>
        ),
      },
      {
        path: 'reports',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ReportsPage />
          </Suspense>
        ),
      },
      {
        path: 'reports/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ReportDetailPage />
          </Suspense>
        ),
      },
    ],
  },

  // ── Coach routes ───────────────────────────────────────────────
  {
    path: '/coach',
    element: <Protected roles={['COACH']} element={<AppLayout />} />,
    children: [
      { index: true, element: <Navigate to="/coach/dashboard" replace /> },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CoachDashboard />
          </Suspense>
        ),
      },
      {
        path: 'athletes',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AthleteSearchPage />
          </Suspense>
        ),
      },
      {
        path: 'athletes/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AthleteProfilePage />
          </Suspense>
        ),
      },
      {
        path: 'compare',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PlayerComparePage />
          </Suspense>
        ),
      },
    ],
  },

  // 404
  {
    path: '*',
    element: (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-4xl font-bold text-gray-400">404</h1>
        <p className="text-gray-500">Page not found</p>
        <a href="/" className="btn-primary">Go home</a>
      </div>
    ),
  },
])
