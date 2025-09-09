import 'package:dartz/dartz.dart';
import '../../core/errors/exceptions.dart';
import '../../core/errors/failures.dart';
import '../../domain/entities/sale.dart';
import '../../domain/entities/pagination.dart';
import '../../domain/repositories/sale_repository.dart';
import '../datasources/sale_remote_datasource.dart';
import '../models/sale_model.dart';

class SaleRepositoryImpl implements SaleRepository {
  final SaleRemoteDataSource _remoteDataSource;

  SaleRepositoryImpl({required SaleRemoteDataSource remoteDataSource})
      : _remoteDataSource = remoteDataSource;

  @override
  Future<Either<Failure, List<Sale>>> getSales({
    int page = 1,
    int limit = 10,
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _remoteDataSource.getSales(
        page: page,
        limit: limit,
        startDate: startDate,
        endDate: endDate,
      );

      final sales = (response['sales'] as List)
          .map((json) => SaleModel.fromJson(json).toEntity())
          .toList();

      return Right(sales);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: 'Unexpected error: $e'));
    }
  }

  @override
  Future<Either<Failure, Sale>> createSale(Sale sale) async {
    try {
      final saleData = {
        'items': sale.items.map((item) => {
          'productId': item.productId,
          'quantity': item.quantity,
          'price': item.price,
        }).toList(),
        'customerId': sale.customerId,
        'paymentMethod': sale.paymentMethod,
        'discount': sale.discount,
        'tax': sale.tax,
      };

      final saleModel = await _remoteDataSource.createSale(saleData);
      return Right(saleModel.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: 'Unexpected error: $e'));
    }
  }

  @override
  Future<Either<Failure, List<Customer>>> getCustomers({
    int page = 1,
    int limit = 10,
    String? search,
  }) async {
    try {
      final customerModels = await _remoteDataSource.getCustomers(
        page: page,
        limit: limit,
        search: search,
      );

      final customers = customerModels.map((model) => model.toEntity()).toList();
      return Right(customers);
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: 'Unexpected error: $e'));
    }
  }

  @override
  Future<Either<Failure, Customer>> createCustomer(Customer customer) async {
    try {
      final customerData = {
        'name': customer.name,
        'email': customer.email,
        'phone': customer.phone,
        'address': customer.address,
      };

      final customerModel = await _remoteDataSource.createCustomer(customerData);
      return Right(customerModel.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(message: e.message));
    } catch (e) {
      return Left(ServerFailure(message: 'Unexpected error: $e'));
    }
  }
}
