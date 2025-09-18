import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_theme.dart';
import '../widgets/pharmacy_header.dart';
import '../widgets/modern_header.dart';
import '../widgets/responsive_wrapper.dart';

class HeaderDemoScreen extends StatefulWidget {
  const HeaderDemoScreen({super.key});

  @override
  State<HeaderDemoScreen> createState() => _HeaderDemoScreenState();
}

class _HeaderDemoScreenState extends State<HeaderDemoScreen> {
  int _notificationCount = 3;
  int _cartItemCount = 7;
  String _currentHeader = 'Home';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundSecondary,
      appBar: _buildCurrentHeader(),
      body: ResponsiveWrapper(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(16.w),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeaderSelector(),
              SizedBox(height: 24.h),
              _buildDemoContent(),
            ],
          ),
        ),
      ),
    );
  }

  PreferredSizeWidget _buildCurrentHeader() {
    switch (_currentHeader) {
      case 'Home':
        return PharmacyHeader.home(
          onSearchTap: () => _showSnackBar('Search tapped'),
          onCartTap: () => _showSnackBar('Cart tapped'),
          cartItemCount: _cartItemCount,
          onNotificationTap: () => _showSnackBar('Notifications tapped'),
          notificationCount: _notificationCount,
          rightActions: [
            PharmacyHeaderAction.custom(
              widget: Icon(
                Icons.more_vert,
                color: AppTheme.neutralDark,
                size: 24.w,
              ),
              onTap: () => _showSnackBar('More options tapped'),
            ),
          ],
        );
      case 'Search':
        return PharmacyHeader.search(
          title: 'Search Products',
          onBackPressed: () => context.pop(),
          onFilterTap: () => _showSnackBar('Filter tapped'),
        );
      case 'Detail':
        return PharmacyHeader.detail(
          title: 'Product Details',
          onBackPressed: () => context.pop(),
          onEditTap: () => _showSnackBar('Edit tapped'),
          onDeleteTap: () => _showSnackBar('Delete tapped'),
        );
      case 'Products':
        return PharmacyHeader.products(
          onBackPressed: () => context.pop(),
          onSearchTap: () => _showSnackBar('Search tapped'),
          onFilterTap: () => _showSnackBar('Filter tapped'),
          onAddProductTap: () => _showSnackBar('Add product tapped'),
        );
      case 'Profile':
        return ModernHeader.profile(
          title: 'Profile',
          onBackPressed: () => context.pop(),
          rightActions: [
            HeaderAction.icon(
              icon: Icons.settings,
              onTap: () => _showSnackBar('Settings tapped'),
            ),
          ],
        );
      case 'Custom':
        return ModernHeader(
          title: 'Custom Header',
          showBackButton: true,
          onBackPressed: () => context.pop(),
          rightActions: [
            HeaderAction.text(
              text: 'Skip',
              onTap: () => _showSnackBar('Skip tapped'),
            ),
            HeaderAction.text(
              text: 'Done',
              onTap: () => _showSnackBar('Done tapped'),
            ),
          ],
        );
      default:
        return PharmacyHeader.home(
          onSearchTap: () => _showSnackBar('Search tapped'),
          onCartTap: () => _showSnackBar('Cart tapped'),
          cartItemCount: _cartItemCount,
          onNotificationTap: () => _showSnackBar('Notifications tapped'),
          notificationCount: _notificationCount,
        );
    }
  }

  Widget _buildHeaderSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Header Types',
          style: Theme.of(context).textTheme.displaySmall,
        ),
        SizedBox(height: 12.h),
        Wrap(
          spacing: 8.w,
          runSpacing: 8.h,
          children: [
            'Home',
            'Search',
            'Detail',
            'Products',
            'Profile',
            'Custom',
          ].map((headerType) {
            final isSelected = _currentHeader == headerType;
            return FilterChip(
              label: Text(headerType),
              selected: isSelected,
              onSelected: (selected) {
                if (selected) {
                  setState(() {
                    _currentHeader = headerType;
                  });
                }
              },
              selectedColor: AppTheme.primarySurface,
              checkmarkColor: AppTheme.primaryColor,
              labelStyle: TextStyle(
                color:
                    isSelected ? AppTheme.primaryColor : AppTheme.neutralMedium,
                fontWeight: isSelected ? FontWeight.w500 : FontWeight.w400,
              ),
              side: BorderSide(
                color: isSelected
                    ? AppTheme.primaryColor
                    : AppTheme.neutralLighter,
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildDemoContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Interactive Controls',
          style: Theme.of(context).textTheme.displaySmall,
        ),
        SizedBox(height: 16.h),
        _buildControlCard(
          'Notification Count',
          _notificationCount.toString(),
          () {
            setState(() {
              _notificationCount = (_notificationCount + 1) % 10;
            });
          },
          Icons.notifications,
        ),
        SizedBox(height: 12.h),
        _buildControlCard(
          'Cart Item Count',
          _cartItemCount.toString(),
          () {
            setState(() {
              _cartItemCount = (_cartItemCount + 1) % 20;
            });
          },
          Icons.shopping_cart,
        ),
        SizedBox(height: 24.h),
        Text(
          'Header Features',
          style: Theme.of(context).textTheme.displaySmall,
        ),
        SizedBox(height: 16.h),
        _buildFeatureList(),
      ],
    );
  }

  Widget _buildControlCard(
      String title, String value, VoidCallback onTap, IconData icon) {
    return Container(
      margin: EdgeInsets.only(bottom: 12.h),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.backgroundPrimary,
            AppTheme.backgroundSecondary,
          ],
        ),
        borderRadius: BorderRadius.circular(16.r),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
          BoxShadow(
            color: AppTheme.primaryColor.withOpacity(0.1),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
        border: Border.all(
          color: AppTheme.neutralLighter.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16.r),
          child: Padding(
            padding: EdgeInsets.all(16.w),
            child: Row(
              children: [
                Container(
                  width: 48.w,
                  height: 48.h,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        AppTheme.primaryColor,
                        AppTheme.primaryLight,
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12.r),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.primaryColor.withOpacity(0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Icon(
                    icon,
                    color: Colors.white,
                    size: 24.w,
                  ),
                ),
                SizedBox(width: 16.w),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style:
                            Theme.of(context).textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.w600,
                                  color: AppTheme.neutralDark,
                                ),
                      ),
                      SizedBox(height: 4.h),
                      Text(
                        'Current: $value',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppTheme.neutralMedium,
                            ),
                      ),
                    ],
                  ),
                ),
                Container(
                  width: 32.w,
                  height: 32.h,
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8.r),
                  ),
                  child: Icon(
                    Icons.add,
                    color: AppTheme.primaryColor,
                    size: 20.w,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureList() {
    final features = [
      'Three-section layout (Left, Center, Right)',
      'Fixed position with status bar consideration',
      'Smooth animations and transitions',
      'Notification badges with count',
      'Accessibility support',
      'Context-specific variations',
      'Touch feedback with scale animation',
      'Consistent design system compliance',
    ];

    return Container(
      padding: EdgeInsets.all(20.w),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.primarySurface.withOpacity(0.1),
            AppTheme.backgroundPrimary,
          ],
        ),
        borderRadius: BorderRadius.circular(20.r),
        border: Border.all(
          color: AppTheme.primaryColor.withOpacity(0.2),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primaryColor.withOpacity(0.1),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: features.map((feature) {
          return Container(
            margin: EdgeInsets.only(bottom: 12.h),
            padding: EdgeInsets.all(12.w),
            decoration: BoxDecoration(
              color: AppTheme.backgroundPrimary,
              borderRadius: BorderRadius.circular(12.r),
              border: Border.all(
                color: AppTheme.neutralLighter.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 24.w,
                  height: 24.h,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        AppTheme.successColor,
                        AppTheme.successColor.withOpacity(0.8),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12.r),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.successColor.withOpacity(0.3),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Icon(
                    Icons.check,
                    color: Colors.white,
                    size: 14.w,
                  ),
                ),
                SizedBox(width: 12.w),
                Expanded(
                  child: Text(
                    feature,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.w500,
                          color: AppTheme.neutralDark,
                        ),
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppTheme.primaryColor,
        duration: const Duration(seconds: 1),
      ),
    );
  }
}
