import '../../domain/entities/product.dart';

class ProductMockDataSource {
  static final List<Product> _mockProducts = [
    Product(
      id: '1',
      name: 'Paracetamol 500mg',
      description: 'Pain relief and fever reducer',
      barcode: '1234567890123',
      sku: 'PAR500',
      price: 5.99,
      costPrice: 3.50,
      stockQuantity: 150,
      minStockLevel: 20,
      expiryDate: DateTime.now().add(const Duration(days: 365)),
      requiresPrescription: false,
      category: const Category(
        id: 'cat1',
        name: 'OTC',
        description: 'Over the counter medications',
      ),
      supplier: const Supplier(
        id: 'sup1',
        name: 'MedSupply Co.',
        email: 'orders@medsupply.com',
        phone: '+1-555-0123',
      ),
    ),
    Product(
      id: '2',
      name: 'Amoxicillin 250mg',
      description: 'Antibiotic for bacterial infections',
      barcode: '1234567890124',
      sku: 'AMO250',
      price: 12.99,
      costPrice: 8.00,
      stockQuantity: 5,
      minStockLevel: 15,
      expiryDate: DateTime.now().add(const Duration(days: 180)),
      requiresPrescription: true,
      category: const Category(
        id: 'cat2',
        name: 'Prescription',
        description: 'Prescription medications',
      ),
      supplier: const Supplier(
        id: 'sup2',
        name: 'PharmaCorp',
        email: 'orders@pharmacorp.com',
        phone: '+1-555-0124',
      ),
    ),
    Product(
      id: '3',
      name: 'Vitamin D3 1000IU',
      description: 'Vitamin D supplement for bone health',
      barcode: '1234567890125',
      sku: 'VITD1000',
      price: 8.99,
      costPrice: 5.50,
      stockQuantity: 80,
      minStockLevel: 25,
      expiryDate: DateTime.now().add(const Duration(days: 730)),
      requiresPrescription: false,
      category: const Category(
        id: 'cat3',
        name: 'Supplements',
        description: 'Dietary supplements',
      ),
      supplier: const Supplier(
        id: 'sup3',
        name: 'NutriHealth',
        email: 'orders@nutrihealth.com',
        phone: '+1-555-0125',
      ),
    ),
    Product(
      id: '4',
      name: 'Blood Pressure Monitor',
      description: 'Digital blood pressure monitor with large display',
      barcode: '1234567890126',
      sku: 'BPM001',
      price: 45.99,
      costPrice: 30.00,
      stockQuantity: 12,
      minStockLevel: 5,
      expiryDate: null,
      requiresPrescription: false,
      category: const Category(
        id: 'cat4',
        name: 'Medical Devices',
        description: 'Medical equipment and devices',
      ),
      supplier: const Supplier(
        id: 'sup4',
        name: 'MedTech Solutions',
        email: 'orders@medtech.com',
        phone: '+1-555-0126',
      ),
    ),
    Product(
      id: '5',
      name: 'Ibuprofen 200mg',
      description: 'Anti-inflammatory pain relief',
      barcode: '1234567890127',
      sku: 'IBU200',
      price: 4.99,
      costPrice: 2.80,
      stockQuantity: 200,
      minStockLevel: 30,
      expiryDate: DateTime.now().add(const Duration(days: 400)),
      requiresPrescription: false,
      category: const Category(
        id: 'cat1',
        name: 'OTC',
        description: 'Over the counter medications',
      ),
      supplier: const Supplier(
        id: 'sup1',
        name: 'MedSupply Co.',
        email: 'orders@medsupply.com',
        phone: '+1-555-0123',
      ),
    ),
    Product(
      id: '6',
      name: 'Insulin Pen',
      description: 'Disposable insulin pen for diabetes management',
      barcode: '1234567890128',
      sku: 'INS001',
      price: 25.99,
      costPrice: 18.00,
      stockQuantity: 3,
      minStockLevel: 10,
      expiryDate: DateTime.now().add(const Duration(days: 90)),
      requiresPrescription: true,
      category: const Category(
        id: 'cat2',
        name: 'Prescription',
        description: 'Prescription medications',
      ),
      supplier: const Supplier(
        id: 'sup2',
        name: 'PharmaCorp',
        email: 'orders@pharmacorp.com',
        phone: '+1-555-0124',
      ),
    ),
  ];

  static List<Product> getProducts({
    int page = 1,
    int limit = 10,
    String? search,
    String? categoryId,
  }) {
    List<Product> filteredProducts = List.from(_mockProducts);

    // Apply search filter
    if (search != null && search.isNotEmpty) {
      filteredProducts = filteredProducts.where((product) {
        return product.name.toLowerCase().contains(search.toLowerCase()) ||
            (product.description
                    ?.toLowerCase()
                    .contains(search.toLowerCase()) ??
                false) ||
            (product.sku?.toLowerCase().contains(search.toLowerCase()) ??
                false);
      }).toList();
    }

    // Apply category filter
    if (categoryId != null && categoryId.isNotEmpty) {
      filteredProducts = filteredProducts.where((product) {
        return product.category?.id == categoryId;
      }).toList();
    }

    // Apply pagination
    final startIndex = (page - 1) * limit;
    final endIndex = startIndex + limit;

    if (startIndex >= filteredProducts.length) {
      return [];
    }

    return filteredProducts.sublist(
      startIndex,
      endIndex > filteredProducts.length ? filteredProducts.length : endIndex,
    );
  }

  static Product? getProductByBarcode(String barcode) {
    try {
      return _mockProducts.firstWhere((product) => product.barcode == barcode);
    } catch (e) {
      return null;
    }
  }

  static List<Category> getCategories() {
    return [
      const Category(
        id: 'cat1',
        name: 'OTC',
        description: 'Over the counter medications',
      ),
      const Category(
        id: 'cat2',
        name: 'Prescription',
        description: 'Prescription medications',
      ),
      const Category(
        id: 'cat3',
        name: 'Supplements',
        description: 'Dietary supplements',
      ),
      const Category(
        id: 'cat4',
        name: 'Medical Devices',
        description: 'Medical equipment and devices',
      ),
    ];
  }
}
