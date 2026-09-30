import React from "react";

interface RoleSelectorProps {
  roles: { name: string; icon: string }[];
  selectedRole: string;
  onSelectRole: (role: string) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  roles,
  selectedRole,
  onSelectRole,
}) => {
  return (
    <div className="flex justify-center space-x-4 mb-8">
      {roles.map((role) => (
        <div
          key={role.name}
          onClick={() => onSelectRole(role.name)}
          className={`cursor-pointer p-2 rounded-lg transition transform hover:scale-110 ${
            selectedRole === role.name ? "bg-yellow-400 text-gray-900" : "bg-gray-800 text-gray-200"
          }`}
        >
          <img src={role.icon} alt={role.name} className="w-8 h-8 mx-auto" />
          <p className="text-center text-sm mt-2">{role.name}</p>
        </div>
      ))}
    </div>
  );
};

export default RoleSelector;
