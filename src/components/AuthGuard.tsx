import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      navigate("/login");
    } else if (!requireAuth && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, requireAuth, navigate]);

  if (requireAuth && !isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  if (!requireAuth && isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
};

export default AuthGuard;
