import 'package:dartz/dartz.dart';
import '../../../core/errors/failures.dart';
import '../../../core/usecases/usecase.dart';
import '../../repositories/auth_repository.dart';

class LogoutUseCase implements UseCaseNoParams<void> {
  final AuthRepository _repository;

  LogoutUseCase({required AuthRepository repository}) : _repository = repository;

  @override
  Future<Either<Failure, void>> call() async {
    return await _repository.logout();
  }
}
