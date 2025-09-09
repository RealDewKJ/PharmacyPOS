import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../constants/api_constants.dart';
import '../errors/exceptions.dart';

class ApiClient {
  late final Dio _dio;
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  ApiClient() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConstants.baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        ApiConstants.contentTypeHeader: ApiConstants.applicationJson,
      },
    ));

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _secureStorage.read(key: 'auth_token');
          if (token != null) {
            options.headers[ApiConstants.authorizationHeader] = '${ApiConstants.bearerPrefix}$token';
          }
          handler.next(options);
        },
        onError: (error, handler) {
          if (error.response != null) {
            final statusCode = error.response!.statusCode;
            final message = error.response!.data?['message'] ?? 'Unknown error';

            switch (statusCode) {
              case 400:
                throw ValidationException(message: message);
              case 401:
                throw AuthenticationException(message: message);
              case 403:
                throw AuthorizationException(message: message);
              case 404:
                throw ServerException(message: 'Resource not found', statusCode: statusCode);
              case 500:
                throw ServerException(message: 'Internal server error', statusCode: statusCode);
              default:
                throw ServerException(message: message, statusCode: statusCode);
            }
          } else {
            throw NetworkException(message: 'Network error: ${error.message}');
          }
        },
      ),
    );
  }

  Future<Map<String, dynamic>> get(
    String endpoint, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final response = await _dio.get(
        endpoint,
        queryParameters: queryParameters,
      );
      return response.data;
    } on DioException catch (e) {
      throw _handleDioException(e);
    }
  }

  Future<Map<String, dynamic>> post(
    String endpoint, {
    Map<String, dynamic>? data,
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final response = await _dio.post(
        endpoint,
        data: data,
        queryParameters: queryParameters,
      );
      return response.data;
    } on DioException catch (e) {
      throw _handleDioException(e);
    }
  }

  Future<Map<String, dynamic>> put(
    String endpoint, {
    Map<String, dynamic>? data,
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final response = await _dio.put(
        endpoint,
        data: data,
        queryParameters: queryParameters,
      );
      return response.data;
    } on DioException catch (e) {
      throw _handleDioException(e);
    }
  }

  Future<Map<String, dynamic>> delete(
    String endpoint, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final response = await _dio.delete(
        endpoint,
        queryParameters: queryParameters,
      );
      return response.data;
    } on DioException catch (e) {
      throw _handleDioException(e);
    }
  }

  Exception _handleDioException(DioException e) {
    if (e.response != null) {
      final statusCode = e.response!.statusCode;
      final message = e.response!.data?['message'] ?? 'Unknown error';

      switch (statusCode) {
        case 400:
          return ValidationException(message: message);
        case 401:
          return AuthenticationException(message: message);
        case 403:
          return AuthorizationException(message: message);
        case 404:
          return ServerException(message: 'Resource not found', statusCode: statusCode);
        case 500:
          return ServerException(message: 'Internal server error', statusCode: statusCode);
        default:
          return ServerException(message: message, statusCode: statusCode);
      }
    } else {
      return NetworkException(message: 'Network error: ${e.message}');
    }
  }
}
