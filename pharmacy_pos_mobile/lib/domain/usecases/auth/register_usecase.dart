import 'package:dartz/dartz.dart';
import '../../../core/errors/failures.dart';
import '../../../core/usecases/usecase.dart';
import '../../repositories/auth_repository.dart';

class RegisterUseCase implements UseCase<Map<String, dynamic>, RegisterParams> {
  final AuthRepository _repository;

  RegisterUseCase({required AuthRepository repository}) : _repository = repository;

  @override
  Future<Either<Failure, Map<String, dynamic>>> call(RegisterParams params) async {
    return await _repository.register(
      email: params.email,
      password: params.password,
      name: params.name,
      role: params.role,
    );
  }
}

class RegisterParams {
  final String email;
  final String password;
  final String name;
  final String role;

  RegisterParams({
    required this.email,
    required this.password,
    required this.name,
    required this.role,
  });
}
