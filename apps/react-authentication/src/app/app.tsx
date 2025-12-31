import { useEffect, useState } from 'react';

function App() {
  const authLogin = {
    username: 'alice_hr', // Updated to match your NestJS seed data
    password: 'password123',
  };

  const [username, setUsername] = useState(authLogin.username);
  const [password, setPassword] = useState(authLogin.password);

  // decoded from the URL
  const [appName, setAppName] = useState('Secure Portal');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [traceId, setTraceId] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);

  // New state for loading
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // read the 'state' query param
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get('state');

    if (stateParam) {
      try {
        // decode base64 - vulnerability
        const decodedString = atob(stateParam);
        const stateData = JSON.parse(decodedString);

        setDebugInfo(stateData); // For educational display only

        // extract context information
        if (stateData.appName) {
          setAppName(stateData.appName);
        }
        if (stateData.redirectUrl) {
          setRedirectUrl(stateData.redirectUrl);
        }
        if (stateData.traceId) {
          setTraceId(stateData.traceId);
        }
      } catch (e) {
        console.error('Failed to parse state param:', e);
      }
    }
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // simulate HTTP Network Delay (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // send Data to NestJS Backend
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      const token = data.access_token; // Get the token from BE

      // handle redirect - (Vulnerable Logic)
      if (redirectUrl) {
        console.log('Redirecting to:', redirectUrl);

        // --- THE VULNERABILITY ---
        // We append the REAL token from the backend to the malicious URL.
        // If redirectUrl ends in "//", this token is commented out in the victim's browser.
        window.location.href = `${redirectUrl}?token=${token}`;
      } else {
        alert('Login Successful! (No redirect URL provided)');
      }
    } catch (error) {
      alert('Login Failed: Invalid username or password');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 lg:-mt-28 md:scale-125">
        {/* header */}
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            to continue to <span className="font-bold text-indigo-600">{appName}</span>
            {traceId && ` (Trace ID: ${traceId})`}
          </p>
        </div>

        {/* info box */}
        <div className="bg-blue-50 border-l-4 border-indigo-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-indigo-700">
                username: <code className="font-mono font-bold">{authLogin.username}</code> &nbsp; password:{' '}
                <code className="font-mono font-bold">{authLogin.password}</code>
              </p>
            </div>
          </div>
        </div>

        {/* login form */}
        <form className="mt-2 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px grid gap-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                disabled={isLoading}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
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
                disabled={isLoading}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}>
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        {/* debug info */}
        {debugInfo && (
          <div className="mt-8 border-t border-gray-200 pt-4">
            <h3 className="text-xs uppercase tracking-wide text-gray-500 font-bold mb-2">Debug: Decoded State</h3>
            <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
            <p className="text-xs text-gray-400 mt-1">*The app trusts this "redirectUrl" blindly.*</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
