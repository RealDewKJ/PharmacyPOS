import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../../domain/entities/product.dart';
import '../../domain/repositories/product_repository.dart';
import '../datasources/product_mock_datasource.dart';

class ProductMockRepositoryImpl implements ProductRepository {
  @override
  Future<Either<Failure, List<Product>>> getProducts({
    int page = 1,
    int limit = 10,
    String? search,
    String? categoryId,
  }) async {
    try {
      final products = ProductMockDataSource.getProducts(
        page: page,
        limit: limit,
        search: search,
        categoryId: categoryId,
      );
      return Right(products);
    } catch (e) {
      return Left(ServerFailure(message: 'Error loading products: $e'));
    }
  }

  @override
  Future<Either<Failure, Product>> getProductByBarcode(String barcode) async {
    try {
      final product = ProductMockDataSource.getProductByBarcode(barcode);
      if (product != null) {
        return Right(product);
      } else {
        return Left(ServerFailure(message: 'Product not found'));
      }
    } catch (e) {
      return Left(ServerFailure(message: 'Error loading product: $e'));
    }
  }

  @override
  Future<Either<Failure, List<Product>>> getLowStockProducts() async {
    try {
      final allProducts = ProductMockDataSource.getProducts();
      final lowStockProducts = allProducts
          .where((product) => product.stockQuantity <= product.minStockLevel)
          .toList();
      return Right(lowStockProducts);
    } catch (e) {
      return Left(
          ServerFailure(message: 'Error loading low stock products: $e'));
    }
  }

  @override
  Future<Either<Failure, List<Product>>> getExpiringProducts(
      {int days = 30}) async {
    try {
      final allProducts = ProductMockDataSource.getProducts();
      final cutoffDate = DateTime.now().add(Duration(days: days));
      final expiringProducts = allProducts
          .where((product) =>
              product.expiryDate != null &&
              product.expiryDate!.isBefore(cutoffDate))
          .toList();
      return Right(expiringProducts);
    } catch (e) {
      return Left(
          ServerFailure(message: 'Error loading expiring products: $e'));
    }
  }

  @override
  Future<Either<Failure, Product>> createProduct(Product product) async {
    // Mock implementation - just return the product as if it was created
    return Right(product);
  }

  @override
  Future<Either<Failure, Product>> updateProduct(Product product) async {
    // Mock implementation - just return the product as if it was updated
    return Right(product);
  }

  @override
  Future<Either<Failure, void>> deleteProduct(String id) async {
    // Mock implementation - just return success
    return const Right(null);
  }

  @override
  Future<Either<Failure, List<Category>>> getCategories() async {
    try {
      final categories = ProductMockDataSource.getCategories();
      return Right(categories);
    } catch (e) {
      return Left(ServerFailure(message: 'Error loading categories: $e'));
    }
  }

  @override
  Future<Either<Failure, Category>> createCategory(Category category) async {
    // Mock implementation - just return the category as if it was created
    return Right(category);
  }

  @override
  Future<Either<Failure, List<Supplier>>> getSuppliers() async {
    // Mock implementation - return empty list for now
    return const Right([]);
  }

  @override
  Future<Either<Failure, Supplier>> createSupplier(Supplier supplier) async {
    // Mock implementation - just return the supplier as if it was created
    return Right(supplier);
  }
}
