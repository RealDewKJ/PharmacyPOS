import '../../domain/entities/prescription.dart';

class PrescriptionModel extends Prescription {
  const PrescriptionModel({
    required super.id,
    required super.customerId,
    required super.prescribedBy,
    super.notes,
    required super.status,
    super.expiryDate,
    required super.createdAt,
    required super.updatedAt,
    required super.customer,
    required super.items,
  });

  factory PrescriptionModel.fromJson(Map<String, dynamic> json) => PrescriptionModel(
        id: json['id'] as String,
        customerId: json['customerId'] as String,
        prescribedBy: json['prescribedBy'] as String,
        notes: json['notes'] as String?,
        status: json['status'] as String,
        expiryDate: json['expiryDate'] != null ? DateTime.parse(json['expiryDate'] as String) : null,
        createdAt: DateTime.parse(json['createdAt'] as String),
        updatedAt: DateTime.parse(json['updatedAt'] as String),
        customer: Customer(
          id: json['customer']['id'] as String,
          name: json['customer']['name'] as String,
          email: json['customer']['email'] as String?,
          phone: json['customer']['phone'] as String?,
        ),
        items: (json['items'] as List<dynamic>)
            .map((item) => PrescriptionItem(
                  id: item['id'] as String,
                  productId: item['productId'] as String,
                  quantity: item['quantity'] as int,
                  dosage: item['dosage'] as String,
                  frequency: item['frequency'] as String,
                  duration: item['duration'] as String,
                  product: Product(
                    id: item['product']['id'] as String,
                    name: item['product']['name'] as String,
                    sku: item['product']['sku'] as String?,
                    barcode: item['product']['barcode'] as String?,
                  ),
                ))
            .toList(),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'customerId': customerId,
        'prescribedBy': prescribedBy,
        'notes': notes,
        'status': status,
        'expiryDate': expiryDate?.toIso8601String(),
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
        'customer': {
          'id': customer.id,
          'name': customer.name,
          'email': customer.email,
          'phone': customer.phone,
        },
        'items': items
            .map((item) => {
                  'id': item.id,
                  'productId': item.productId,
                  'quantity': item.quantity,
                  'dosage': item.dosage,
                  'frequency': item.frequency,
                  'duration': item.duration,
                  'product': {
                    'id': item.product.id,
                    'name': item.product.name,
                    'sku': item.product.sku,
                    'barcode': item.product.barcode,
                  },
                })
            .toList(),
      };

  factory PrescriptionModel.fromEntity(Prescription prescription) => PrescriptionModel(
        id: prescription.id,
        customerId: prescription.customerId,
        prescribedBy: prescription.prescribedBy,
        notes: prescription.notes,
        status: prescription.status,
        expiryDate: prescription.expiryDate,
        createdAt: prescription.createdAt,
        updatedAt: prescription.updatedAt,
        customer: prescription.customer,
        items: prescription.items,
      );

  Prescription toEntity() => Prescription(
        id: id,
        customerId: customerId,
        prescribedBy: prescribedBy,
        notes: notes,
        status: status,
        expiryDate: expiryDate,
        createdAt: createdAt,
        updatedAt: updatedAt,
        customer: customer,
        items: items,
      );
}

class PrescriptionItemModel extends PrescriptionItem {
  const PrescriptionItemModel({
    required super.id,
    required super.productId,
    required super.quantity,
    required super.dosage,
    required super.frequency,
    required super.duration,
    required super.product,
  });

  factory PrescriptionItemModel.fromJson(Map<String, dynamic> json) => PrescriptionItemModel(
        id: json['id'] as String,
        productId: json['productId'] as String,
        quantity: json['quantity'] as int,
        dosage: json['dosage'] as String,
        frequency: json['frequency'] as String,
        duration: json['duration'] as String,
        product: Product(
          id: json['product']['id'] as String,
          name: json['product']['name'] as String,
          sku: json['product']['sku'] as String?,
          barcode: json['product']['barcode'] as String?,
        ),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'productId': productId,
        'quantity': quantity,
        'dosage': dosage,
        'frequency': frequency,
        'duration': duration,
        'product': {
          'id': product.id,
          'name': product.name,
          'sku': product.sku,
          'barcode': product.barcode,
        },
      };

  factory PrescriptionItemModel.fromEntity(PrescriptionItem item) => PrescriptionItemModel(
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        product: item.product,
      );

  PrescriptionItem toEntity() => PrescriptionItem(
        id: id,
        productId: productId,
        quantity: quantity,
        dosage: dosage,
        frequency: frequency,
        duration: duration,
        product: product,
      );
}

class CustomerModel extends Customer {
  const CustomerModel({
    required super.id,
    required super.name,
    super.email,
    super.phone,
  });

  factory CustomerModel.fromJson(Map<String, dynamic> json) => CustomerModel(
        id: json['id'] as String,
        name: json['name'] as String,
        email: json['email'] as String?,
        phone: json['phone'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'phone': phone,
      };

  factory CustomerModel.fromEntity(Customer customer) => CustomerModel(
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      );

  Customer toEntity() => Customer(
        id: id,
        name: name,
        email: email,
        phone: phone,
      );
}

class ProductModel extends Product {
  const ProductModel({
    required super.id,
    required super.name,
    super.sku,
    super.barcode,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) => ProductModel(
        id: json['id'] as String,
        name: json['name'] as String,
        sku: json['sku'] as String?,
        barcode: json['barcode'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'sku': sku,
        'barcode': barcode,
      };

  factory ProductModel.fromEntity(Product product) => ProductModel(
        id: product.id,
        name: product.name,
        sku: product.sku,
        barcode: product.barcode,
      );

  Product toEntity() => Product(
        id: id,
        name: name,
        sku: sku,
        barcode: barcode,
      );
}
