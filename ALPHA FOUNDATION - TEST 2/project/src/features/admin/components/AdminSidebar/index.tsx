import React from 'react';
import { SidebarHeader } from './SidebarHeader';
import { ScrollableNav } from './ScrollableNav';

export const AdminSidebar: React.FC = () => {
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      <SidebarHeader />
      <ScrollableNav />
    </div>
  );
};