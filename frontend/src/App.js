import React, { Component } from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Homepage from "./components/homepage.component";
import AdminHomepage from "./components/adminhomepage.component";
import CurrentQuestionnaire from "./components/currentquestionnaire.component";
import AdminPage from "./components/adminpage.component";
import AdminPageQuestionnaire from "./components/adminpagequestionnaire.component";
import AdminPageSession from "./components/adminpagesession.component";

export default class App extends Component {

  render() {
    return (

            <div className="container mt-3">
                <BrowserRouter>
                    <Routes>
                        <Route exact path="/" element={<Homepage/>}/>
                        <Route exact path="/admin_homepage" element ={<AdminHomepage/>}/>
                        <Route exact path="/admin_page" element={<AdminPage/>}/>
                        <Route exact path="/current_questionnaire" element={<CurrentQuestionnaire/>}/>
                        <Route exact path="/admin_page_questionnaire" element={<AdminPageQuestionnaire/>}/>
                        <Route exact path="/admin_page_session" element={<AdminPageSession/>}/>
                    </Routes>
                </BrowserRouter>
            </div>

    );
  }
}