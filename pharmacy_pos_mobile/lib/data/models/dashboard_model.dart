import '../../domain/entities/dashboard.dart';

class DashboardStatsModel extends DashboardStats {
  const DashboardStatsModel({
    required super.totalProducts,
    required super.totalRevenue,
    required super.totalSales,
    required super.lowStockProducts,
    required super.totalCustomers,
    required super.totalSuppliers,
  });

  factory DashboardStatsModel.fromJson(Map<String, dynamic> json) => DashboardStatsModel(
        totalProducts: json['totalProducts'] as int,
        totalRevenue: (json['totalRevenue'] as num).toDouble(),
        totalSales: json['totalSales'] as int,
        lowStockProducts: json['lowStockProducts'] as int,
        totalCustomers: json['totalCustomers'] as int,
        totalSuppliers: json['totalSuppliers'] as int,
      );

  Map<String, dynamic> toJson() => {
        'totalProducts': totalProducts,
        'totalRevenue': totalRevenue,
        'totalSales': totalSales,
        'lowStockProducts': lowStockProducts,
        'totalCustomers': totalCustomers,
        'totalSuppliers': totalSuppliers,
      };

  factory DashboardStatsModel.fromEntity(DashboardStats stats) => DashboardStatsModel(
        totalProducts: stats.totalProducts,
        totalRevenue: stats.totalRevenue,
        totalSales: stats.totalSales,
        lowStockProducts: stats.lowStockProducts,
        totalCustomers: stats.totalCustomers,
        totalSuppliers: stats.totalSuppliers,
      );

  DashboardStats toEntity() => DashboardStats(
        totalProducts: totalProducts,
        totalRevenue: totalRevenue,
        totalSales: totalSales,
        lowStockProducts: lowStockProducts,
        totalCustomers: totalCustomers,
        totalSuppliers: totalSuppliers,
      );
}

class TopProductModel extends TopProduct {
  const TopProductModel({
    required super.product,
    required super.totalQuantity,
    required super.totalRevenue,
  });

  factory TopProductModel.fromJson(Map<String, dynamic> json) => TopProductModel(
        product: Product(
          id: json['product']['id'] as String,
          name: json['product']['name'] as String,
          sku: json['product']['sku'] as String?,
          price: (json['product']['price'] as num).toDouble(),
        ),
        totalQuantity: json['totalQuantity'] as int,
        totalRevenue: (json['totalRevenue'] as num).toDouble(),
      );

  Map<String, dynamic> toJson() => {
        'product': {
          'id': product.id,
          'name': product.name,
          'sku': product.sku,
          'price': product.price,
        },
        'totalQuantity': totalQuantity,
        'totalRevenue': totalRevenue,
      };

  factory TopProductModel.fromEntity(TopProduct topProduct) => TopProductModel(
        product: topProduct.product,
        totalQuantity: topProduct.totalQuantity,
        totalRevenue: topProduct.totalRevenue,
      );

  TopProduct toEntity() => TopProduct(
        product: product,
        totalQuantity: totalQuantity,
        totalRevenue: totalRevenue,
      );
}

class ProductModel extends Product {
  const ProductModel({
    required super.id,
    required super.name,
    super.sku,
    required super.price,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) => ProductModel(
        id: json['id'] as String,
        name: json['name'] as String,
        sku: json['sku'] as String?,
        price: (json['price'] as num).toDouble(),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'sku': sku,
        'price': price,
      };

  factory ProductModel.fromEntity(Product product) => ProductModel(
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
      );

  Product toEntity() => Product(
        id: id,
        name: name,
        sku: sku,
        price: price,
      );
}
