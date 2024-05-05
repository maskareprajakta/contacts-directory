// App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Update import
import ContactList from '../src/Contacts/ContactList';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes> {/* Use Routes instead of Switch */}
          <Route path="/" element={<ContactList />} /> {/* Use element prop */}
          {/* <Route path="/create" element={<ContactForm />} /> */}
          {/* <Route path="/edit/:id" element={<ContactForm />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
