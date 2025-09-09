import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import '../../core/network/api_client.dart';
import '../models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  });

  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String name,
    required String role,
  });

  Future<UserModel> getCurrentUser();
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final ApiClient _apiClient;

  AuthRemoteDataSourceImpl({required ApiClient apiClient}) : _apiClient = apiClient;

  @override
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await _apiClient.post(
      ApiConstants.loginEndpoint,
      data: {
        'email': email,
        'password': password,
      },
    );
    return response;
  }

  @override
  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String name,
    required String role,
  }) async {
    final response = await _apiClient.post(
      ApiConstants.registerEndpoint,
      data: {
        'email': email,
        'password': password,
        'name': name,
        'role': role,
      },
    );
    return response;
  }

  @override
  Future<UserModel> getCurrentUser() async {
    final response = await _apiClient.get(ApiConstants.meEndpoint);
    return UserModel.fromJson(response['user']);
  }
}
