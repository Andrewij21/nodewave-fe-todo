export const NAV_LINKS = {
  navMain: [
    {
      title: "Node Wave",
      url: "#",
      items: [
        {
          title: "dashboard",
          url: "/dashboard",
          roles: ["USER"],
        },
        {
          title: "Users",
          url: "/users",
          roles: ["USER"],
        },
        {
          title: "Todo",
          url: "/todo",
          roles: ["USER", "ADMIN"],
        },
      ],
    },
    {
      title: "admin",
      url: "/admin",
      roles: ["USER", "admin"],
      items: [],
    },
  ],
};
