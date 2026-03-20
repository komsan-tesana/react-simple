export const menuItems = [
  { key: "/", label: "Home", show: false },
  { key: "/auth", label: "Auth", show: false },
  { key: "/products/:id", label: "Products Detail", show: false },

  //Common Show
  { key: "/search", label: "Find a Cat", show: true },
  { key: "/virtualAdopt", label: "Virtual Adopt", show: true },
  { key: "/successStories", label: "Success Stories", show: true },

  // Admin
  {
    key: "admin",
    label: "Admin Menu",
    show: true,
    admin: true,
    children: [
      {
        label: "Checkout",
        key: "/admin/checkout",
        show: true,
      },
      {
        label: "Add-products",
        key: "/admin/add-products",
        show: false,
      },
    ],
  },
];
