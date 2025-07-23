import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";

const useIfUserExistsRedirectToDashboard = () => {
  const { isLoading, session } = useSessionContext();
  const navigate = useNavigate();

  if (!isLoading && session) {
    navigate("/studentDashboard", { replace: true });
  }

  return null;
};

export default useIfUserExistsRedirectToDashboard;
