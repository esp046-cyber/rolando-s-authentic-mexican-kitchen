import React from 'react';
import { Home, Search, Heart, User } from 'lucide-react';
import { Tab } from '../types';

interface Props {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Navbar: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'favorites', icon: Heart, label: 'Saved' },
    { id: 'profile', icon: User, label: 'Rolando' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-stone-200 py-3 px-6 z-40 pb-safe">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-amber-600' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;