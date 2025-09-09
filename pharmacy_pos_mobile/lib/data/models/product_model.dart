import '../../domain/entities/product.dart';

class ProductModel extends Product {
  const ProductModel({
    required super.id,
    required super.name,
    super.description,
    super.barcode,
    super.sku,
    required super.price,
    required super.costPrice,
    required super.stockQuantity,
    required super.minStockLevel,
    super.expiryDate,
    required super.requiresPrescription,
    super.category,
    super.supplier,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) => ProductModel(
        id: json['id'] as String,
        name: json['name'] as String,
        description: json['description'] as String?,
        barcode: json['barcode'] as String?,
        sku: json['sku'] as String?,
        price: (json['price'] as num).toDouble(),
        costPrice: (json['costPrice'] as num).toDouble(),
        stockQuantity: json['stockQuantity'] as int,
        minStockLevel: json['minStockLevel'] as int,
        expiryDate: json['expiryDate'] != null ? DateTime.parse(json['expiryDate'] as String) : null,
        requiresPrescription: json['requiresPrescription'] as bool,
        category: json['category'] != null
            ? Category(
                id: json['category']['id'] as String,
                name: json['category']['name'] as String,
                description: json['category']['description'] as String?,
              )
            : null,
        supplier: json['supplier'] != null
            ? Supplier(
                id: json['supplier']['id'] as String,
                name: json['supplier']['name'] as String,
                email: json['supplier']['email'] as String?,
                phone: json['supplier']['phone'] as String?,
                address: json['supplier']['address'] as String?,
              )
            : null,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        'barcode': barcode,
        'sku': sku,
        'price': price,
        'costPrice': costPrice,
        'stockQuantity': stockQuantity,
        'minStockLevel': minStockLevel,
        'expiryDate': expiryDate?.toIso8601String(),
        'requiresPrescription': requiresPrescription,
        'category': category != null
            ? {
                'id': category!.id,
                'name': category!.name,
                'description': category!.description,
              }
            : null,
        'supplier': supplier != null
            ? {
                'id': supplier!.id,
                'name': supplier!.name,
                'email': supplier!.email,
                'phone': supplier!.phone,
                'address': supplier!.address,
              }
            : null,
      };

  factory ProductModel.fromEntity(Product product) => ProductModel(
        id: product.id,
        name: product.name,
        description: product.description,
        barcode: product.barcode,
        sku: product.sku,
        price: product.price,
        costPrice: product.costPrice,
        stockQuantity: product.stockQuantity,
        minStockLevel: product.minStockLevel,
        expiryDate: product.expiryDate,
        requiresPrescription: product.requiresPrescription,
        category: product.category,
        supplier: product.supplier,
      );

  Product toEntity() => Product(
        id: id,
        name: name,
        description: description,
        barcode: barcode,
        sku: sku,
        price: price,
        costPrice: costPrice,
        stockQuantity: stockQuantity,
        minStockLevel: minStockLevel,
        expiryDate: expiryDate,
        requiresPrescription: requiresPrescription,
        category: category,
        supplier: supplier,
      );
}

class CategoryModel extends Category {
  const CategoryModel({
    required super.id,
    required super.name,
    super.description,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) => CategoryModel(
        id: json['id'] as String,
        name: json['name'] as String,
        description: json['description'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
      };

  factory CategoryModel.fromEntity(Category category) => CategoryModel(
        id: category.id,
        name: category.name,
        description: category.description,
      );

  Category toEntity() => Category(
        id: id,
        name: name,
        description: description,
      );
}

class SupplierModel extends Supplier {
  const SupplierModel({
    required super.id,
    required super.name,
    super.email,
    super.phone,
    super.address,
  });

  factory SupplierModel.fromJson(Map<String, dynamic> json) => SupplierModel(
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

  factory SupplierModel.fromEntity(Supplier supplier) => SupplierModel(
        id: supplier.id,
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
      );

  Supplier toEntity() => Supplier(
        id: id,
        name: name,
        email: email,
        phone: phone,
        address: address,
      );
}
