import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../domain/entities/product.dart';
import '../../../domain/usecases/product/get_products_usecase.dart';
import '../../../domain/usecases/product/get_product_by_barcode_usecase.dart';
import '../../../core/errors/failures.dart';

part 'product_event.dart';
part 'product_state.dart';

class ProductBloc extends Bloc<ProductEvent, ProductState> {
  final GetProductsUseCase _getProductsUseCase;
  final GetProductByBarcodeUseCase _getProductByBarcodeUseCase;

  ProductBloc({
    required GetProductsUseCase getProductsUseCase,
    required GetProductByBarcodeUseCase getProductByBarcodeUseCase,
  })  : _getProductsUseCase = getProductsUseCase,
        _getProductByBarcodeUseCase = getProductByBarcodeUseCase,
        super(ProductInitial()) {
    on<GetProductsRequested>(_onGetProductsRequested);
    on<GetProductByBarcodeRequested>(_onGetProductByBarcodeRequested);
  }

  Future<void> _onGetProductsRequested(
    GetProductsRequested event,
    Emitter<ProductState> emit,
  ) async {
    emit(ProductLoading());
    
    final result = await _getProductsUseCase(GetProductsParams(
      page: event.page,
      limit: event.limit,
      search: event.search,
      categoryId: event.categoryId,
    ));

    result.fold(
      (failure) => emit(ProductFailure(_mapFailureToMessage(failure))),
      (products) => emit(ProductSuccess(products: products)),
    );
  }

  Future<void> _onGetProductByBarcodeRequested(
    GetProductByBarcodeRequested event,
    Emitter<ProductState> emit,
  ) async {
    emit(ProductLoading());
    
    final result = await _getProductByBarcodeUseCase(event.barcode);

    result.fold(
      (failure) => emit(ProductFailure(_mapFailureToMessage(failure))),
      (product) => emit(ProductSuccess(products: [product])),
    );
  }

  String _mapFailureToMessage(Failure failure) {
    switch (failure.runtimeType) {
      case ServerFailure:
        return 'Server error: ${failure.message}';
      case NetworkFailure:
        return 'Network error: ${failure.message}';
      case ValidationFailure:
        return 'Validation error: ${failure.message}';
      default:
        return 'Unexpected error: ${failure.message}';
    }
  }
}
