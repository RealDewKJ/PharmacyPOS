import 'package:equatable/equatable.dart';

class Product extends Equatable {
  final String id;
  final String name;
  final String? description;
  final String? barcode;
  final String? sku;
  final double price;
  final double costPrice;
  final int stockQuantity;
  final int minStockLevel;
  final DateTime? expiryDate;
  final bool requiresPrescription;
  final Category? category;
  final Supplier? supplier;

  const Product({
    required this.id,
    required this.name,
    this.description,
    this.barcode,
    this.sku,
    required this.price,
    required this.costPrice,
    required this.stockQuantity,
    required this.minStockLevel,
    this.expiryDate,
    required this.requiresPrescription,
    this.category,
    this.supplier,
  });

  @override
  List<Object?> get props => [
        id,
        name,
        description,
        barcode,
        sku,
        price,
        costPrice,
        stockQuantity,
        minStockLevel,
        expiryDate,
        requiresPrescription,
        category,
        supplier,
      ];
}

class Category extends Equatable {
  final String id;
  final String name;
  final String? description;

  const Category({
    required this.id,
    required this.name,
    this.description,
  });

  @override
  List<Object?> get props => [id, name, description];
}

class Supplier extends Equatable {
  final String id;
  final String name;
  final String? email;
  final String? phone;
  final String? address;

  const Supplier({
    required this.id,
    required this.name,
    this.email,
    this.phone,
    this.address,
  });

  @override
  List<Object?> get props => [id, name, email, phone, address];
}
