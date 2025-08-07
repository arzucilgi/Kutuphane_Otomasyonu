// src/lib/roleRedirect.ts
import type { NavigateFunction } from "react-router-dom";

export const redirectByRole = (
  userRole: string,
  navigate: NavigateFunction
) => {
  setTimeout(() => {
    switch (userRole) {
      case "ogrenci":
        navigate("/studentDashboard", { replace: true });
        break;
      case "memur":
        navigate("/officerDashboard", { replace: true });
        break;
      case "Yonetici":
        navigate("/managerDashboard", { replace: true });
        break;
      default:
        navigate("/");
    }
  }, 1500);
};
