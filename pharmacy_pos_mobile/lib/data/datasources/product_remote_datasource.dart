import '../../core/constants/api_constants.dart';
import '../../core/network/api_client.dart';
import '../models/product_model.dart';

abstract class ProductRemoteDataSource {
  Future<Map<String, dynamic>> getProducts({
    int page = 1,
    int limit = 10,
    String? search,
    String? categoryId,
  });

  Future<ProductModel> getProductByBarcode(String barcode);

  Future<List<ProductModel>> getLowStockProducts();

  Future<List<ProductModel>> getExpiringProducts({int days = 30});

  Future<ProductModel> createProduct(Map<String, dynamic> productData);

  Future<ProductModel> updateProduct(String id, Map<String, dynamic> productData);

  Future<void> deleteProduct(String id);

  Future<List<CategoryModel>> getCategories();

  Future<CategoryModel> createCategory(Map<String, dynamic> categoryData);

  Future<List<SupplierModel>> getSuppliers();

  Future<SupplierModel> createSupplier(Map<String, dynamic> supplierData);
}

class ProductRemoteDataSourceImpl implements ProductRemoteDataSource {
  final ApiClient _apiClient;

  ProductRemoteDataSourceImpl({required ApiClient apiClient}) : _apiClient = apiClient;

  @override
  Future<Map<String, dynamic>> getProducts({
    int page = 1,
    int limit = 10,
    String? search,
    String? categoryId,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
    };

    if (search != null) queryParams['search'] = search;
    if (categoryId != null) queryParams['category'] = categoryId;

    return await _apiClient.get(
      ApiConstants.productsEndpoint,
      queryParameters: queryParams,
    );
  }

  @override
  Future<ProductModel> getProductByBarcode(String barcode) async {
    final response = await _apiClient.get(
      '${ApiConstants.productByBarcodeEndpoint}/$barcode',
    );
    return ProductModel.fromJson(response['product']);
  }

  @override
  Future<List<ProductModel>> getLowStockProducts() async {
    final response = await _apiClient.get(ApiConstants.lowStockProductsEndpoint);
    return (response['products'] as List).map((json) => ProductModel.fromJson(json)).toList();
  }

  @override
  Future<List<ProductModel>> getExpiringProducts({int days = 30}) async {
    final response = await _apiClient.get(
      ApiConstants.expiringProductsEndpoint,
      queryParameters: {'days': days},
    );
    return (response['products'] as List).map((json) => ProductModel.fromJson(json)).toList();
  }

  @override
  Future<ProductModel> createProduct(Map<String, dynamic> productData) async {
    final response = await _apiClient.post(
      ApiConstants.productsEndpoint,
      data: productData,
    );
    return ProductModel.fromJson(response['product']);
  }

  @override
  Future<ProductModel> updateProduct(String id, Map<String, dynamic> productData) async {
    final response = await _apiClient.put(
      '${ApiConstants.productsEndpoint}/$id',
      data: productData,
    );
    return ProductModel.fromJson(response['product']);
  }

  @override
  Future<void> deleteProduct(String id) async {
    await _apiClient.delete('${ApiConstants.productsEndpoint}/$id');
  }

  @override
  Future<List<CategoryModel>> getCategories() async {
    final response = await _apiClient.get(ApiConstants.categoriesEndpoint);
    return (response['categories'] as List).map((json) => CategoryModel.fromJson(json)).toList();
  }

  @override
  Future<CategoryModel> createCategory(Map<String, dynamic> categoryData) async {
    final response = await _apiClient.post(
      ApiConstants.categoriesEndpoint,
      data: categoryData,
    );
    return CategoryModel.fromJson(response['category']);
  }

  @override
  Future<List<SupplierModel>> getSuppliers() async {
    final response = await _apiClient.get(ApiConstants.suppliersEndpoint);
    return (response['suppliers'] as List).map((json) => SupplierModel.fromJson(json)).toList();
  }

  @override
  Future<SupplierModel> createSupplier(Map<String, dynamic> supplierData) async {
    final response = await _apiClient.post(
      ApiConstants.suppliersEndpoint,
      data: supplierData,
    );
    return SupplierModel.fromJson(response['supplier']);
  }
}
