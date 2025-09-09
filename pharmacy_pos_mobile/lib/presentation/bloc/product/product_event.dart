part of 'product_bloc.dart';

abstract class ProductEvent extends Equatable {
  const ProductEvent();

  @override
  List<Object?> get props => [];
}

class GetProductsRequested extends ProductEvent {
  final int page;
  final int limit;
  final String? search;
  final String? categoryId;

  const GetProductsRequested({
    this.page = 1,
    this.limit = 10,
    this.search,
    this.categoryId,
  });

  @override
  List<Object?> get props => [page, limit, search, categoryId];
}

class GetProductByBarcodeRequested extends ProductEvent {
  final String barcode;

  const GetProductByBarcodeRequested({required this.barcode});

  @override
  List<Object?> get props => [barcode];
}
