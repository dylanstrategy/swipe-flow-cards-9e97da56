
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
    switch (role) {
      case 'resident':
        console.log('🏠 Rendering resident interface (Index)');
        return <Index />;
      case 'prospect':
        console.log('🔍 Rendering prospect interface (Discovery)');
        return <Discovery />;
      case 'operator':
      case 'senior_operator':
      case 'leasing':
        console.log('👨‍💼 Rendering operator interface');
        return <Operator />;
      case 'maintenance':
        console.log('🔧 Rendering maintenance interface');
        return <Maintenance />;
      case 'vendor':
        console.log('🏪 Rendering vendor interface (Index fallback)');
        return <Index />;
      default:
        console.log('❓ Unknown role, rendering default interface (Index)');
        return <Index />;
    }
  };

  return (
    <div className="w-full h-full">
      {renderRoleInterface()}
    </div>
  );
};

export default ImpersonatedInterface;
