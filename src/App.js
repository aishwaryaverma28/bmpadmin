import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Leadplaner from "./components/Leadplaner";
import Lead from "./components/lead/Lead";
import EmployeeProfile from "./components/master-settings/EmployeeProfile";
import Editor from "./components/Editor";
import BmpDashboard from "./components/bookmyplayer/BmpDashboard.jsx";
import BlogAdd from "./components/master-settings/BlogAdd.jsx";
import BlogView from "./components/master-settings/BlogView";
import SitePagesAdd from "./components/master-settings/SitePagesAdd";
import HelpAdd from "./components/master-settings/HelpAdd";
import HelpUpdate from "./components/master-settings/HelpUpdate";
import UserMangAdd from "./components/master-settings/UserMangAdd";
import UserMangUpdate from "./components/master-settings/UserMangUpdate";
import EmployeeAdd from "./components/master-settings/EmployeeAdd";
import EmployeeView from "./components/EmployeeView";
import AccessManagement from "./components/master-settings/AccessManagement";
import ReportsandAnalytics from "./components/master-settings/ReportsandAnalytics";
import City from "./components/master-settings/City";
import State from "./components/master-settings/State";
import EmployeeUpdate from "./components/master-settings/EmployeeUpdate";
import BlogUpdate from "./components/master-settings/BlogUpdate";
import SitePagesView from "./components/master-settings/SitePagesView";
import SitePagesUpdate from "./components/master-settings/SitePagesUpdate";
import Home from "./components/Home";
import Contacts from "./components/contacts/Contacts.jsx";
import Deal from "./components/deal/Deal";
import Mail from "./components/Mail";
import Login from "./components/Login";
import Registration from "./components/Registration";
import SecureRoutes from "./components/SecureRoutes";
import UserAndTeams from "./components/settings/UserAndTeams";
import LPSettingsGeneral from "./components/settings/LPSettingsGeneral";
import Error from "./components/Error";
import LPSettingsNotification from "./components/settings/LPSettingsNotification";
import RecycleBin from "./components/settings/RecycleBin";
import LPPermission from "./components/settings/LPPermission.jsx";
import LPCompanySettings from "./components/settings/LPCompanySettings";
import LPSettings from "./components/settings/LPSettings";
import PrivacyNConsent from "./components/settings/PrivacyNConsent";
import SettingLeads from "./components/settings/SettingLeads";
import SettingDeal from "./components/settings/SettingDeal";
import WorkFlow from "./components/settings/PipelineWorkflow/EditWorkflow";
import SettingUsage from "./components/settings/SettingUsage";
import SettingImpExp from "./components/settings/SettingImpExp";
import DealUpdate from "./components/deal/DealUpdate";
import HelpView from "./components/master-settings/HelpView";
import Reset from "./components/Reset";
import CompanyUpdate from "./components/contacts/CompanyUpdate.jsx";
import PeopleUpdate from "./components/contacts/PeopleUpdate.jsx";
import Testing from "./components/Testing";
import BmpOverview from "./components/bookmyplayer/BmpOverview";
import FeesNBatches from "./components/bookmyplayer/FeesNBatches";
import TraningNStrategy from "./components/bookmyplayer/TraningNStrategy";
import Gallery from "./components/bookmyplayer/Gallery";
import Review from "./components/bookmyplayer/Review.jsx";
import BMPLeads from "./components/bookmyplayer/BMPLeads.jsx";
import BMPHelp from "./components/bookmyplayer/BMPHelp.jsx";
import Campaign from "./components/marketing/Campaign.jsx";
import ListFilter from "./components/marketing/ListFilter.jsx";
import WhatsappView from "./components/marketing/WhatsappView.jsx";
import SupportTab from "./components/settings/SupportTab.jsx";
import BmpAdmin from "./components/bookmyplayer/BmpAdmin.jsx";
import OverviewById from "./components/bookmyplayer/OverviewById.jsx";
import Approval from "./components/bookmyplayer/Approval.jsx";
import BmpReviewsView from "./components/master-settings/bmp/BmpReviewsView.jsx";
import BmpReviewsUpdate from "./components/master-settings/bmp/BmpReviewsUpdate.jsx";
import AddTournament from "./components/master-settings/tournament/AddTournament.jsx";
import ViewTournament from "./components/master-settings/tournament/ViewTournament.jsx";
import UpdateTournament from "./components/master-settings/tournament/UpdateTournament.jsx";
const router = createBrowserRouter([
  {
    path: "/:auth",
    element: <Testing />,
    errorElement:<Error/>,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/reset",
    element: <Reset />,
  },
  {
    path: "/lp",
    element: <Leadplaner />,
    errorElement: <Error />,
    children: [
      {
        path: "/lp", // This is the new route for /lp
        element: <Navigate to="/lp/home" replace />, // Redirect to /lp/home
      },
      {
        path: "/lp/lead",
        element: <SecureRoutes Component={Lead} />,
      },
      {
        path: "/lp/home",
        element: <SecureRoutes Component={Home} />,
      },
      {
        path: "/lp/admin",
        element: <SecureRoutes Component={Editor} />,
      },
      {
        path: "/lp/mail",
        element: <SecureRoutes Component={Mail} />,
      },
      {
        path: "/lp/contacts",
        element: <SecureRoutes Component={Contacts} />,
      },
      {
        path: "/lp/contacts/company/:id",
        element: <CompanyUpdate />,
      },
      {
        path: "/lp/contacts/people/:id",
        element: <PeopleUpdate />,
      },
      {
        path: "/lp/marketing",
        element: <Campaign/>,
      },
      {
        path: "/lp/marketing/list",
        element: <ListFilter/>
      },
      {
        path: "/lp/marketing/campaign",
        element: <WhatsappView/>
      },
      {
        path: "/lp/bmp/admin",
        element: <BmpAdmin />,
      },
      {
        path: "/lp/bmp",
        element: <BmpDashboard />,
        errorElement: <Error />,
        children: [
          {
            path: "/lp/bmp",
            element: <Navigate to="/lp/bmp/overview" replace />,
          },
          {
            path:"/lp/bmp/overview",
            element:<SecureRoutes Component={BmpOverview}/>,
          },
          {
            path: "/lp/bmp/overview/:id",
            element: <OverviewById/>,
          },
          {
            path:"/lp/bmp/fees",
            element:<SecureRoutes Component={FeesNBatches}/>,
          },
          {
            path:"/lp/bmp/training",
            element:<SecureRoutes Component={TraningNStrategy}/>,
          },
          {
            path:"/lp/bmp/gallery",
            element:<SecureRoutes Component={Gallery}/>,
          },
          {
            path:"/lp/bmp/reviews",
            element:<SecureRoutes Component={Review}/>,
          },
          {
            path:"/lp/bmp/approval",
            element:<Approval/>,
          },
          {
            path:"/lp/bmp/leads",
            element:<SecureRoutes Component={BMPLeads}/>,
          },
          {
            path:"/lp/bmp/support",
            element: (
              <div style={{ padding: '1rem' }}>
                <SecureRoutes Component={SupportTab} />
              </div>
            ),
          },
          {
            path:"/lp/bmp/help",
            element:<SecureRoutes Component={BMPHelp}/>,
          },
        ],
      },
      {
        path: "/lp/deals",
        element: <SecureRoutes Component={Deal} />,
      },
      {
        path: "/lp/deals/:id",
        element: <DealUpdate />,
      },
      {
        path: "/lp/settings",
        element: <LPSettings />,
        errorElement: <Error />,
        children: [
          {
            path: "/lp/settings", // This is the new route for /lp
            element: <Navigate to="/lp/settings/general" replace />, // Redirect to /lp/home
          },
          {
            path: "/lp/settings/general",
            element: <SecureRoutes Component={LPSettingsGeneral} />,
          },
          {
            path: "/lp/settings/notification",
            element: <SecureRoutes Component={LPSettingsNotification} />,
          },
          {
            path: "/lp/settings/usernteams",
            element: <SecureRoutes Component={UserAndTeams} />,
          },
          {
            path: "/lp/settings/usernteams/:id",
            element: <LPPermission />,
          },
          {
            path: "/lp/settings/companysettings",
            element: <SecureRoutes Component={LPCompanySettings} />,
          },
          {
            path: "/lp/settings/recyclebin",
            element: <SecureRoutes Component={RecycleBin} />,
          },
          {
            path: "/lp/settings/privacyConcent",
            element: <SecureRoutes Component={PrivacyNConsent} />,
          },
          {
            path: "/lp/settings/settingLeads",
            element: <SecureRoutes Component={SettingLeads} />,
          },
          {
            path: "/lp/settings/settingDeal",
            element: <SecureRoutes Component={SettingDeal} />,
          },
          {
            path: "/lp/settings/workflow",
            element: <SecureRoutes Component={WorkFlow} />,
          },
          {
            path: "/lp/settings/settingUsage",
            element: <SecureRoutes Component={SettingUsage} />,
          },
          {
            path: "/lp/settings/settingImpExp",
            element: <SecureRoutes Component={SettingImpExp} />,
          },
          {
            path: "/lp/settings/viewProfile/employeeProfile",
            element: <SecureRoutes Component={EmployeeProfile} />,
          },
          {
            path: "/lp/settings/blog/add",
            element: <SecureRoutes Component={BlogAdd} />,
          },
          {
            path: "/lp/settings/blog/view",
            element: <SecureRoutes Component={BlogView} />,
          },
          {
            path: "/lp/settings/blog/view/:id",
            element: <BlogUpdate />,
          },
          {
            path: "/lp/settings/tournament/add",
            element: <SecureRoutes Component={AddTournament}/>,
          },
          {
            path: "/lp/settings/tournament/view",
            element: <SecureRoutes Component={ViewTournament}/>,
          },
          {
            path: "/lp/settings/blog/tournament/:id",
            element: <UpdateTournament />,
          },

          {
            path: "/lp/settings/review/view",
            element: <SecureRoutes Component={BmpReviewsView} />,
          },
          {
            path: "/lp/settings/review/view/:id",
            element: <BmpReviewsUpdate />,
          },
          {
            path: "/lp/settings/sitePages/add",
            element: <SecureRoutes Component={SitePagesAdd} />,
          },
          {
            path: "/lp/settings/sitePages/view",
            element: <SecureRoutes Component={SitePagesView} />,
          },
          {
            path: "/lp/settings/sitePages/view/:id",
            element: <SitePagesUpdate />,
          },
          {
            path: "/lp/settings/helpSection/add",
            element: <SecureRoutes Component={HelpAdd} />,
          },
          {
            path: "/lp/settings/helpSection/update",
            element: <SecureRoutes Component={HelpView} />,
          },
          {
            path: "/lp/settings/helpSection/update/:id",
            element: <HelpUpdate />,
          },
          {
            path: "/lp/settings/userManagement/add",
            element: <SecureRoutes Component={UserMangAdd} />,
          },
          {
            path: "/lp/settings/userManagement/update",
            element: <SecureRoutes Component={UserMangUpdate} />,
          },
          {
            path: "/lp/settings/employee/add",
            element: <SecureRoutes Component={EmployeeAdd} />,
          },
          {
            path: "/lp/settings/employee/view",
            element: <SecureRoutes Component={EmployeeView} />,
          },
          {
            path: "/lp/settings/employee/view/:id",
            element: <EmployeeUpdate />,
          },
          {
            path: "/lp/settings/accessManagement",
            element: <SecureRoutes Component={AccessManagement} />,
          },
          {
            path: "/lp/settings/reportsAndAnalytics",
            element: <SecureRoutes Component={ReportsandAnalytics} />,
          },
          {
            path: "/lp/settings/masterSettings/City",
            element: <SecureRoutes Component={City} />,
          },
          {
            path: "/lp/settings/system/state",
            element: <SecureRoutes Component={State} />,
          }
        ],
      },
    ],
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
