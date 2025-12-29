import { useEffect, useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // State decoded from the URL
  const [appName, setAppName] = useState('Secure Portal');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [debugInfo, setDebugInfo] = useState(null); // To help visualize what's happening

  useEffect(() => {
    // 1. Read the 'state' query param
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get('state');

    if (stateParam) {
      try {
        // 2. Decode Base64 and Parse JSON
        // Vulnerability Note: We trust this data because it looks "encoded/system-generated"
        const decodedString = atob(stateParam);
        const stateData = JSON.parse(decodedString);

        setDebugInfo(stateData); // For educational display only

        // 3. Extract Context Information
        if (stateData.appName) {
          setAppName(stateData.appName);
        }
        if (stateData.redirectUrl) {
          setRedirectUrl(stateData.redirectUrl);
        }
      } catch (e) {
        console.error('Failed to parse state param:', e);
      }
    }
  }, []);

  const handleLogin = (e: any) => {
    e.preventDefault();

    // Simulate authentication delay
    setTimeout(() => {
      // 4. Generate a fake session token
      const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulated_token';

      if (redirectUrl) {
        console.log('Redirecting to:', redirectUrl);

        // --- THE VULNERABILITY ---
        // We append the token to the URL provided by the state.
        // If redirectUrl is "javascript:alert(1)//", the token is treated as a comment.
        window.location.href = `${redirectUrl}?token=${fakeToken}`;
      } else {
        alert('Login Successful! (No redirect URL provided)');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            to continue to{' '}
            <span className="font-bold text-indigo-600">{appName}</span>
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>

        {/* Debug Info (For Demo Purposes) */}
        {debugInfo && (
          <div className="mt-8 border-t border-gray-200 pt-4">
            <h3 className="text-xs uppercase tracking-wide text-gray-500 font-bold mb-2">
              Debug: Decoded State
            </h3>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
            <p className="text-xs text-gray-400 mt-1">
              *The app trusts this "redirectUrl" blindly.*
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
