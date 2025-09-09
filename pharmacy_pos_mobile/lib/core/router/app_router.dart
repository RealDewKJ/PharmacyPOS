import 'package:go_router/go_router.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../presentation/views/splash_screen.dart';
import '../../presentation/views/login_screen.dart';
import '../../presentation/views/dashboard_screen.dart';
import '../di/injection_container.dart';
import '../utils/theme_provider.dart';

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
        builder: (context, state) => const LoginScreen(), // TODO: Create register screen
      ),
      GoRoute(
        path: '/dashboard',
        builder: (context, state) => const DashboardScreen(),
      ),
    ],
    redirect: (context, state) {
      // Add authentication logic here if needed
      return null;
    },
  );

  static GoRouter get router => _router;
}
