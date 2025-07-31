import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import AuthGuard from "./components/AuthGuard";
import Login from "./components/Login";
import Signup from "./components/SIgnup";
import Index from "./pages/Index";
import EventResponses from "./pages/EventResponses";

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthGuard requireAuth={false}>
              <Login />
            </AuthGuard>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthGuard requireAuth={false}>
              <Signup />
            </AuthGuard>
          }
        />
        <Route
          path="/"
          element={
            <AuthGuard requireAuth={true}>
              <Index />
            </AuthGuard>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthGuard requireAuth={true}>
              <Index />
            </AuthGuard>
          }
        />
        <Route
          path="/events/:eventId/responses"
          element={
            <AuthGuard requireAuth={true}>
              <EventResponses />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  </Provider>
);

export default App;
