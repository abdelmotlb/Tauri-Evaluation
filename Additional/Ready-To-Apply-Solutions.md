### 1. Handling Back/Forward Navigation and Authenticated Content

To handle the **Back** and **Forward** buttons and prevent unauthenticated users from accessing protected content, we can leverage the protected routes we have already implemented.

When the user presses the **Back** or **Forward** button, the route changes. React Router then evaluates the corresponding protected route. If the user is no longer authenticated, the protected route redirects them to the login page using `replace`:

```jsx
function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```
