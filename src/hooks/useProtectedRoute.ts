
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * No authentication required - always allows access
 * Returns:
 * - `true` to indicate user is allowed to view the page
 */
export function useProtectedRoute(): boolean {
  // Always return true to allow access without authentication
  return true;
}
