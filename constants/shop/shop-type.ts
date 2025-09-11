export const shopTypeContent = {
  title: "Shop by Type",
  description: "Find the perfect dress based on your preferences and budget",
  navigationDelay: 300, // Delay in ms before navigation
  buttons: [
    {
      id: "used",
      title: "Used",
      link: "/products?type=Used",
      className: "top-button",
    },
    {
      id: "rental",
      title: "Rent",
      link: "/products?type=Rental",
      className: "middle-button",
    },
    {
      id: "new",
      title: "New",
      link: "/products?type=New",
      className: "bottom-button",
    },
  ],
  styles: {
    colors: {
      default: {
        background: "#2a2a2a",
        hover: "#3a3a3a",
        text: "rgba(255, 255, 255, 0.9)",
      },
      active: {
        background: "#CC9765",
        hover: "#D9A97C",
      },
    },
    dimensions: {
      mobile: {
        height: "48px",
        fontSize: "20px",
      },
      desktop: {
        height: "60px",
        fontSize: "24px",
      },
    },
    transitions: {
      timing: "cubic-bezier(0.25, 0.8, 0.25, 1)",
      duration: "300ms",
    },
    shadows: {
      default: "rgba(0, 0, 0, 0.15) 0px 2px 1px 0px inset, rgba(255, 255, 255, 0.17) 0px 1px 1px 0px",
      hover: "rgba(0, 0, 0, 0.23) 0px -4px 1px 0px inset, rgba(255, 255, 255, 0.17) 0px -1px 1px 0px, rgba(0, 0, 0, 0.17) 0px 2px 4px 1px",
      active: "rgba(0, 0, 0, 0.26) 0px -4px 1px 0px inset, rgba(255, 255, 255, 0.17) 0px -1px 1px 0px, rgba(0, 0, 0, 0.15) 0px 3px 6px 2px",
    },
  },
}