import 'package:dartz/dartz.dart';
import '../../../core/errors/failures.dart';
import '../../../core/usecases/usecase.dart';
import '../../entities/product.dart';
import '../../repositories/product_repository.dart';

class GetProductsUseCase implements UseCase<List<Product>, GetProductsParams> {
  final ProductRepository _repository;

  GetProductsUseCase({required ProductRepository repository}) : _repository = repository;

  @override
  Future<Either<Failure, List<Product>>> call(GetProductsParams params) async {
    return await _repository.getProducts(
      page: params.page,
      limit: params.limit,
      search: params.search,
      categoryId: params.categoryId,
    );
  }
}

class GetProductsParams {
  final int page;
  final int limit;
  final String? search;
  final String? categoryId;

  GetProductsParams({
    this.page = 1,
    this.limit = 10,
    this.search,
    this.categoryId,
  });
}
