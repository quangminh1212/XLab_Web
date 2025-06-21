import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { productsData } from '@/locales/productsData';

<<<<<<< HEAD
// Đọc dữ liệu sản phẩm từ JSON file trong locales
const productsPath = path.join(process.cwd(), 'src/locales/vie/products.json');
=======
// Define a generic product interface to handle various product structures
interface GenericProduct {
  id: string;
  slug?: string;
  name?: string;
  price?: number;
  originalPrice?: number;
  salePrice?: number;
  images?: string[] | any[];
  image?: string | string[];
  imageUrl?: string;
  categories?: any[];
  versions?: any[];
  optionPrices?: Record<string, any>;
  relatedProducts?: string[];
  [key: string]: any; // Allow for any additional properties
}
>>>>>>> 8b81a835c3132e7388e78c2b20148965af49f470

export async function GET(request: NextRequest) {
  try {
    // Lấy các tham số từ URL
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const categoryId = searchParams.get('categoryId');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 4;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID là bắt buộc' }, { status: 400 });
    }

<<<<<<< HEAD
    // Đọc dữ liệu từ file
    const productsRawData = fs.readFileSync(productsPath, 'utf8');
    const productsJsonData = JSON.parse(productsRawData);
    
    // Chuyển đổi cấu trúc dữ liệu từ object sang array để xử lý dễ dàng hơn
    const productsData = Object.entries(productsJsonData).map(([id, data]: [string, any]) => {
      return {
        id,
        slug: id,
        ...data,
        categories: [{ id: 'software', name: 'Phần mềm', slug: 'software' }], // Default category
      };
    });
=======
    // Lấy danh sách sản phẩm từ tất cả các ngôn ngữ và gộp lại
    // Ưu tiên tiếng Việt làm ngôn ngữ chính
    const allProducts: GenericProduct[] = [
      ...productsData.vie,
      ...productsData.eng,
      ...productsData.spa
    ];
    
    // Lọc các sản phẩm trùng lặp theo ID
    const uniqueProducts: GenericProduct[] = allProducts.filter((product, index, self) =>
      index === self.findIndex(p => p.id === product.id)
    );
>>>>>>> 8b81a835c3132e7388e78c2b20148965af49f470

    // Tìm sản phẩm hiện tại để lấy thông tin
    const currentProduct: GenericProduct | undefined = uniqueProducts.find(
      (p) => p.id === productId || p.slug === productId,
    );

    if (!currentProduct) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    let relatedProducts: GenericProduct[] = [];

    // Nếu sản phẩm hiện tại có danh sách relatedProducts, ưu tiên lấy từ đây
    if (currentProduct.relatedProducts && currentProduct.relatedProducts.length > 0) {
      relatedProducts = uniqueProducts.filter(
        (p) => currentProduct.relatedProducts?.includes(p.id) && p.id !== productId,
      );
    }
    // Nếu không, lấy sản phẩm từ cùng danh mục
    else if (categoryId) {
      relatedProducts = uniqueProducts.filter((p) => {
        const productCategories = p.categories || [];
        const hasCategory = productCategories.some((cat: any) => {
          if (typeof cat === 'string') {
            return cat === categoryId;
          }
          
          // Handle nested category structures
          if (cat.id && typeof cat.id === 'string') {
            return cat.id === categoryId;
          }
          
          // Handle more complex nested structures
          if (cat.id && cat.id.id) {
            return cat.id.id === categoryId;
          }
          
          return false;
        });
        return hasCategory && p.id !== productId;
      });
    }

    // Nếu vẫn không có, lấy các sản phẩm ngẫu nhiên
    if (relatedProducts.length === 0) {
      relatedProducts = uniqueProducts
        .filter((p) => p.id !== productId)
        .sort(() => 0.5 - Math.random());
    }

    // Giới hạn số lượng sản phẩm trả về
    relatedProducts = relatedProducts.slice(0, limit);
    
    // Xử lý dữ liệu sản phẩm để đảm bảo định dạng hình ảnh đúng
    const formattedProducts = relatedProducts.map((product) => {
      // Tạo bản sao của sản phẩm để không ảnh hưởng đến dữ liệu gốc
      const formattedProduct: GenericProduct = { ...product };
      
      // Xử lý trường images nếu là mảng
      if (Array.isArray(formattedProduct.images) && formattedProduct.images.length > 0) {
        // Thêm trường imageUrl là đường dẫn đến ảnh đầu tiên
        formattedProduct.imageUrl = formattedProduct.images[0];
        formattedProduct.image = formattedProduct.images[0];
      } 
      // Nếu không có images nhưng có image là mảng
      else if (Array.isArray(formattedProduct.image) && formattedProduct.image.length > 0) {
        formattedProduct.imageUrl = formattedProduct.image[0];
        formattedProduct.image = formattedProduct.image[0];
      }
      // Nếu không có ảnh, sử dụng ảnh mặc định
      else if (!formattedProduct.image && !formattedProduct.imageUrl) {
        formattedProduct.imageUrl = '/images/placeholder/product-placeholder.jpg';
        formattedProduct.image = '/images/placeholder/product-placeholder.jpg';
      }

      // Đảm bảo giá được xử lý đúng
      if (formattedProduct.versions && formattedProduct.versions.length > 0) {
        // Sử dụng giá từ phiên bản đầu tiên nếu không có giá cố định
        if (!formattedProduct.price || formattedProduct.price === 0) {
          formattedProduct.price = formattedProduct.versions[0].price;
        }
        // Sử dụng giá gốc từ phiên bản đầu tiên nếu không có giá gốc cố định
        if (!formattedProduct.originalPrice) {
          formattedProduct.originalPrice = formattedProduct.versions[0].originalPrice;
        }
      } else if (formattedProduct.optionPrices) {
        // Nếu có optionPrices, sử dụng giá của tùy chọn đầu tiên
        const firstOption = Object.values(formattedProduct.optionPrices)[0];
        if (firstOption && (!formattedProduct.price || formattedProduct.price === 0)) {
          formattedProduct.price = firstOption.price;
          formattedProduct.originalPrice = firstOption.originalPrice;
        }
      } else if (formattedProduct.productOptions) {
        // Nếu có productOptions (cấu trúc mới), lấy giá từ option đầu tiên
        const firstOption = Object.values(formattedProduct.productOptions)[0] as any;
        if (firstOption && (!formattedProduct.price || formattedProduct.price === 0)) {
          formattedProduct.price = firstOption.price;
          formattedProduct.originalPrice = firstOption.originalPrice;
        }
      }
      
      // Đảm bảo luôn có giá
      if (!formattedProduct.price || formattedProduct.price === 0) {
        // Nếu có salePrice, sử dụng nó
        if (formattedProduct.salePrice) {
          formattedProduct.price = formattedProduct.salePrice;
        } else {
          // Đặt giá mặc định nếu không có giá
          formattedProduct.price = 0;
        }
      }
      
      // Thêm đường dẫn hình ảnh nếu chưa có
      if (!formattedProduct.image && !formattedProduct.imageUrl) {
        formattedProduct.imageUrl = `/images/products/${formattedProduct.id}/1.jpg`;
        formattedProduct.image = `/images/products/${formattedProduct.id}/1.jpg`;
      }
      
      return formattedProduct;
    });

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Lỗi khi xử lý sản phẩm liên quan:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 });
  }
}
