import { HttpInterceptorFn } from '@angular/common/http';

/**
 * HTTP Interceptor to add JWT token to all requests
 * This interceptor automatically adds the Authorization header with Bearer token
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get token directly from localStorage (matches AdminService's storage key)
  const token = localStorage.getItem('access_token');

  // Skip adding token for auth endpoints (login, register)
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  // If token exists, clone the request and add Authorization header
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('🔐 Adding token to request:', req.url);
    return next(clonedRequest);
  }

  console.warn('⚠️ No token found for request:', req.url);
  // If no token, proceed with original request
  return next(req);
};

