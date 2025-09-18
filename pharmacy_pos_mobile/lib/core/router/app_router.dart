import 'package:go_router/go_router.dart';
import '../../presentation/views/splash_screen.dart';
import '../../presentation/views/login_screen.dart';
import '../../presentation/views/dashboard_screen.dart';
import '../../presentation/views/product_detail_screen.dart';
import '../../presentation/views/sell_order_screen.dart';
import '../../presentation/views/header_demo_screen.dart';

class AppRouter {
  static final GoRouter _router = GoRouter(
    initialLocation: '/splash',
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) =>
            const LoginScreen(), // TODO: Create register screen
      ),
      GoRoute(
        path: '/dashboard',
        builder: (context, state) => const DashboardScreen(),
      ),
      GoRoute(
        path: '/product-detail',
        builder: (context, state) {
          final product = state.extra as dynamic;
          return ProductDetailScreen(product: product);
        },
      ),
      GoRoute(
        path: '/sell-order',
        builder: (context, state) {
          final product = state.extra as dynamic;
          return SellOrderScreen(product: product);
        },
      ),
      GoRoute(
        path: '/header-demo',
        builder: (context, state) => const HeaderDemoScreen(),
      ),
    ],
    redirect: (context, state) {
      // Add authentication logic here if needed
      return null;
    },
  );

  static GoRouter get router => _router;
}
