import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/clerk-react';
import { useEffect } from 'react';

// Security headers from middleware
import { getSecurityHeaders, applySecurityHeaders, refreshNonce } from './middleware';

// Layouts
import MainLayout from './layouts/MainLayout';
import RetailLayout from './layouts/RetailLayout';

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute';

// Landing and Auth Pages
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SSOCallback from './pages/auth/SSOCallback';

// Error Pages
import NotFound from './pages/error/NotFound';
import ServerError from './pages/error/ServerError';

// Legal Pages
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import CookiePolicy from './pages/legal/CookiePolicy';
import SecurityPolicy from './pages/legal/SecurityPolicy';
import AccessibilityStatement from './pages/legal/AccessibilityStatement';

// Info Pages
import AboutUs from './pages/about/AboutUs';
import ContactUs from './pages/contact/ContactUs';
import FAQ from './pages/help/FAQ';

// User Pages
import Profile from './pages/user/Profile';

// Corporate Pages
import Dashboard from './pages/Dashboard';
import CorporateOnboarding from './pages/corporate/Onboarding';

// Retail Pages
import RetailHome from './pages/retail/Home';
import RetailOnboarding from './pages/retail/Onboarding';
import Book from './pages/retail/Book';
import Track from './pages/retail/Track';
import Payment from './pages/retail/Payment';
import ProofOfDeliveryPage from './pages/retail/ProofOfDeliveryPage';
import Help from './pages/retail/Help';

// Common Components
import ChatWidget from './components/common/ChatWidget';

// Create theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          color: '#333',
        },
      },
    },
  },
});

// Placeholder components for corporate routes
const Events = () => <div>Events Page</div>;
const Inventory = () => <div>Inventory Page</div>;
const Logistics = () => <div>Logistics Page</div>;
const Reports = () => <div>Reports Page</div>;
const Users = () => <div>Users Page</div>;
const Settings = () => <div>Settings Page</div>;

import { createStyledElement, commonStyles } from './utils/styles';

// Loading component
const LoadingScreen = () => {
  const containerProps = createStyledElement(commonStyles.loadingContainer);
  const contentProps = createStyledElement(commonStyles.loadingContent);

  return (
    <div {...containerProps}>
      <div {...contentProps}>
        <h2>Loading QCS Management...</h2>
        <p>Please wait while we initialize the application.</p>
      </div>
    </div>
  );
};

// Error component
const ErrorScreen = ({ error }: { error: Error }) => {
  const containerProps = createStyledElement(commonStyles.errorContainer);
  const contentProps = createStyledElement(commonStyles.errorContent);
  const headingProps = createStyledElement(commonStyles.errorHeading);
  const messageProps = createStyledElement(commonStyles.errorMessage);
  const preProps = createStyledElement(commonStyles.errorPre);
  const footerProps = createStyledElement(commonStyles.errorFooter);

  return (
    <div {...containerProps}>
      <div {...contentProps}>
        <h2 {...headingProps}>Initialization Error</h2>
        <p {...messageProps}>
          We encountered an error while setting up the application:
        </p>
        <pre {...preProps}>
          {error.message}
        </pre>
        <p {...footerProps}>
          If this error persists, please contact support.
        </p>
      </div>
    </div>
  );
};

// Component to handle CSP headers and security features
function SecurityWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    // Refresh nonce and get new headers on location change
    refreshNonce();
    const headers = getSecurityHeaders();

    // Apply security headers to non-Clerk responses
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input instanceof Request ? input.url : input.toString();
      const response = await originalFetch(input, init || {});
      
      // Skip Clerk requests to prevent header conflicts
      if (!url.includes('clerk.com')) {
        return applySecurityHeaders(response);
      }
      return response;
    };

    // Cleanup
    return () => {
      window.fetch = originalFetch;
    };
  }, [location]);

  return children;
}

function App() {
  // Get Clerk publishable key from environment variables
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  // Log environment variables for debugging
  console.log('Environment Variables:', {
    VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    NODE_ENV: import.meta.env.MODE,
    BASE_URL: import.meta.env.BASE_URL,
  });

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        layout: {
          logoPlacement: 'none',
          socialButtonsPlacement: 'bottom',
          socialButtonsVariant: 'iconButton',
        },
        variables: {
          colorPrimary: theme.palette.primary.main,
          colorTextOnPrimaryBackground: 'white',
        },
      }}
    >
      <ClerkLoading>
        <LoadingScreen />
      </ClerkLoading>
      <ClerkLoaded>
        <BrowserRouter>
          <SecurityWrapper>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/sign-in/*" element={<SignIn />} />
                <Route path="/auth/sso-callback" element={<SSOCallback />} />

                {/* Error Pages */}
                <Route path="/404" element={<NotFound />} />
                <Route path="/500" element={<ServerError />} />

                {/* Legal Pages */}
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                <Route path="/security" element={<SecurityPolicy />} />
                <Route path="/accessibility" element={<AccessibilityStatement />} />

                {/* Info Pages */}
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/faq" element={<FAQ />} />

                {/* User Pages */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Retail Routes */}
                <Route
                  path="/retail"
                  element={
                    <ProtectedRoute userType="retail">
                      <RetailLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route
                    index
                    element={
                      <ProtectedRoute userType="retail" requireOnboarding>
                        <RetailHome />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="onboarding"
                    element={
                      <ProtectedRoute userType="retail" requireOnboarding={false}>
                        <RetailOnboarding />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="book"
                    element={
                      <ProtectedRoute userType="retail" requireOnboarding>
                        <Book />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="track" element={<Track />} />
                  <Route
                    path="payment"
                    element={
                      <ProtectedRoute userType="retail" requireOnboarding>
                        <Payment />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="pod"
                    element={
                      <ProtectedRoute userType="retail" requireOnboarding>
                        <ProofOfDeliveryPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="help" element={<Help />} />
                  <Route path="*" element={<Navigate to="/retail" replace />} />
                </Route>

                {/* Corporate Routes */}
                <Route
                  path="/corporate"
                  element={
                    <ProtectedRoute userType="corporate" requireOrganization>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route
                    index
                    element={
                      <ProtectedRoute userType="corporate" requireOnboarding requireOrganization>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="onboarding"
                    element={
                      <ProtectedRoute userType="corporate" requireOnboarding={false}>
                        <CorporateOnboarding />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="events"
                    element={
                      <ProtectedRoute userType="corporate" requireOnboarding requireOrganization>
                        <Events />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="inventory"
                    element={
                      <ProtectedRoute userType="corporate" requireOnboarding requireOrganization>
                        <Inventory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="logistics"
                    element={
                      <ProtectedRoute userType="corporate" requireOnboarding requireOrganization>
                        <Logistics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="reports"
                    element={
                      <ProtectedRoute userType="corporate" requireOnboarding requireOrganization>
                        <Reports />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="users"
                    element={
                      <ProtectedRoute userType="corporate" requireOnboarding requireOrganization>
                        <Users />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <ProtectedRoute userType="corporate" requireOnboarding requireOrganization>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/corporate" replace />} />
                </Route>

                {/* Catch All */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <ChatWidget />
            </ThemeProvider>
          </SecurityWrapper>
        </BrowserRouter>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

export default App;
