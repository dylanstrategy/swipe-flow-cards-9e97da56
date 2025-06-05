
import React from 'react';
import type { AppRole } from '@/types/supabase';

// Import the page components
import Index from '@/pages/Index';
import Discovery from '@/pages/Discovery';
import Matches from '@/pages/Matches';
import MoveIn from '@/pages/MoveIn';
import Maintenance from '@/pages/Maintenance';
import Operator from '@/pages/Operator';

interface ImpersonatedInterfaceProps {
  role: AppRole;
}

const ImpersonatedInterface: React.FC<ImpersonatedInterfaceProps> = ({ role }) => {
  console.log('🎭 ImpersonatedInterface rendering for role:', role);

  // Render the appropriate interface based on role
  const renderRoleInterface = () => {
    console.log('🎭 renderRoleInterface called with role:', role);
    try {
      switch (role) {
        case 'resident':
          console.log('🏠 Rendering resident interface (Index)');
          return (
            <div className="h-full">
              <Index isImpersonated={true} />
            </div>
          );
        case 'prospect':
          console.log('🔍 Rendering prospect interface (Discovery)');
          return (
            <div className="h-full">
              <Discovery />
            </div>
          );
        case 'operator':
        case 'senior_operator':
        case 'leasing':
          console.log('👨‍💼 Rendering operator interface');
          return (
            <div className="h-full">
              <Operator />
            </div>
          );
        case 'maintenance':
          console.log('🔧 Rendering maintenance interface');
          return (
            <div className="h-full">
              <Maintenance />
            </div>
          );
        case 'vendor':
          console.log('🏪 Rendering vendor interface (Index fallback)');
          return (
            <div className="h-full">
              <Index isImpersonated={true} />
            </div>
          );
        default:
          console.log('❓ Unknown role, rendering default interface (Index)');
          return (
            <div className="h-full">
              <Index isImpersonated={true} />
            </div>
          );
      }
    } catch (error) {
      console.error('❌ Error rendering role interface:', error);
      console.error('❌ Error stack:', error.stack);
      return (
        <div className="flex items-center justify-center h-64 p-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Interface Loading Error</h3>
            <p className="text-gray-600 mb-2">Failed to load {role} interface</p>
            <p className="text-sm text-red-600">{error.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Interface
            </button>
          </div>
        </div>
      );
    }
  };

  console.log('🎭 About to render ImpersonatedInterface wrapper');

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="p-3 bg-blue-50 border-b border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Preview Mode:</strong> Testing {role.replace('_', ' ')} user experience
        </p>
      </div>
      <div className="flex-1 h-full overflow-auto">
        {renderRoleInterface()}
      </div>
    </div>
  );
};

export default ImpersonatedInterface;
