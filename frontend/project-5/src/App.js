//importing packages
import { Routes, Route } from "react-router-dom";

//import components
import SuperSigninPage from "./superadmin components/SuperSigninPage"; //since the file inside the Register has the name of index.js then there is no need to specify it in the import path like this "./components/Register/index" because if you specify a folder then it look inside it files and if it saw a file with the name index then it will import that one, but if we want to import a file with another name then we need so specify it in the import path or it will not be imported

import { SigninPage } from "./user components/SigninPage"; //since we used export directly then we have to use the {} when importing
import { SignupPage } from "./user components/SignupPage"; //since we used export directly then we have to use the {} when importing
import HomePage from "./user components/HomePage";
import Navbar from "./user components/Navbar";
import SuperHomePage from "./superadmin components/SuperHomePage";

//styling
import "./App.css";

function App() {
  return (
    // this is for testing
    <div className="App">
      <Navbar />

      <Routes>
        <Route path="/super_admin/home" element={<SuperHomePage />} />
        <Route path="/super_admin/signin" element={<SuperSigninPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path={"/"} element={<HomePage />} />

        {/* this is the not found page component in case the user entered a path that is not defined in the routes above it will send him to this route, and that's why we put the "*" so we tell the code that if the entered path is nothing like the above path's then it means that it is something else and "*" means anything so it will choose this route and render the not found component */}
        <Route path="*" element={<h1>Page Was Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
