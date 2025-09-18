import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_theme.dart';
import '../bloc/product/product_bloc.dart';
import '../widgets/custom_card.dart';
import '../widgets/loading_widget.dart';
import '../widgets/error_widget.dart';
import '../widgets/responsive_wrapper.dart';
import '../widgets/pharmacy_header.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedCategory = 'All';
  final List<String> _categories = [
    'All',
    'Prescription',
    'OTC',
    'Supplements',
    'Medical Devices'
  ];

  @override
  void initState() {
    super.initState();
    context.read<ProductBloc>().add(const GetProductsRequested());
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged(String query) {
    context.read<ProductBloc>().add(GetProductsRequested(
          search: query.isEmpty ? null : query,
          categoryId: _selectedCategory == 'All' ? null : _selectedCategory,
        ));
  }

  void _onCategoryChanged(String category) {
    setState(() {
      _selectedCategory = category;
    });
    context.read<ProductBloc>().add(GetProductsRequested(
          search:
              _searchController.text.isEmpty ? null : _searchController.text,
          categoryId: category == 'All' ? null : category,
        ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundSecondary,
      appBar: PharmacyHeader.products(
        onBackPressed: () => context.pop(),
        onSearchTap: () => _showSnackBar('Search tapped'),
        onFilterTap: () => _showSnackBar('Filter tapped'),
        onAddProductTap: () => _showSnackBar('Add product tapped'),
      ),
      body: ResponsiveWrapper(
        child: Column(
          children: [
            _buildSearchAndFilter(context),
            Expanded(
              child: _buildProductsGrid(context),
            ),
          ],
        ),
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

  Widget _buildSearchAndFilter(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16.w),
      child: Column(
        children: [
          // Search Bar
          TextField(
            controller: _searchController,
            onChanged: _onSearchChanged,
            decoration: InputDecoration(
              hintText: 'Search products...',
              prefixIcon: Icon(
                Icons.search,
                color: AppTheme.neutralLight,
              ),
              suffixIcon: _searchController.text.isNotEmpty
                  ? IconButton(
                      onPressed: () {
                        _searchController.clear();
                        _onSearchChanged('');
                      },
                      icon: Icon(
                        Icons.clear,
                        color: AppTheme.neutralLight,
                      ),
                    )
                  : null,
            ),
          ),
          SizedBox(height: 12.h),
          // Category Filter
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: _categories.map((category) {
                final isSelected = _selectedCategory == category;
                return Padding(
                  padding: EdgeInsets.only(right: 8.w),
                  child: FilterChip(
                    label: Text(category),
                    selected: isSelected,
                    onSelected: (selected) {
                      if (selected) {
                        _onCategoryChanged(category);
                      }
                    },
                    selectedColor: AppTheme.primarySurface,
                    checkmarkColor: AppTheme.primaryColor,
                    labelStyle: TextStyle(
                      color: isSelected
                          ? AppTheme.primaryColor
                          : AppTheme.neutralMedium,
                      fontWeight:
                          isSelected ? FontWeight.w500 : FontWeight.w400,
                    ),
                    side: BorderSide(
                      color: isSelected
                          ? AppTheme.primaryColor
                          : AppTheme.neutralLighter,
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductsGrid(BuildContext context) {
    return BlocBuilder<ProductBloc, ProductState>(
      builder: (context, state) {
        if (state is ProductLoading) {
          return const LoadingWidget(message: 'Loading products...');
        } else if (state is ProductFailure) {
          return ErrorDisplayWidget(
            message: state.message,
            onRetry: () {
              context.read<ProductBloc>().add(const GetProductsRequested());
            },
          );
        } else if (state is ProductSuccess) {
          if (state.products.isEmpty) {
            return _buildEmptyState(context);
          }
          return _buildProductsList(context, state.products);
        }
        return const SizedBox.shrink();
      },
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.inventory_2_outlined,
            size: 80.w,
            color: AppTheme.neutralLight,
          ),
          SizedBox(height: 16.h),
          Text(
            'No products found',
            style: Theme.of(context).textTheme.displaySmall?.copyWith(
                  color: AppTheme.neutralMedium,
                ),
          ),
          SizedBox(height: 8.h),
          Text(
            'Try adjusting your search or filters',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: AppTheme.neutralLight,
                ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductsList(BuildContext context, List<dynamic> products) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w),
      child: GridView.builder(
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.75,
          crossAxisSpacing: 16.w,
          mainAxisSpacing: 16.h,
        ),
        itemCount: products.length,
        itemBuilder: (context, index) {
          final product = products[index];
          return _buildProductCard(context, product);
        },
      ),
    );
  }

  Widget _buildProductCard(BuildContext context, dynamic product) {
    final isLowStock = product.stockQuantity <= product.minStockLevel;
    final isExpiringSoon = product.expiryDate != null &&
        product.expiryDate!
            .isBefore(DateTime.now().add(const Duration(days: 30)));

    return CustomCard(
      margin: EdgeInsets.zero,
      onTap: () {
        context.push('/product-detail', extra: product);
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Product Image Placeholder
          Expanded(
            flex: 3,
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: AppTheme.backgroundTertiary,
                borderRadius: BorderRadius.circular(8.r),
              ),
              child: Stack(
                children: [
                  Center(
                    child: Icon(
                      Icons.medication,
                      size: 40.w,
                      color: AppTheme.neutralLight,
                    ),
                  ),
                  // Badges
                  Positioned(
                    top: 8.h,
                    right: 8.w,
                    child: Column(
                      children: [
                        if (isLowStock)
                          Container(
                            padding: EdgeInsets.symmetric(
                                horizontal: 6.w, vertical: 2.h),
                            decoration: BoxDecoration(
                              color: AppTheme.errorColor,
                              borderRadius: BorderRadius.circular(4.r),
                            ),
                            child: Text(
                              'LOW STOCK',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 10.sp,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        if (isExpiringSoon)
                          Container(
                            margin: EdgeInsets.only(top: 4.h),
                            padding: EdgeInsets.symmetric(
                                horizontal: 6.w, vertical: 2.h),
                            decoration: BoxDecoration(
                              color: AppTheme.warningColor,
                              borderRadius: BorderRadius.circular(4.r),
                            ),
                            child: Text(
                              'EXPIRING',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 10.sp,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: 8.h),
          // Product Info
          Expanded(
            flex: 2,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.name,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w500,
                      ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 4.h),
                if (product.category != null)
                  Text(
                    product.category.name,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppTheme.neutralMedium,
                        ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                const Spacer(),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '\$${product.price.toStringAsFixed(2)}',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: AppTheme.primaryColor,
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    Text(
                      '${product.stockQuantity} in stock',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: isLowStock
                                ? AppTheme.errorColor
                                : AppTheme.neutralMedium,
                          ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
