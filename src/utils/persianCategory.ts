  export const persianCategory = (cat: string) => {
    switch(cat) {
      case "electronics":
        return "الکترونیکی";
      case "clothing":
        return "پوشاک";
      case "food":
        return "خوراکی";
      case "home":
        return "لوازم خانگی"
      case "books":
        return "کتاب";
      default:
        return cat;
    }
  }