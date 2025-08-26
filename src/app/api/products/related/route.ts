import { NextRequest, NextResponse } from 'next/server';

import { getAllProducts } from '@/lib/i18n/products';
import { Product } from '@/models/ProductModel';

// Đọc dữ liệu sản phẩm từ JSON file
// const productsPath = path.join(process.cwd(), 'src/data/products.json');

export async function GET(_request: NextRequest) {
  try {
    // Lấy các tham số từ URL
    const { searchParams } = new URL(_request.url);
    const productId = searchParams.get('productId');
    const categoryId = searchParams.get('categoryId');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 4;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID là bắt buộc' }, { status: 400 });
    }

    // Lấy ngôn ngữ từ header hoặc tham số truy vấn (mặc định là 'vie')
    const acceptLanguage = _request.headers.get('accept-language');
    const language = acceptLanguage || 'vie';

    // Lấy tất cả sản phẩm từ thư viện i18n thay vì đọc từ file
    const productsData = await getAllProducts(language);

    // Tìm sản phẩm hiện tại để lấy thông tin
    const currentProduct = productsData.find(
      (p: Product) => p.id === productId || p.slug === productId,
    );

    if (!currentProduct) {
      return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    let relatedProducts: Product[] = [];

    // Nếu sản phẩm hiện tại có danh sách relatedProducts, ưu tiên lấy từ đây
    const relatedProductIds = (currentProduct as any).relatedProducts;
    if (relatedProductIds && Array.isArray(relatedProductIds) && relatedProductIds.length > 0) {
      relatedProducts = productsData.filter(
        (p: Product) => relatedProductIds.includes(p.id) && p.id !== productId,
      );
    }
    // Nếu không, lấy sản phẩm từ cùng danh mục
    else if (categoryId) {
      relatedProducts = productsData.filter((p: Product) => {
        const productCategories = p.categories || [];
        const hasCategory = productCategories.some((cat: any) =>
          typeof cat === 'string' ? cat === categoryId : cat.id === categoryId,
        );
        return hasCategory && p.id !== productId;
      });
    }

    // Nếu vẫn không có, lấy các sản phẩm ngẫu nhiên
    if (relatedProducts.length === 0) {
      relatedProducts = productsData
        .filter((p: Product) => p.id !== productId)
        .sort(() => 0.5 - Math.random());
    }

    // Giới hạn số lượng sản phẩm trả về
    relatedProducts = relatedProducts.slice(0, limit);
    
    // Xử lý dữ liệu sản phẩm để đảm bảo định dạng hình ảnh đúng
    const formattedProducts = relatedProducts.map((product: Product) => {
      // Tạo bản sao của sản phẩm để không ảnh hưởng đến dữ liệu gốc
      const formattedProduct: any = { ...product };
      
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
        const firstOption = Object.values(formattedProduct.optionPrices)[0] as any;
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
      
      return formattedProduct;
    });

    return NextResponse.json(formattedProducts);
  } catch (_error) {
    console.error('Lỗi khi xử lý sản phẩm liên quan:', _error);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 });
  }
}
