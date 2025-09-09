import 'package:equatable/equatable.dart';

class Sale extends Equatable {
  final String id;
  final String? customerId;
  final String userId;
  final String paymentMethod;
  final double discount;
  final double tax;
  final double subtotal;
  final double total;
  final DateTime createdAt;
  final Customer? customer;
  final List<SaleItem> items;

  const Sale({
    required this.id,
    this.customerId,
    required this.userId,
    required this.paymentMethod,
    required this.discount,
    required this.tax,
    required this.subtotal,
    required this.total,
    required this.createdAt,
    this.customer,
    required this.items,
  });

  @override
  List<Object?> get props => [
        id,
        customerId,
        userId,
        paymentMethod,
        discount,
        tax,
        subtotal,
        total,
        createdAt,
        customer,
        items,
      ];
}

class SaleItem extends Equatable {
  final String id;
  final String productId;
  final int quantity;
  final double price;
  final double total;
  final Product? product;

  const SaleItem({
    required this.id,
    required this.productId,
    required this.quantity,
    required this.price,
    required this.total,
    this.product,
  });

  @override
  List<Object?> get props => [id, productId, quantity, price, total, product];
}

class Customer extends Equatable {
  final String id;
  final String name;
  final String? email;
  final String? phone;
  final String? address;

  const Customer({
    required this.id,
    required this.name,
    this.email,
    this.phone,
    this.address,
  });

  @override
  List<Object?> get props => [id, name, email, phone, address];
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
