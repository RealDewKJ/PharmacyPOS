import 'package:dartz/dartz.dart';
import '../../../core/errors/failures.dart';
import '../../../core/usecases/usecase.dart';
import '../../entities/sale.dart';
import '../../repositories/dashboard_repository.dart';

class GetRecentSalesUseCase implements UseCaseNoParams<List<Sale>> {
  final DashboardRepository _repository;

  GetRecentSalesUseCase({required DashboardRepository repository}) : _repository = repository;

  @override
  Future<Either<Failure, List<Sale>>> call() async {
    return await _repository.getRecentSales();
  }
}
