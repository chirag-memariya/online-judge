import React from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import markLogo from '../../assets/home_icon.svg';
import profileLogo from '../../assets/person-male--v2.png';
import { useLocation, useNavigate } from 'react-router-dom';

// Utility function to handle class names
const navLinkClasses = (current) => 
  `rounded-md px-3 py-2 text-sm font-medium ${current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`;
const navigation = [
  { name: 'Dashboard', href: '/admin-dashboard', current: true },
  { name: 'Problem List', href: '/admin-dashboard/problem-list', current: false },
  { name: 'Leaderboard', href: '/admin-dashboard/leaderboard', current: false },
  { name: 'Submissions', href: '/admin-dashboard/submissionlist', current: false },
  { name: 'User Management', href: '/admin-dashboard/user-management', current: false },
].map((item)=>({
  ...item,
  current: location.pathname==item.href,
}));

export default function AdminNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleProfileNavigation = () => navigate(`/admin/profile`);

  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logout successful');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Disclosure as="nav" className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={navLinkClasses(item.current)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open user menu</span>
                  <img
                    width="94"
                    height="94"
                    alt="Profile"
                    src={profileLogo}
                    className="h-8 w-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-lg bg-white py-2 shadow-xl ring-1 ring-gray-900/10 transition-transform transform-gpu duration-200 ease-out opacity-100 data-[closed]:opacity-0 data-[closed]:scale-95 data-[enter]:opacity-100 data-[enter]:scale-100"
              >
                <MenuItem>
                  <a
                    onClick={handleProfileNavigation}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={`block rounded-md px-3 py-2 text-base font-medium ${navLinkClasses(item.current)}`}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
