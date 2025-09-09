import 'package:get_it/get_it.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

// Data sources
import '../../data/datasources/auth_remote_datasource.dart';
import '../../data/datasources/product_remote_datasource.dart';
import '../../data/datasources/sale_remote_datasource.dart';
import '../../data/datasources/dashboard_remote_datasource.dart';

// Repositories
import '../../data/repositories/auth_repository_impl.dart';
import '../../data/repositories/product_repository_impl.dart';
import '../../data/repositories/sale_repository_impl.dart';
import '../../data/repositories/dashboard_repository_impl.dart';

// Domain repositories
import '../../domain/repositories/auth_repository.dart';
import '../../domain/repositories/product_repository.dart';
import '../../domain/repositories/sale_repository.dart';
import '../../domain/repositories/dashboard_repository.dart';

// Use cases
import '../../domain/usecases/auth/login_usecase.dart';
import '../../domain/usecases/auth/register_usecase.dart';
import '../../domain/usecases/auth/get_current_user_usecase.dart';
import '../../domain/usecases/auth/logout_usecase.dart';
import '../../domain/usecases/product/get_products_usecase.dart';
import '../../domain/usecases/product/get_product_by_barcode_usecase.dart';
import '../../domain/usecases/dashboard/get_dashboard_stats_usecase.dart';
import '../../domain/usecases/dashboard/get_recent_sales_usecase.dart';

// BLoCs
import '../../presentation/bloc/auth/auth_bloc.dart';
import '../../presentation/bloc/product/product_bloc.dart';
import '../../presentation/bloc/dashboard/dashboard_bloc.dart';

// Core
import '../network/api_client.dart';
import '../utils/theme_provider.dart';

final sl = GetIt.instance;

Future<void> init() async {
  // External
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton(() => sharedPreferences);
  sl.registerLazySingleton(() => const FlutterSecureStorage());
  sl.registerLazySingleton(() => Dio());
  sl.registerLazySingleton(() => ApiClient());

  // Data sources
  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(apiClient: sl()),
  );
  sl.registerLazySingleton<ProductRemoteDataSource>(
    () => ProductRemoteDataSourceImpl(apiClient: sl()),
  );
  sl.registerLazySingleton<SaleRemoteDataSource>(
    () => SaleRemoteDataSourceImpl(apiClient: sl()),
  );
  sl.registerLazySingleton<DashboardRemoteDataSource>(
    () => DashboardRemoteDataSourceImpl(apiClient: sl()),
  );

  // Repositories
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(remoteDataSource: sl()),
  );
  sl.registerLazySingleton<ProductRepository>(
    () => ProductRepositoryImpl(remoteDataSource: sl()),
  );
  sl.registerLazySingleton<SaleRepository>(
    () => SaleRepositoryImpl(remoteDataSource: sl()),
  );
  sl.registerLazySingleton<DashboardRepository>(
    () => DashboardRepositoryImpl(remoteDataSource: sl()),
  );

  // Use cases
  sl.registerLazySingleton(() => LoginUseCase(repository: sl()));
  sl.registerLazySingleton(() => RegisterUseCase(repository: sl()));
  sl.registerLazySingleton(() => GetCurrentUserUseCase(repository: sl()));
  sl.registerLazySingleton(() => LogoutUseCase(repository: sl()));
  sl.registerLazySingleton(() => GetProductsUseCase(repository: sl()));
  sl.registerLazySingleton(() => GetProductByBarcodeUseCase(repository: sl()));
  sl.registerLazySingleton(() => GetDashboardStatsUseCase(repository: sl()));
  sl.registerLazySingleton(() => GetRecentSalesUseCase(repository: sl()));

  // BLoCs
  sl.registerFactory(
    () => AuthBloc(
      loginUseCase: sl(),
      registerUseCase: sl(),
      getCurrentUserUseCase: sl(),
      logoutUseCase: sl(),
    ),
  );
  sl.registerFactory(
    () => ProductBloc(
      getProductsUseCase: sl(),
      getProductByBarcodeUseCase: sl(),
    ),
  );
  sl.registerFactory(
    () => DashboardBloc(
      getDashboardStatsUseCase: sl(),
      getRecentSalesUseCase: sl(),
    ),
  );

  // Providers
  sl.registerLazySingleton(() => ThemeProvider());
}
