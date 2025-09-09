import 'package:dartz/dartz.dart';
import '../entities/dashboard.dart';
import '../entities/sale.dart';
import '../../core/errors/failures.dart';

abstract class DashboardRepository {
  Future<Either<Failure, DashboardStats>> getDashboardStats();

  Future<Either<Failure, List<Sale>>> getRecentSales();

  Future<Either<Failure, Map<String, dynamic>>> getSalesByPeriod({
    required String period,
  });

  Future<Either<Failure, List<TopProduct>>> getTopProducts({
    int limit = 10,
  });
}
