import 'package:dartz/dartz.dart';
import '../entities/sale.dart';
import '../entities/pagination.dart';
import '../../core/errors/failures.dart';

abstract class SaleRepository {
  Future<Either<Failure, List<Sale>>> getSales({
    int page = 1,
    int limit = 10,
    String? startDate,
    String? endDate,
  });

  Future<Either<Failure, Sale>> createSale(Sale sale);

  Future<Either<Failure, List<Customer>>> getCustomers({
    int page = 1,
    int limit = 10,
    String? search,
  });

  Future<Either<Failure, Customer>> createCustomer(Customer customer);
}
