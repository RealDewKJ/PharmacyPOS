import 'package:dartz/dartz.dart';
import '../../../core/errors/failures.dart';
import '../../../core/usecases/usecase.dart';
import '../../entities/dashboard.dart';
import '../../repositories/dashboard_repository.dart';

class GetDashboardStatsUseCase implements UseCaseNoParams<DashboardStats> {
  final DashboardRepository _repository;

  GetDashboardStatsUseCase({required DashboardRepository repository}) : _repository = repository;

  @override
  Future<Either<Failure, DashboardStats>> call() async {
    return await _repository.getDashboardStats();
  }
}
