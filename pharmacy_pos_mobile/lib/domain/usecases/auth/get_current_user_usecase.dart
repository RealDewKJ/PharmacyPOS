import 'package:dartz/dartz.dart';
import '../../../core/errors/failures.dart';
import '../../../core/usecases/usecase.dart';
import '../../entities/user.dart';
import '../../repositories/auth_repository.dart';

class GetCurrentUserUseCase implements UseCaseNoParams<User> {
  final AuthRepository _repository;

  GetCurrentUserUseCase({required AuthRepository repository}) : _repository = repository;

  @override
  Future<Either<Failure, User>> call() async {
    return await _repository.getCurrentUser();
  }
}
