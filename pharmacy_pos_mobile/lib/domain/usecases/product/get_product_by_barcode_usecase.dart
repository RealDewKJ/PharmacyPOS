import 'package:dartz/dartz.dart';
import '../../../core/errors/failures.dart';
import '../../../core/usecases/usecase.dart';
import '../../entities/product.dart';
import '../../repositories/product_repository.dart';

class GetProductByBarcodeUseCase implements UseCase<Product, String> {
  final ProductRepository _repository;

  GetProductByBarcodeUseCase({required ProductRepository repository}) : _repository = repository;

  @override
  Future<Either<Failure, Product>> call(String barcode) async {
    return await _repository.getProductByBarcode(barcode);
  }
}
