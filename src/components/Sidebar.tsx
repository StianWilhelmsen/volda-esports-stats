import React from "react";

interface SidebarProps {
  onSelectView: (view: string) => void;
  selectedView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectView, selectedView }) => {
  const views = ["Players", "Standings", "Coach"];

  return (
    <div className=" w-64 bg-gray-800 text-gray-200 flex flex-col shadow-lg">
      <div className="flex items-center justify-center mt-4">
        <img
          src="/VoldaIcon.png"
          alt="Volda Icon"
          className="w-8 h-8 mr-2"
        />
        <h2 className="text-yellow-400 text-2xl font-bold">Volda E-Sport</h2>
      </div>
      <nav className="flex flex-col mt-8">
        {views.map((view) => (
          <button
            key={view}
            onClick={() => onSelectView(view)}
            className={`py-4 px-6 text-left text-lg ${
              selectedView === view
                ? "bg-yellow-400 text-gray-900"
                : "hover:bg-gray-700"
            }`}
          >
            {view}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
