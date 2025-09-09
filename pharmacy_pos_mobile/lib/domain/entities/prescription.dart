import 'package:equatable/equatable.dart';

class Prescription extends Equatable {
  final String id;
  final String customerId;
  final String prescribedBy;
  final String? notes;
  final String status;
  final DateTime? expiryDate;
  final DateTime createdAt;
  final DateTime updatedAt;
  final Customer customer;
  final List<PrescriptionItem> items;

  const Prescription({
    required this.id,
    required this.customerId,
    required this.prescribedBy,
    this.notes,
    required this.status,
    this.expiryDate,
    required this.createdAt,
    required this.updatedAt,
    required this.customer,
    required this.items,
  });

  @override
  List<Object?> get props => [
        id,
        customerId,
        prescribedBy,
        notes,
        status,
        expiryDate,
        createdAt,
        updatedAt,
        customer,
        items,
      ];
}

class PrescriptionItem extends Equatable {
  final String id;
  final String productId;
  final int quantity;
  final String dosage;
  final String frequency;
  final String duration;
  final Product product;

  const PrescriptionItem({
    required this.id,
    required this.productId,
    required this.quantity,
    required this.dosage,
    required this.frequency,
    required this.duration,
    required this.product,
  });

  @override
  List<Object?> get props => [
        id,
        productId,
        quantity,
        dosage,
        frequency,
        duration,
        product,
      ];
}

class Customer extends Equatable {
  final String id;
  final String name;
  final String? email;
  final String? phone;

  const Customer({
    required this.id,
    required this.name,
    this.email,
    this.phone,
  });

  @override
  List<Object?> get props => [id, name, email, phone];
}

class Product extends Equatable {
  final String id;
  final String name;
  final String? sku;
  final String? barcode;

  const Product({
    required this.id,
    required this.name,
    this.sku,
    this.barcode,
  });

  @override
  List<Object?> get props => [id, name, sku, barcode];
}
