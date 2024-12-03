import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
 import DocumentSelection from "./components/selectDocuments";


const App: React.FC = () => {
  return (

    <Routes>
      <Route path="/selectDocuments" element={<DocumentSelection/>}/>
    </Routes>

  );
};

export default App;



