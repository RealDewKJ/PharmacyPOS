import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_theme.dart';
import '../../core/utils/theme_provider.dart';
import '../bloc/auth/auth_bloc.dart';
import '../bloc/dashboard/dashboard_bloc.dart';
import '../widgets/custom_app_bar.dart';
import '../widgets/custom_card.dart';
import '../widgets/loading_widget.dart';
import '../widgets/error_widget.dart';
import '../widgets/responsive_wrapper.dart';
import 'products_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const DashboardHome(),
    const ProductsScreen(),
    const SalesScreen(),
    const PrescriptionsScreen(),
    const SettingsScreen(),
  ];

  @override
  void initState() {
    super.initState();
    context.read<DashboardBloc>().add(GetDashboardStatsRequested());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: CustomAppBar(
      //   title: 'Pharmacy POS',
      //   actions: [
      //     Consumer<ThemeProvider>(
      //       builder: (context, themeProvider, child) {
      //         return IconButton(
      //           onPressed: themeProvider.toggleTheme,
      //           icon: Icon(
      //             themeProvider.isDarkMode ? Icons.light_mode : Icons.dark_mode,
      //           ),
      //         );
      //       },
      //     ),
      //     PopupMenuButton<String>(
      //       onSelected: (value) {
      //         if (value == 'logout') {
      //           context.read<AuthBloc>().add(LogoutRequested());
      //           context.go('/login');
      //         }
      //       },
      //       itemBuilder: (context) => [
      //         const PopupMenuItem(
      //           value: 'logout',
      //           child: Row(
      //             children: [
      //               Icon(Icons.logout),
      //               SizedBox(width: 8),
      //               Text('Logout'),
      //             ],
      //           ),
      //         ),
      //       ],
      //     ),
      //   ],
      // ),
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _selectedIndex,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.inventory),
            label: 'Products',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.point_of_sale),
            label: 'Sales',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.medication),
            label: 'Prescriptions',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}

class DashboardHome extends StatelessWidget {
  const DashboardHome({super.key});

  @override
  Widget build(BuildContext context) {
    return ResponsiveWrapper(
      child: BlocBuilder<DashboardBloc, DashboardState>(
        builder: (context, state) {
          if (state is DashboardLoading) {
            return const LoadingWidget(message: 'Loading dashboard...');
          } else if (state is DashboardFailure) {
            return ErrorDisplayWidget(
              message: state.message,
              onRetry: () {
                context.read<DashboardBloc>().add(GetDashboardStatsRequested());
              },
            );
          } else if (state is DashboardStatsSuccess) {
            return _buildDashboardContent(context, state.stats);
          }
          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildDashboardContent(BuildContext context, stats) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: EdgeInsets.all(16.w),
            child: Text(
              'Dashboard',
              style: Theme.of(context).textTheme.displayLarge,
            ),
          ),
          SizedBox(height: 8.h),
          _buildStatsGrid(context, stats),
          SizedBox(height: 24.h),
          _buildQuickActions(context),
          SizedBox(height: 24.h),
          _buildRecentActivity(context),
          SizedBox(height: 24.h),
        ],
      ),
    );
  }

  Widget _buildStatsGrid(BuildContext context, stats) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w),
      child: GridView.count(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        crossAxisCount: 2,
        childAspectRatio: 1.2,
        crossAxisSpacing: 16.w,
        mainAxisSpacing: 16.h,
        children: [
          _buildStatCard(
            context,
            'Total Products',
            stats.totalProducts.toString(),
            Icons.inventory,
            AppTheme.primaryColor,
          ),
          _buildStatCard(
            context,
            'Total Revenue',
            '\$${stats.totalRevenue.toStringAsFixed(2)}',
            Icons.attach_money,
            AppTheme.successColor,
          ),
          _buildStatCard(
            context,
            'Total Sales',
            stats.totalSales.toString(),
            Icons.shopping_cart,
            AppTheme.warningColor,
          ),
          _buildStatCard(
            context,
            'Low Stock',
            stats.lowStockProducts.toString(),
            Icons.warning,
            AppTheme.errorColor,
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(
    BuildContext context,
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return CustomCard(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: EdgeInsets.all(16.w),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: EdgeInsets.all(12.w),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12.r),
              ),
              child: Icon(
                icon,
                size: 24.w,
                color: color,
              ),
            ),
            SizedBox(height: 12.h),
            Text(
              value,
              style: Theme.of(context).textTheme.displaySmall?.copyWith(
                    color: color,
                    fontWeight: FontWeight.bold,
                  ),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            SizedBox(height: 4.h),
            Text(
              title,
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w),
      child: CustomCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Quick Actions',
              style: Theme.of(context).textTheme.displaySmall,
            ),
            SizedBox(height: 16.h),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      // Navigate to POS
                    },
                    icon: const Icon(Icons.point_of_sale),
                    label: const Text('New Sale'),
                  ),
                ),
                SizedBox(width: 16.w),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      // Navigate to add product
                    },
                    icon: const Icon(Icons.add),
                    label: const Text('Add Product'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentActivity(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w),
      child: CustomCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Recent Activity',
              style: Theme.of(context).textTheme.displaySmall,
            ),
            SizedBox(height: 16.h),
            // Add recent activity items here
            Text(
              'No recent activity',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppTheme.neutralLight,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}

class SalesScreen extends StatelessWidget {
  const SalesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('Sales Screen - Coming Soon'),
    );
  }
}

class PrescriptionsScreen extends StatelessWidget {
  const PrescriptionsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('Prescriptions Screen - Coming Soon'),
    );
  }
}

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('Settings Screen - Coming Soon'),
    );
  }
}
