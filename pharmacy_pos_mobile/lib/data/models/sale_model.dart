import '../../domain/entities/sale.dart';

class SaleModel extends Sale {
  const SaleModel({
    required super.id,
    super.customerId,
    required super.userId,
    required super.paymentMethod,
    required super.discount,
    required super.tax,
    required super.subtotal,
    required super.total,
    required super.createdAt,
    super.customer,
    required super.items,
  });

  factory SaleModel.fromJson(Map<String, dynamic> json) => SaleModel(
        id: json['id'] as String,
        customerId: json['customerId'] as String?,
        userId: json['userId'] as String,
        paymentMethod: json['paymentMethod'] as String,
        discount: (json['discount'] as num).toDouble(),
        tax: (json['tax'] as num).toDouble(),
        subtotal: (json['subtotal'] as num).toDouble(),
        total: (json['total'] as num).toDouble(),
        createdAt: DateTime.parse(json['createdAt'] as String),
        customer: json['customer'] != null
            ? Customer(
                id: json['customer']['id'] as String,
                name: json['customer']['name'] as String,
                email: json['customer']['email'] as String?,
                phone: json['customer']['phone'] as String?,
                address: json['customer']['address'] as String?,
              )
            : null,
        items: (json['items'] as List<dynamic>)
            .map((item) => SaleItem(
                  id: item['id'] as String,
                  productId: item['productId'] as String,
                  quantity: item['quantity'] as int,
                  price: (item['price'] as num).toDouble(),
                  total: (item['total'] as num).toDouble(),
                  product: item['product'] != null
                      ? Product(
                          id: item['product']['id'] as String,
                          name: item['product']['name'] as String,
                        )
                      : null,
                ))
            .toList(),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'customerId': customerId,
        'userId': userId,
        'paymentMethod': paymentMethod,
        'discount': discount,
        'tax': tax,
        'subtotal': subtotal,
        'total': total,
        'createdAt': createdAt.toIso8601String(),
        'customer': customer != null
            ? {
                'id': customer!.id,
                'name': customer!.name,
                'email': customer!.email,
                'phone': customer!.phone,
                'address': customer!.address,
              }
            : null,
        'items': items
            .map((item) => {
                  'id': item.id,
                  'productId': item.productId,
                  'quantity': item.quantity,
                  'price': item.price,
                  'total': item.total,
                  'product': item.product != null
                      ? {
                          'id': item.product!.id,
                          'name': item.product!.name,
                        }
                      : null,
                })
            .toList(),
      };

  factory SaleModel.fromEntity(Sale sale) => SaleModel(
        id: sale.id,
        customerId: sale.customerId,
        userId: sale.userId,
        paymentMethod: sale.paymentMethod,
        discount: sale.discount,
        tax: sale.tax,
        subtotal: sale.subtotal,
        total: sale.total,
        createdAt: sale.createdAt,
        customer: sale.customer,
        items: sale.items,
      );

  Sale toEntity() => Sale(
        id: id,
        customerId: customerId,
        userId: userId,
        paymentMethod: paymentMethod,
        discount: discount,
        tax: tax,
        subtotal: subtotal,
        total: total,
        createdAt: createdAt,
        customer: customer,
        items: items,
      );
}

class SaleItemModel extends SaleItem {
  const SaleItemModel({
    required super.id,
    required super.productId,
    required super.quantity,
    required super.price,
    required super.total,
    super.product,
  });

  factory SaleItemModel.fromJson(Map<String, dynamic> json) => SaleItemModel(
        id: json['id'] as String,
        productId: json['productId'] as String,
        quantity: json['quantity'] as int,
        price: (json['price'] as num).toDouble(),
        total: (json['total'] as num).toDouble(),
        product: json['product'] != null
            ? Product(
                id: json['product']['id'] as String,
                name: json['product']['name'] as String,
              )
            : null,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'productId': productId,
        'quantity': quantity,
        'price': price,
        'total': total,
        'product': product != null
            ? {
                'id': product!.id,
                'name': product!.name,
              }
            : null,
      };

  factory SaleItemModel.fromEntity(SaleItem item) => SaleItemModel(
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        product: item.product,
      );

  SaleItem toEntity() => SaleItem(
        id: id,
        productId: productId,
        quantity: quantity,
        price: price,
        total: total,
        product: product,
      );
}

class CustomerModel extends Customer {
  const CustomerModel({
    required super.id,
    required super.name,
    super.email,
    super.phone,
    super.address,
  });

  factory CustomerModel.fromJson(Map<String, dynamic> json) => CustomerModel(
        id: json['id'] as String,
        name: json['name'] as String,
        email: json['email'] as String?,
        phone: json['phone'] as String?,
        address: json['address'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'phone': phone,
        'address': address,
      };

  factory CustomerModel.fromEntity(Customer customer) => CustomerModel(
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      );

  Customer toEntity() => Customer(
        id: id,
        name: name,
        email: email,
        phone: phone,
        address: address,
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
