import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_theme.dart';
import '../../domain/entities/product.dart';
import '../widgets/custom_card.dart';
import '../widgets/responsive_wrapper.dart';
import '../widgets/pharmacy_header.dart';

class SellOrderScreen extends StatefulWidget {
  final Product product;

  const SellOrderScreen({
    super.key,
    required this.product,
  });

  @override
  State<SellOrderScreen> createState() => _SellOrderScreenState();
}

class _SellOrderScreenState extends State<SellOrderScreen> {
  final TextEditingController _quantityController = TextEditingController();
  final TextEditingController _customerNameController = TextEditingController();
  final TextEditingController _customerPhoneController =
      TextEditingController();
  final TextEditingController _discountController = TextEditingController();

  int _quantity = 1;
  double _discount = 0.0;
  bool _requiresPrescription = false;

  @override
  void initState() {
    super.initState();
    _quantityController.text = _quantity.toString();
    _requiresPrescription = widget.product.requiresPrescription;
  }

  @override
  void dispose() {
    _quantityController.dispose();
    _customerNameController.dispose();
    _customerPhoneController.dispose();
    _discountController.dispose();
    super.dispose();
  }

  void _updateQuantity(int newQuantity) {
    if (newQuantity >= 1 && newQuantity <= widget.product.stockQuantity) {
      setState(() {
        _quantity = newQuantity;
        _quantityController.text = _quantity.toString();
      });
    }
  }

  void _updateDiscount(String value) {
    final discount = double.tryParse(value) ?? 0.0;
    setState(() {
      _discount = discount;
    });
  }

  double get _subtotal => widget.product.price * _quantity;
  double get _discountAmount => _subtotal * (_discount / 100);
  double get _total => _subtotal - _discountAmount;

  void _processSale() {
    if (_quantity > widget.product.stockQuantity) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
              'Insufficient stock. Available: ${widget.product.stockQuantity}'),
          backgroundColor: AppTheme.errorColor,
        ),
      );
      return;
    }

    if (_requiresPrescription && _customerNameController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Customer name is required for prescription products'),
          backgroundColor: AppTheme.warningColor,
        ),
      );
      return;
    }

    // Process the sale
    _showSaleConfirmation();
  }

  void _showSaleConfirmation() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
          'Confirm Sale',
          style: Theme.of(context).textTheme.displaySmall,
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Are you sure you want to process this sale?',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            SizedBox(height: 16.h),
            _buildOrderSummary(context),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              _completeSale();
            },
            child: const Text('Confirm Sale'),
          ),
        ],
      ),
    );
  }

  void _completeSale() {
    // Here you would typically:
    // 1. Create a sale record
    // 2. Update product stock
    // 3. Save customer information if provided
    // 4. Generate receipt

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Sale completed successfully!'),
        backgroundColor: AppTheme.successColor,
      ),
    );

    // Navigate back to products or dashboard
    context.pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundSecondary,
      appBar: PharmacyHeader.detail(
        title: 'Sell Order',
        onBackPressed: () => context.pop(),
        rightActions: [
          PharmacyHeaderAction.cancel(onTap: () => context.pop()),
        ],
      ),
      body: ResponsiveWrapper(
        child: SingleChildScrollView(
          child: Column(
            children: [
              _buildProductInfo(context),
              _buildQuantitySelector(context),
              _buildCustomerInfo(context),
              _buildDiscountSection(context),
              _buildOrderSummary(context),
              _buildActionButtons(context),
              SizedBox(height: 24.h),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProductInfo(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(16.w),
      child: CustomCard(
        child: Row(
          children: [
            Container(
              width: 80.w,
              height: 80.w,
              decoration: BoxDecoration(
                color: AppTheme.backgroundTertiary,
                borderRadius: BorderRadius.circular(8.r),
              ),
              child: Icon(
                Icons.medication,
                size: 40.w,
                color: AppTheme.neutralLight,
              ),
            ),
            SizedBox(width: 16.w),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.product.name,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.w500,
                        ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 4.h),
                  if (widget.product.category != null)
                    Text(
                      widget.product.category!.name,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppTheme.neutralMedium,
                          ),
                    ),
                  SizedBox(height: 8.h),
                  Text(
                    '\$${widget.product.price.toStringAsFixed(2)}',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          color: AppTheme.primaryColor,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuantitySelector(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w),
      child: CustomCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Quantity',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
            ),
            SizedBox(height: 16.h),
            Row(
              children: [
                IconButton(
                  onPressed: _quantity > 1
                      ? () => _updateQuantity(_quantity - 1)
                      : null,
                  icon: Icon(
                    Icons.remove_circle_outline,
                    color: _quantity > 1
                        ? AppTheme.primaryColor
                        : AppTheme.neutralLight,
                  ),
                ),
                Expanded(
                  child: TextField(
                    controller: _quantityController,
                    textAlign: TextAlign.center,
                    keyboardType: TextInputType.number,
                    onChanged: (value) {
                      final qty = int.tryParse(value) ?? 1;
                      if (qty >= 1 && qty <= widget.product.stockQuantity) {
                        _updateQuantity(qty);
                      }
                    },
                    decoration: InputDecoration(
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8.r),
                      ),
                      contentPadding: EdgeInsets.symmetric(vertical: 12.h),
                    ),
                  ),
                ),
                IconButton(
                  onPressed: _quantity < widget.product.stockQuantity
                      ? () => _updateQuantity(_quantity + 1)
                      : null,
                  icon: Icon(
                    Icons.add_circle_outline,
                    color: _quantity < widget.product.stockQuantity
                        ? AppTheme.primaryColor
                        : AppTheme.neutralLight,
                  ),
                ),
              ],
            ),
            SizedBox(height: 8.h),
            Text(
              'Available: ${widget.product.stockQuantity} units',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppTheme.neutralMedium,
                  ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCustomerInfo(BuildContext context) {
    if (!_requiresPrescription) return const SizedBox.shrink();

    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w),
      child: CustomCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.person,
                  color: AppTheme.primaryColor,
                  size: 20.w,
                ),
                SizedBox(width: 8.w),
                Text(
                  'Customer Information (Required for Prescription)',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w500,
                      ),
                ),
              ],
            ),
            SizedBox(height: 16.h),
            TextField(
              controller: _customerNameController,
              decoration: InputDecoration(
                labelText: 'Customer Name',
                prefixIcon: Icon(Icons.person_outline),
              ),
            ),
            SizedBox(height: 12.h),
            TextField(
              controller: _customerPhoneController,
              decoration: InputDecoration(
                labelText: 'Phone Number (Optional)',
                prefixIcon: Icon(Icons.phone_outlined),
              ),
              keyboardType: TextInputType.phone,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDiscountSection(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w),
      child: CustomCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Discount',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
            ),
            SizedBox(height: 16.h),
            TextField(
              controller: _discountController,
              onChanged: _updateDiscount,
              decoration: InputDecoration(
                labelText: 'Discount Percentage',
                suffixText: '%',
                prefixIcon: Icon(Icons.percent),
              ),
              keyboardType: TextInputType.number,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderSummary(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w),
      child: CustomCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Order Summary',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
            ),
            SizedBox(height: 16.h),
            _buildSummaryRow(
                'Unit Price', '\$${widget.product.price.toStringAsFixed(2)}'),
            _buildSummaryRow('Quantity', _quantity.toString()),
            _buildSummaryRow('Subtotal', '\$${_subtotal.toStringAsFixed(2)}'),
            if (_discount > 0)
              _buildSummaryRow('Discount (${_discount.toStringAsFixed(1)}%)',
                  '-\$${_discountAmount.toStringAsFixed(2)}'),
            Divider(height: 24.h),
            _buildSummaryRow(
              'Total',
              '\$${_total.toStringAsFixed(2)}',
              isTotal: true,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isTotal = false}) {
    return Padding(
      padding: EdgeInsets.only(bottom: 8.h),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  fontWeight: isTotal ? FontWeight.w500 : FontWeight.w400,
                  color:
                      isTotal ? AppTheme.neutralDark : AppTheme.neutralMedium,
                ),
          ),
          Text(
            value,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  fontWeight: isTotal ? FontWeight.bold : FontWeight.w500,
                  color: isTotal ? AppTheme.primaryColor : AppTheme.neutralDark,
                ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(16.w),
      child: Column(
        children: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _processSale,
              icon: const Icon(Icons.check),
              label: Text('Process Sale - \$${_total.toStringAsFixed(2)}'),
              style: ElevatedButton.styleFrom(
                padding: EdgeInsets.symmetric(vertical: 16.h),
                textStyle: TextStyle(
                  fontSize: 16.sp,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
          SizedBox(height: 12.h),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () => context.pop(),
              icon: const Icon(Icons.cancel),
              label: const Text('Cancel'),
            ),
          ),
        ],
      ),
    );
  }
}
