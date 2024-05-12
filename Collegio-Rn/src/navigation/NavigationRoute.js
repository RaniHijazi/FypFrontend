// Tab Routes
import HomeTab from '../containers/TabBar/Home/HomeTab';
import ProfileTab from '../containers/TabBar/Profile/ProfileTab';
import SearchTab from '../containers/TabBar/Search/SearchTab';
import AddPostTab from '../containers/TabBar/AddPost/AddPostTab';
import NotificationTab from '../containers/TabBar/Notification/NotificationTab';

// Screens Route
import OnBoarding from '../containers/OnBoarding';
import Connect from '../containers/auth/Connect';
import EmailVerification from '../containers/auth/EmailVerification';
import EmailVerified from '../containers/auth/EmailVerified';
import ForgotPassword from '../containers/auth/ForgotPassword';
import InstituteDetail from '../containers/auth/InstituteDetail';
import PasswordChange from '../containers/auth/PasswordChange';
import SelectData from '../containers/auth/SelectData';
import SetNewPassword from '../containers/auth/SetNewPassword';
import SignIn from '../containers/auth/SignIn';
import SignUp from '../containers/auth/SignUp';
import SignUpDetail from '../containers/auth/SignUpDetail';
import Splash from '../containers/auth/Splash';
import VerifyCode from '../containers/auth/VerifyCode';
import AuthNavigation from './Type/AuthNavigation';
import TabNavigation from './Type/TabNavigation';
import OtherPersonProfile from '../containers/TabBar/Home/OtherPersonProfile';
import ViewPost from '../components/HomeComponent/ViewPost';
import Messages from '../components/HomeComponent/Messages';
import ChatScreen from '../containers/TabBar/Home/ChatScreen';
import Setting from '../containers/TabBar/Profile/Setting';
import StoryView from '../containers/TabBar/Home/StoryView';
import DeleteAccount from '../containers/TabBar/Profile/DeleteAccount';
import ConfirmDelete from '../containers/TabBar/Profile/ConfirmDelete';
import AccountDeleted from '../containers/TabBar/Profile/AccountDeleted';
import changePassword from '../containers/TabBar/Profile/ChangePassword';

export const StackRoute = {
  Splash,
  OnBoarding,
  AuthNavigation,
  TabNavigation,
  OtherPersonProfile,
  ViewPost,
  Messages,
  ChatScreen,
  Setting,
  StoryView,
  DeleteAccount,
  ConfirmDelete,
  AccountDeleted,
  changePassword
};

export const AuthRoute = {
  Connect,
  SignIn,
  SignUp,
  SignUpDetail,
  EmailVerification,
  EmailVerified,
  SelectData,
  InstituteDetail,
  ForgotPassword,
  VerifyCode,
  SetNewPassword,
  PasswordChange,
};

export const TabRoute = {
  HomeTab,
  SearchTab,
  AddPostTab,
  NotificationTab,
  ProfileTab,
};
