import '../../core/constants/api_constants.dart';
import '../../core/network/api_client.dart';
import '../models/dashboard_model.dart';
import '../models/sale_model.dart';

abstract class DashboardRemoteDataSource {
  Future<DashboardStatsModel> getDashboardStats();

  Future<List<SaleModel>> getRecentSales();

  Future<Map<String, dynamic>> getSalesByPeriod({
    required String period,
  });

  Future<List<TopProductModel>> getTopProducts({
    int limit = 10,
  });
}

class DashboardRemoteDataSourceImpl implements DashboardRemoteDataSource {
  final ApiClient _apiClient;

  DashboardRemoteDataSourceImpl({required ApiClient apiClient})
      : _apiClient = apiClient;

  @override
  Future<DashboardStatsModel> getDashboardStats() async {
    final response = await _apiClient.get(ApiConstants.dashboardStatsEndpoint);
    return DashboardStatsModel.fromJson(response['stats']);
  }

  @override
  Future<List<SaleModel>> getRecentSales() async {
    final response = await _apiClient.get(ApiConstants.recentSalesEndpoint);
    return (response['recentSales'] as List)
        .map((json) => SaleModel.fromJson(json))
        .toList();
  }

  @override
  Future<Map<String, dynamic>> getSalesByPeriod({
    required String period,
  }) async {
    return await _apiClient.get(
      ApiConstants.salesByPeriodEndpoint,
      queryParameters: {'period': period},
    );
  }

  @override
  Future<List<TopProductModel>> getTopProducts({
    int limit = 10,
  }) async {
    final response = await _apiClient.get(
      ApiConstants.topProductsEndpoint,
      queryParameters: {'limit': limit},
    );
    return (response['topProducts'] as List)
        .map((json) => TopProductModel.fromJson(json))
        .toList();
  }
}
