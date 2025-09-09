import '../../core/constants/api_constants.dart';
import '../../core/network/api_client.dart';
import '../models/sale_model.dart';

abstract class SaleRemoteDataSource {
  Future<Map<String, dynamic>> getSales({
    int page = 1,
    int limit = 10,
    String? startDate,
    String? endDate,
  });

  Future<SaleModel> createSale(Map<String, dynamic> saleData);

  Future<List<CustomerModel>> getCustomers({
    int page = 1,
    int limit = 10,
    String? search,
  });

  Future<CustomerModel> createCustomer(Map<String, dynamic> customerData);
}

class SaleRemoteDataSourceImpl implements SaleRemoteDataSource {
  final ApiClient _apiClient;

  SaleRemoteDataSourceImpl({required ApiClient apiClient}) : _apiClient = apiClient;

  @override
  Future<Map<String, dynamic>> getSales({
    int page = 1,
    int limit = 10,
    String? startDate,
    String? endDate,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
    };

    if (startDate != null) queryParams['startDate'] = startDate;
    if (endDate != null) queryParams['endDate'] = endDate;

    return await _apiClient.get(
      ApiConstants.salesEndpoint,
      queryParameters: queryParams,
    );
  }

  @override
  Future<SaleModel> createSale(Map<String, dynamic> saleData) async {
    final response = await _apiClient.post(
      ApiConstants.salesEndpoint,
      data: saleData,
    );
    return SaleModel.fromJson(response['sale']);
  }

  @override
  Future<List<CustomerModel>> getCustomers({
    int page = 1,
    int limit = 10,
    String? search,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
    };

    if (search != null) queryParams['search'] = search;

    final response = await _apiClient.get(
      ApiConstants.customersEndpoint,
      queryParameters: queryParams,
    );

    return (response['customers'] as List).map((json) => CustomerModel.fromJson(json)).toList();
  }

  @override
  Future<CustomerModel> createCustomer(Map<String, dynamic> customerData) async {
    final response = await _apiClient.post(
      ApiConstants.customersEndpoint,
      data: customerData,
    );
    return CustomerModel.fromJson(response['customer']);
  }
}
