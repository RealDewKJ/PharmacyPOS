class ApiConstants {
  static const String baseUrl = 'http://10.91.114.239:3001';

  // Auth endpoints
  static const String loginEndpoint = '/auth/login';
  static const String registerEndpoint = '/auth/register';
  static const String meEndpoint = '/auth/me';

  // Product endpoints
  static const String productsEndpoint = '/products';
  static const String productByBarcodeEndpoint = '/products/barcode';
  static const String lowStockProductsEndpoint = '/products/low-stock';
  static const String expiringProductsEndpoint = '/products/expiring';

  // Sale endpoints
  static const String salesEndpoint = '/sales';

  // Category endpoints
  static const String categoriesEndpoint = '/categories';

  // Customer endpoints
  static const String customersEndpoint = '/customers';

  // Supplier endpoints
  static const String suppliersEndpoint = '/suppliers';

  // Purchase endpoints
  static const String purchasesEndpoint = '/purchases';

  // Prescription endpoints
  static const String prescriptionsEndpoint = '/prescriptions';

  // Dashboard endpoints
  static const String dashboardStatsEndpoint = '/dashboard/stats';
  static const String recentSalesEndpoint = '/dashboard/recent-sales';
  static const String salesByPeriodEndpoint = '/dashboard/sales-by-period';
  static const String topProductsEndpoint = '/dashboard/top-products';

  // User endpoints
  static const String usersEndpoint = '/users';
  static const String userProfileEndpoint = '/users/profile';

  // Backup endpoints
  static const String backupCreateEndpoint = '/api/backup/create';
  static const String backupListEndpoint = '/api/backup/list';
  static const String backupRestoreEndpoint = '/api/backup/restore';

  // Headers
  static const String authorizationHeader = 'Authorization';
  static const String contentTypeHeader = 'Content-Type';
  static const String applicationJson = 'application/json';
  static const String bearerPrefix = 'Bearer ';
}
