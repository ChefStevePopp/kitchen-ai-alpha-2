import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AdminSidebar } from '../AdminSidebar';
import { UserMenu } from '@/shared/components/UserMenu';
import { ROUTES } from '@/config/routes';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AdminSidebar />
      <div className="ml-64 min-h-screen">
        <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate(ROUTES.KITCHEN.DASHBOARD)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Return to Kitchen AI
            </button>
            <UserMenu />
          </div>
        </div>
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};