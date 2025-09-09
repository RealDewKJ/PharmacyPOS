import 'package:dartz/dartz.dart';
import '../entities/product.dart';
import '../entities/pagination.dart';
import '../../core/errors/failures.dart';

abstract class ProductRepository {
  Future<Either<Failure, List<Product>>> getProducts({
    int page = 1,
    int limit = 10,
    String? search,
    String? categoryId,
  });

  Future<Either<Failure, Product>> getProductByBarcode(String barcode);

  Future<Either<Failure, List<Product>>> getLowStockProducts();

  Future<Either<Failure, List<Product>>> getExpiringProducts({int days = 30});

  Future<Either<Failure, Product>> createProduct(Product product);

  Future<Either<Failure, Product>> updateProduct(Product product);

  Future<Either<Failure, void>> deleteProduct(String id);

  Future<Either<Failure, List<Category>>> getCategories();

  Future<Either<Failure, Category>> createCategory(Category category);

  Future<Either<Failure, List<Supplier>>> getSuppliers();

  Future<Either<Failure, Supplier>> createSupplier(Supplier supplier);
}
