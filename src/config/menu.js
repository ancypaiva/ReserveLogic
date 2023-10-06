const Menu = [
  {
    name: 'Dashboard',
    urlPath: '/dashboard',
    modules: 'dashboard',
    icon: 'FaMicrosoft',
  },
  {
    name: 'Users',
    urlPath: '/user',
    modules: 'user',
    icon: 'FaAddressBook',
  },
  {
    name: 'Section-1',
    urlPath: '/sections',
    modules: 'sections',
    icon: 'FaAddressBook',
    subMenu: [
      {
        name: 'Employees',
        urlPath: '/employee',
        modules: 'employee',
        icon: 'FaAddressCard',
      },
      {
        name: 'Movies',
        urlPath: '/movies',
        modules: 'movies',
        icon: 'FaAddressCard',
      },
      {
        name: 'Hotels',
        urlPath: '/hotels',
        modules: 'hotels',
        icon: 'FaHotel',
      },
    ],
  },
  {
    name: 'Roles',
    urlPath: '/roles',
    modules: 'roles',
    icon: 'FaUser',
  },
];

module.exports = {
  Menu,
};
