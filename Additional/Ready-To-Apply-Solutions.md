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

## 2. Centralized HTTP Error Handling

A small, reusable pattern for handling API requests, normalizing errors, and displaying consistent notifications in a frontend application.

### Required Dependencies

This pattern expects the calling application to provide:

- A `notify` function for displaying notifications.
- A `logout` function for clearing authentication state.
- A `NotificationType.ERROR` value.
- A backend that returns meaningful HTTP status codes.

### Example Integration

```js
const loadUsers = async () => {
  try {
    const data = await getUsers();
    setUsers(data);
  } catch (error) {
    httpErrorHandler({
      err: error,
      notify,
      logout,
      onCustomError: (error) => {
        console.error("Unable to load users:", error);
      },
    });
  }
};
```


### 1. Calling an API Request

```js
try {
  const data = await getUsers();

  setUsers(data);
} catch (error) {
  httpErrorHandler({
    err: error,
    notify,
    logout,

    onCustomError: (error) => {
      // Request-specific behavior
      console.log("Custom error:", error);
    },
  });
}
```

The request is wrapped in a `try...catch` block. If `getUsers()` succeeds, the returned data is stored with `setUsers(data)`. If it fails, the normalized error is passed to `httpErrorHandler`.

`onCustomError` is optional and can be used for behavior that applies only to this request, such as logging, analytics, or updating local state.

### 2. API Fetch Wrapper

```js
export const apiFetch = async (url, options = {}) => {
  let response;

  try {
    response = await fetch(url, {
      ...options,
      credentials: "include",
    });
  } catch (error) {
    // Network error
    throw {
      status: 0,
      message: "Unable to connect to the server.",
      data: null,
    };
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    // Response does not contain JSON.
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: data?.message || "Something went wrong.",
      data,
    };
  }

  return data;
};
```

#### Behavior

- `credentials: "include"` sends cookies with the request. This is useful when authentication is managed through session cookies.
- Network failures are converted into a normalized error with `status: 0`.
- The response body is parsed as JSON when possible.
- Non-JSON responses are handled safely.
- Any non-2xx response throws a consistent error object.
- Successful responses return the parsed response data.

#### Normalized Error Shape

```js
{
  status: 401,
  message: "Session expired",
  data: {
    message: "Session expired"
  }
}
```

For a network error:

```js
{
  status: 0,
  message: "Unable to connect to the server.",
  data: null
}
```

### 3. Centralized HTTP Error Handler

```js
import { NotificationType } from "./NotificationType";

export const httpErrorHandler = ({
  err,
  notify,
  logout,
  onCustomError,
}) => {
  // Optional request-specific error handling.
  onCustomError?.(err);

  const errorCases = {
    400: () => {
      notify({
        type: NotificationType.ERROR,
        title: "طلب غير صالح",
        message: "البيانات المرسلة غير صحيحة.",
      });
    },

    401: () => {
      notify({
        type: NotificationType.ERROR,
        title: "انتهت الجلسة",
        message:
          "انتهت صلاحية جلسة تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى.",
      });

      // logout is responsible for handling
      // all authentication state changes.
      logout();
    },

    403: () => {
      notify({
        type: NotificationType.ERROR,
        title: "غير مصرح",
        message: "ليس لديك صلاحية لتنفيذ هذا الإجراء.",
      });
    },

    404: () => {
      notify({
        type: NotificationType.ERROR,
        title: "غير موجود",
        message: "المورد المطلوب غير موجود.",
      });
    },

    500: () => {
      notify({
        type: NotificationType.ERROR,
        title: "خطأ في الخادم",
        message:
          "حدث خطأ داخلي في الخادم. يرجى المحاولة مرة أخرى لاحقًا.",
      });
    },

    default: () => {
      notify({
        type: NotificationType.ERROR,
        title: "خطأ",
        message: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
      });
    },
  };

  const handler =
    errorCases[err?.status] || errorCases.default;

  handler();
};
```

### Supported Status Codes

| Status | Meaning | Behavior |
|---|---|---|
| `0` | Network error | Shows the default error notification. |
| `400` | Bad Request | Shows a validation error notification. |
| `401` | Unauthorized | Shows a session-expired notification and calls `logout()`. |
| `403` | Forbidden | Shows a permission error notification. |
| `404` | Not Found | Shows a resource-not-found notification. |
| `500` | Internal Server Error | Shows a server error notification. |
| Other | Unknown error | Uses the default notification. |



