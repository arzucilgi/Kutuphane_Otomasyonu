import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { redirectByRole } from "../lib/redirectByRole";
import { getUserRoleFromTable } from "../services/StudentServices/getUserRoleFromTable"; // 👈 bunu ekle

const useIfUserExistsRedirectToDashboard = () => {
  const { isLoading, session } = useSessionContext();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndRedirect = async () => {
      if (!isLoading && session) {
        const userId = session.user.id;
        const userRole = await getUserRoleFromTable(userId);

        if (userRole) {
          redirectByRole(userRole, navigate);
        } else {
          console.warn("Rol bulunamadı, anasayfaya yönlendiriliyor.");
          navigate("/");
        }
      }
    };

    checkAndRedirect();
  }, [isLoading, session, navigate]);

  return null;
};

export default useIfUserExistsRedirectToDashboard;
