// src/layouts/StudentDashboard.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentNavbar from '../components/StudentDashboard/StudentNavbar ';

const StudentDashboard = () => {
  return (
    <div>
      <StudentNavbar />
      <div style={{ padding: 20 }}>
        <Outlet /> {/* Alt sayfalar buraya render edilir */}
      </div>
    </div>
  );
};

export default StudentDashboard;
