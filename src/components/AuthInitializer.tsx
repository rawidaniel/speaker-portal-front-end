import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useGetCurrentUserQuery } from "../store/services/authApi";
import { setUser } from "../store/slices/authSlice";

const AuthInitializer = () => {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);

  // Only fetch user data if we have a token but no user data
  const shouldFetchUser = token && !user;

  const { data: currentUser } = useGetCurrentUserQuery(undefined, {
    skip: !shouldFetchUser,
  });

  useEffect(() => {
    if (currentUser && shouldFetchUser) {
      dispatch(setUser(currentUser));
    }
  }, [currentUser, dispatch, shouldFetchUser]);

  // Don't render anything, this is just for side effects
  return null;
};

export default AuthInitializer;
