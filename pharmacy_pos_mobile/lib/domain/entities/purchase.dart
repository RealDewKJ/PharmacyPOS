import 'package:equatable/equatable.dart';

class Purchase extends Equatable {
  final String id;
  final String supplierId;
  final String status;
  final double total;
  final DateTime createdAt;
  final Supplier supplier;
  final List<PurchaseItem> items;

  const Purchase({
    required this.id,
    required this.supplierId,
    required this.status,
    required this.total,
    required this.createdAt,
    required this.supplier,
    required this.items,
  });

  @override
  List<Object?> get props => [
        id,
        supplierId,
        status,
        total,
        createdAt,
        supplier,
        items,
      ];
}

class PurchaseItem extends Equatable {
  final String id;
  final String productId;
  final int quantity;
  final double price;
  final double total;
  final Product product;

  const PurchaseItem({
    required this.id,
    required this.productId,
    required this.quantity,
    required this.price,
    required this.total,
    required this.product,
  });

  @override
  List<Object?> get props => [id, productId, quantity, price, total, product];
}

class Supplier extends Equatable {
  final String id;
  final String name;

  const Supplier({
    required this.id,
    required this.name,
  });

  @override
  List<Object?> get props => [id, name];
}

class Product extends Equatable {
  final String id;
  final String name;

  const Product({
    required this.id,
    required this.name,
  });

  @override
  List<Object?> get props => [id, name];
}
