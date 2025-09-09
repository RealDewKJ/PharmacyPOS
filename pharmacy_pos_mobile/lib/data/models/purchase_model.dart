import '../../domain/entities/purchase.dart';

class PurchaseModel extends Purchase {
  const PurchaseModel({
    required super.id,
    required super.supplierId,
    required super.status,
    required super.total,
    required super.createdAt,
    required super.supplier,
    required super.items,
  });

  factory PurchaseModel.fromJson(Map<String, dynamic> json) => PurchaseModel(
        id: json['id'] as String,
        supplierId: json['supplierId'] as String,
        status: json['status'] as String,
        total: (json['total'] as num).toDouble(),
        createdAt: DateTime.parse(json['createdAt'] as String),
        supplier: Supplier(
          id: json['supplier']['id'] as String,
          name: json['supplier']['name'] as String,
        ),
        items: (json['items'] as List<dynamic>)
            .map((item) => PurchaseItem(
                  id: item['id'] as String,
                  productId: item['productId'] as String,
                  quantity: item['quantity'] as int,
                  price: (item['price'] as num).toDouble(),
                  total: (item['total'] as num).toDouble(),
                  product: Product(
                    id: item['product']['id'] as String,
                    name: item['product']['name'] as String,
                  ),
                ))
            .toList(),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'supplierId': supplierId,
        'status': status,
        'total': total,
        'createdAt': createdAt.toIso8601String(),
        'supplier': {
          'id': supplier.id,
          'name': supplier.name,
        },
        'items': items
            .map((item) => {
                  'id': item.id,
                  'productId': item.productId,
                  'quantity': item.quantity,
                  'price': item.price,
                  'total': item.total,
                  'product': {
                    'id': item.product.id,
                    'name': item.product.name,
                  },
                })
            .toList(),
      };

  factory PurchaseModel.fromEntity(Purchase purchase) => PurchaseModel(
        id: purchase.id,
        supplierId: purchase.supplierId,
        status: purchase.status,
        total: purchase.total,
        createdAt: purchase.createdAt,
        supplier: purchase.supplier,
        items: purchase.items,
      );

  Purchase toEntity() => Purchase(
        id: id,
        supplierId: supplierId,
        status: status,
        total: total,
        createdAt: createdAt,
        supplier: supplier,
        items: items,
      );
}

class PurchaseItemModel extends PurchaseItem {
  const PurchaseItemModel({
    required super.id,
    required super.productId,
    required super.quantity,
    required super.price,
    required super.total,
    required super.product,
  });

  factory PurchaseItemModel.fromJson(Map<String, dynamic> json) => PurchaseItemModel(
        id: json['id'] as String,
        productId: json['productId'] as String,
        quantity: json['quantity'] as int,
        price: (json['price'] as num).toDouble(),
        total: (json['total'] as num).toDouble(),
        product: Product(
          id: json['product']['id'] as String,
          name: json['product']['name'] as String,
        ),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'productId': productId,
        'quantity': quantity,
        'price': price,
        'total': total,
        'product': {
          'id': product.id,
          'name': product.name,
        },
      };

  factory PurchaseItemModel.fromEntity(PurchaseItem item) => PurchaseItemModel(
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        product: item.product,
      );

  PurchaseItem toEntity() => PurchaseItem(
        id: id,
        productId: productId,
        quantity: quantity,
        price: price,
        total: total,
        product: product,
      );
}

class SupplierModel extends Supplier {
  const SupplierModel({
    required super.id,
    required super.name,
  });

  factory SupplierModel.fromJson(Map<String, dynamic> json) => SupplierModel(
        id: json['id'] as String,
        name: json['name'] as String,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
      };

  factory SupplierModel.fromEntity(Supplier supplier) => SupplierModel(
        id: supplier.id,
        name: supplier.name,
      );

  Supplier toEntity() => Supplier(
        id: id,
        name: name,
      );
}

class ProductModel extends Product {
  const ProductModel({
    required super.id,
    required super.name,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) => ProductModel(
        id: json['id'] as String,
        name: json['name'] as String,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
      };

  factory ProductModel.fromEntity(Product product) => ProductModel(
        id: product.id,
        name: product.name,
      );

  Product toEntity() => Product(
        id: id,
        name: name,
      );
}
