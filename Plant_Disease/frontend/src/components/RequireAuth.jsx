import { Navigate, useLocation } from 'react-router-dom'

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('access_token') // or use your context/auth state
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default RequireAuth
