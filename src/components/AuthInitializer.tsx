import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useGetCurrentUserQuery } from "../store/services/authApi";
import { setUser } from "../store/slices/authSlice";

const AuthInitializer = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  // Always fetch user data if we have a token (to ensure fresh data)
  const shouldFetchUser = !!token;

  const { data: currentUser } = useGetCurrentUserQuery(undefined, {
    skip: !shouldFetchUser,
  });

  useEffect(() => {
    if (currentUser) {
      dispatch(setUser(currentUser));
    }
  }, [currentUser, dispatch]);

  // Don't render anything, this is just for side effects
  return null;
};

export default AuthInitializer;
