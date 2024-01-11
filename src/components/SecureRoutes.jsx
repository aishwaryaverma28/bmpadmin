import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getDecryptedUserPath } from "./utils/Constants";

const SecureRoutes = (props) => {
  const { Component } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const landingUrl = localStorage.getItem("landingUrl");
  const [isLoading, setIsLoading] = useState(true);
  const decryptedUserPath = getDecryptedUserPath();

  useEffect(() => {
    let allowed = decryptedUserPath.split(",");
    // let allowed = [
    //   "/lp/bmp/overview",
    //   "/lp/bmp/fees", "/lp/bmp/training", "/lp/bmp/gallery", "/lp/bmp/reviews", "/lp/bmp/leads","/lp/bmp/support","/lp/bmp/help",
      //   "/lp/lead",
      //   "/lp/bmp",
      //   "/lp/bmp/overview",
      //   "/lp/bmp/fees",
      //   "/lp/bmp/training",
      //   "/lp/bmp/gallery",
      //   // "/lp/admin",
      //   "/lp/home",
      //   "/lp/mail",
      //   "/lp/contacts",
      //   "/lp/deals",
      //   "/lp/settings",
      //   "/lp/settings/general",
      //   "/lp/settings/notification",
      //   "/lp/settings/usernteams",
      //   "/lp/settings/companysettings",
      //   "/lp/settings/recyclebin",
      //   "/lp/settings/privacyConcent",
      //   "/lp/settings/settingLeads",
      //   "/lp/settings/settingDeal",
      //   "/lp/settings/settingUsage",
      //   "/lp/settings/settingImpExp",
      //   "/lp/settings/blog/add",
      //   "/lp/settings/blog/view",
      //   "/lp/settings/sitePages/add",
      //   "/lp/settings/sitePages/view",
      //   "/lp/settings/helpSection/add",
      //   "/lp/settings/helpSection/update",
      //   "/lp/settings/userManagement/add",
      //   "/lp/settings/userManagement/update",
      //   "/lp/settings/employee/add",
      //   "/lp/settings/employee/view",
      //   "/lp/settings/accessManagement",
      //   "/lp/settings/reportsAndAnalytics",
      //   "/lp/settings/masterSettings/City",
      //   "/lp/settings/system/state",
      //   "/lp/settings/viewProfile/employeeProfile",
      //   "lp/marketing"
    // ];

const currentPath = location.pathname;

if (landingUrl === "/lp/admin") {
  allowed = allowed.filter((path) => path !== "/lp/home");
} else if (landingUrl === "/lp/home") {
  allowed = allowed.filter((path) => path !== "/lp/admin");
}

if (!allowed.includes(currentPath)) {
  navigate(landingUrl);
} else {
  setIsLoading(false);
}
  }, [location, navigate, landingUrl, decryptedUserPath]);

return isLoading ? null : <Component />;
};

export default SecureRoutes;
