import 'package:equatable/equatable.dart';

class DashboardStats extends Equatable {
  final int totalProducts;
  final double totalRevenue;
  final int totalSales;
  final int lowStockProducts;
  final int totalCustomers;
  final int totalSuppliers;

  const DashboardStats({
    required this.totalProducts,
    required this.totalRevenue,
    required this.totalSales,
    required this.lowStockProducts,
    required this.totalCustomers,
    required this.totalSuppliers,
  });

  @override
  List<Object?> get props => [
        totalProducts,
        totalRevenue,
        totalSales,
        lowStockProducts,
        totalCustomers,
        totalSuppliers,
      ];
}

class TopProduct extends Equatable {
  final Product product;
  final int totalQuantity;
  final double totalRevenue;

  const TopProduct({
    required this.product,
    required this.totalQuantity,
    required this.totalRevenue,
  });

  @override
  List<Object?> get props => [product, totalQuantity, totalRevenue];
}

class Product extends Equatable {
  final String id;
  final String name;
  final String? sku;
  final double price;

  const Product({
    required this.id,
    required this.name,
    this.sku,
    required this.price,
  });

  @override
  List<Object?> get props => [id, name, sku, price];
}
