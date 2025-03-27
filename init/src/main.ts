export default function () {
  // Tạo page mới cho XLab Website
  const page = figma.createPage();
  page.name = "XLab Website";
  figma.currentPage = page;

  // Tạo các Figma styles và components
  createStyles();
  createComponents();

  // Tạo các trang của website
  createHomePage();
  createProductsPage();
  createServicesPage();
  createContactPage();

  figma.closePlugin('Đã tạo thiết kế XLab Website trong Figma');
}

// Tạo colors, text styles và effects
function createStyles() {
  // Colors
  const colorStyles = [
    { name: "Blue/50", r: 239/255, g: 246/255, b: 255/255 },
    { name: "Blue/100", r: 219/255, g: 234/255, b: 254/255 },
    { name: "Blue/500", r: 59/255, g: 130/255, b: 246/255 },
    { name: "Blue/600", r: 37/255, g: 99/255, b: 235/255 },
    { name: "Gray/50", r: 249/255, g: 250/255, b: 251/255 },
    { name: "Gray/100", r: 243/255, g: 244/255, b: 246/255 },
    { name: "Gray/800", r: 31/255, g: 41/255, b: 55/255 },
    { name: "Gray/900", r: 17/255, g: 24/255, b: 39/255 },
  ];

  colorStyles.forEach(color => {
    const style = figma.createPaintStyle();
    style.name = color.name;
    const paint: SolidPaint = {
      type: "SOLID",
      color: { r: color.r, g: color.g, b: color.b },
    };
    style.paints = [paint];
  });

  // Text Styles
  const textStyles = [
    { name: "Heading/H1", size: 48, fontWeight: 600 },
    { name: "Heading/H2", size: 36, fontWeight: 600 },
    { name: "Body/Regular", size: 16, fontWeight: 400 },
    { name: "Body/Medium", size: 16, fontWeight: 500 },
  ];

  // Không thể tạo text styles vì các font cần load
  // Thông báo lỗi thay vì tạo text styles
  console.log("Text styles không thể được tạo tự động do hạn chế của plugin API");
}

// Tạo components chung
function createComponents() {
  // Header Component
  const header = figma.createComponent();
  header.name = "Header";
  header.resize(1440, 80);
  header.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.9 }];

  // Footer Component
  const footer = figma.createComponent();
  footer.name = "Footer";
  footer.resize(1440, 300);
  footer.fills = [{ type: "SOLID", color: { r: 17/255, g: 24/255, b: 39/255 } }];

  // Button Component
  const button = figma.createComponent();
  button.name = "Button/Primary";
  button.resize(180, 48);
  button.cornerRadius = 24;
  button.fills = [{ type: "SOLID", color: { r: 37/255, g: 99/255, b: 235/255 } }];
}

// Tạo trang chủ
function createHomePage() {
  const frame = figma.createFrame();
  frame.name = "Homepage";
  frame.resize(1440, 3200);
  
  // Hero Section
  const heroSection = figma.createFrame();
  heroSection.name = "Hero Section";
  heroSection.resize(1440, 600);
  heroSection.fills = [{ type: "SOLID", color: { r: 37/255, g: 99/255, b: 235/255 } }];
  frame.appendChild(heroSection);
  
  // Feature Section
  const featureSection = figma.createFrame();
  featureSection.name = "Feature Section";
  featureSection.resize(1440, 600);
  featureSection.y = 600;
  featureSection.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  frame.appendChild(featureSection);
  
  // Product Section
  const productSection = figma.createFrame();
  productSection.name = "Product Section";
  productSection.resize(1440, 800);
  productSection.y = 1200;
  productSection.fills = [{ type: "SOLID", color: { r: 249/255, g: 250/255, b: 251/255 } }];
  frame.appendChild(productSection);
  
  // Service Section
  const serviceSection = figma.createFrame();
  serviceSection.name = "Service Section";
  serviceSection.resize(1440, 600);
  serviceSection.y = 2000;
  serviceSection.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  frame.appendChild(serviceSection);
  
  // CTA Section
  const ctaSection = figma.createFrame();
  ctaSection.name = "CTA Section";
  ctaSection.resize(1440, 300);
  ctaSection.y = 2600;
  ctaSection.fills = [{ type: "SOLID", color: { r: 37/255, g: 99/255, b: 235/255 } }];
  frame.appendChild(ctaSection);
}

// Tạo trang sản phẩm
function createProductsPage() {
  const frame = figma.createFrame();
  frame.name = "Products Page";
  frame.resize(1440, 2000);
  
  // Hero Section
  const heroSection = figma.createFrame();
  heroSection.name = "Hero Section";
  heroSection.resize(1440, 400);
  heroSection.fills = [{ type: "SOLID", color: { r: 37/255, g: 99/255, b: 235/255 } }];
  frame.appendChild(heroSection);
  
  // Products List
  const productsSection = figma.createFrame();
  productsSection.name = "Products List";
  productsSection.resize(1440, 1200);
  productsSection.y = 400;
  productsSection.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  frame.appendChild(productsSection);
}

// Tạo trang dịch vụ
function createServicesPage() {
  const frame = figma.createFrame();
  frame.name = "Services Page";
  frame.resize(1440, 2000);
  
  // Hero Section
  const heroSection = figma.createFrame();
  heroSection.name = "Hero Section";
  heroSection.resize(1440, 400);
  heroSection.fills = [{ type: "SOLID", color: { r: 37/255, g: 99/255, b: 235/255 } }];
  frame.appendChild(heroSection);
  
  // Services List
  const servicesSection = figma.createFrame();
  servicesSection.name = "Services List";
  servicesSection.resize(1440, 1200);
  servicesSection.y = 400;
  servicesSection.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  frame.appendChild(servicesSection);
}

// Tạo trang liên hệ
function createContactPage() {
  const frame = figma.createFrame();
  frame.name = "Contact Page";
  frame.resize(1440, 1600);
  
  // Hero Section
  const heroSection = figma.createFrame();
  heroSection.name = "Hero Section";
  heroSection.resize(1440, 400);
  heroSection.fills = [{ type: "SOLID", color: { r: 37/255, g: 99/255, b: 235/255 } }];
  frame.appendChild(heroSection);
  
  // Contact Form
  const contactSection = figma.createFrame();
  contactSection.name = "Contact Form";
  contactSection.resize(1440, 800);
  contactSection.y = 400;
  contactSection.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  frame.appendChild(contactSection);
  
  // Map Section
  const mapSection = figma.createFrame();
  mapSection.name = "Map Section";
  mapSection.resize(1440, 400);
  mapSection.y = 1200;
  mapSection.fills = [{ type: "SOLID", color: { r: 243/255, g: 244/255, b: 246/255 } }];
  frame.appendChild(mapSection);
}
