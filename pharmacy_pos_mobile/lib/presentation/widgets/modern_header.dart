import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../core/constants/app_theme.dart';

enum HeaderType {
  home,
  search,
  detail,
  profile,
  custom,
}

class ModernHeader extends StatelessWidget implements PreferredSizeWidget {
  final HeaderType type;
  final String? title;
  final String? logoText;
  final Widget? leftAction;
  final List<HeaderAction> rightActions;
  final VoidCallback? onBackPressed;
  final bool showBackButton;
  final bool showLogo;
  final Color? backgroundColor;
  final Color? textColor;
  final Color? iconColor;
  final double? elevation;
  final EdgeInsets? padding;

  const ModernHeader({
    super.key,
    this.type = HeaderType.custom,
    this.title,
    this.logoText,
    this.leftAction,
    this.rightActions = const [],
    this.onBackPressed,
    this.showBackButton = false,
    this.showLogo = false,
    this.backgroundColor,
    this.textColor,
    this.iconColor,
    this.elevation,
    this.padding,
  });

  factory ModernHeader.home({
    List<HeaderAction> rightActions = const [],
    VoidCallback? onNotificationTap,
    VoidCallback? onCartTap,
    int notificationCount = 0,
    int cartItemCount = 0,
  }) {
    return ModernHeader(
      type: HeaderType.home,
      showLogo: true,
      rightActions: [
        if (onNotificationTap != null)
          HeaderAction.icon(
            icon: Icons.notifications_outlined,
            onTap: onNotificationTap,
            badgeCount: notificationCount,
          ),
        if (onCartTap != null)
          HeaderAction.icon(
            icon: Icons.shopping_cart_outlined,
            onTap: onCartTap,
            badgeCount: cartItemCount,
          ),
        ...rightActions,
      ],
    );
  }

  factory ModernHeader.search({
    required String title,
    VoidCallback? onBackPressed,
    VoidCallback? onFilterTap,
    List<HeaderAction> rightActions = const [],
  }) {
    return ModernHeader(
      type: HeaderType.search,
      title: title,
      showBackButton: true,
      onBackPressed: onBackPressed,
      rightActions: [
        if (onFilterTap != null)
          HeaderAction.icon(
            icon: Icons.filter_list_outlined,
            onTap: onFilterTap,
          ),
        ...rightActions,
      ],
    );
  }

  factory ModernHeader.detail({
    required String title,
    VoidCallback? onBackPressed,
    List<HeaderAction> rightActions = const [],
  }) {
    return ModernHeader(
      type: HeaderType.detail,
      title: title,
      showBackButton: true,
      onBackPressed: onBackPressed,
      rightActions: rightActions,
    );
  }

  factory ModernHeader.profile({
    required String title,
    VoidCallback? onBackPressed,
    List<HeaderAction> rightActions = const [],
  }) {
    return ModernHeader(
      type: HeaderType.profile,
      title: title,
      showBackButton: true,
      onBackPressed: onBackPressed,
      rightActions: rightActions,
    );
  }

  @override
  Widget build(BuildContext context) {
    final effectiveBackgroundColor =
        backgroundColor ?? AppTheme.backgroundPrimary;
    final effectiveTextColor = textColor ?? AppTheme.neutralDark;
    final effectiveIconColor = iconColor ?? AppTheme.neutralDark;
    // final effectiveElevation = elevation ?? 1.0;

    return Container(
      height: 56.h + MediaQuery.of(context).padding.top,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            effectiveBackgroundColor,
            effectiveBackgroundColor.withOpacity(0.95),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 20,
            offset: const Offset(0, 4),
            spreadRadius: 0,
          ),
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 6,
            offset: const Offset(0, 1),
            spreadRadius: 0,
          ),
        ],
        border: Border(
          bottom: BorderSide(
            color: AppTheme.neutralLighter.withOpacity(0.3),
            width: 0.5,
          ),
        ),
      ),
      child: SafeArea(
        child: Container(
          height: 56.h,
          padding: padding ?? EdgeInsets.symmetric(horizontal: 16.w),
          child: Row(
            children: [
              _buildLeftSection(context, effectiveIconColor),
              _buildCenterSection(context, effectiveTextColor),
              _buildRightSection(context, effectiveIconColor),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLeftSection(BuildContext context, Color iconColor) {
    if (leftAction != null) {
      return leftAction!;
    }

    if (showBackButton) {
      return _buildBackButton(context, iconColor);
    }

    if (showLogo) {
      return _buildLogo(context);
    }

    return SizedBox(width: 24.w);
  }

  Widget _buildCenterSection(BuildContext context, Color textColor) {
    if (showLogo) {
      return _buildLogo(context);
    }

    if (title != null) {
      return Expanded(
        child: Center(
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 8.h),
            decoration: BoxDecoration(
              color: AppTheme.neutralLighter.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12.r),
              border: Border.all(
                color: AppTheme.neutralLighter.withOpacity(0.2),
                width: 1,
              ),
            ),
            child: Text(
              title!,
              style: Theme.of(context).textTheme.displaySmall?.copyWith(
                color: textColor,
                fontWeight: FontWeight.w600,
                letterSpacing: -0.5,
                shadows: [
                  Shadow(
                    color: Colors.black.withOpacity(0.1),
                    offset: const Offset(0, 1),
                    blurRadius: 2,
                  ),
                ],
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ),
      );
    }

    return const Spacer();
  }

  Widget _buildRightSection(BuildContext context, Color iconColor) {
    if (rightActions.isEmpty) {
      return SizedBox(width: 24.w);
    }

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: rightActions
          .map((action) => Padding(
                padding: EdgeInsets.only(left: 16.w),
                child: _buildActionWidget(context, action, iconColor),
              ))
          .toList(),
    );
  }

  Widget _buildBackButton(BuildContext context, Color iconColor) {
    return _HeaderButton(
      onTap: onBackPressed ?? () => Navigator.of(context).pop(),
      child: Container(
        width: 40.w,
        height: 40.h,
        decoration: BoxDecoration(
          color: AppTheme.neutralLighter.withOpacity(0.3),
          borderRadius: BorderRadius.circular(12.r),
          border: Border.all(
            color: AppTheme.neutralLighter.withOpacity(0.5),
            width: 1,
          ),
        ),
        child: Icon(
          Icons.arrow_back_ios_new,
          color: iconColor,
          size: 20.w,
        ),
      ),
    );
  }

  Widget _buildLogo(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 6.h),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.primaryColor.withOpacity(0.1),
            AppTheme.primaryColor.withOpacity(0.05),
          ],
        ),
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(
          color: AppTheme.primaryColor.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'Sh',
            style: Theme.of(context).textTheme.displaySmall?.copyWith(
                  color: AppTheme.neutralDark,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.5,
                ),
          ),
          Container(
            margin: EdgeInsets.symmetric(horizontal: 2.w),
            padding: EdgeInsets.symmetric(horizontal: 4.w, vertical: 2.h),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppTheme.primaryColor,
                  AppTheme.primaryLight,
                ],
              ),
              borderRadius: BorderRadius.circular(6.r),
              boxShadow: [
                BoxShadow(
                  color: AppTheme.primaryColor.withOpacity(0.3),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Text(
              'ub',
              style: Theme.of(context).textTheme.displaySmall?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.5,
                  ),
            ),
          ),
          Text(
            'le',
            style: Theme.of(context).textTheme.displaySmall?.copyWith(
                  color: AppTheme.neutralDark,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.5,
                ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionWidget(
    BuildContext context,
    HeaderAction action,
    Color iconColor,
  ) {
    switch (action.type) {
      case HeaderActionType.icon:
        return _HeaderButton(
          onTap: action.onTap,
          child: Container(
            width: 40.w,
            height: 40.h,
            decoration: BoxDecoration(
              color: AppTheme.neutralLighter.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12.r),
              border: Border.all(
                color: AppTheme.neutralLighter.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                Center(
                  child: Icon(
                    action.icon,
                    color: iconColor,
                    size: 20.w,
                  ),
                ),
                if (action.badgeCount != null && action.badgeCount! > 0)
                  Positioned(
                    right: -4.w,
                    top: -4.h,
                    child: _HeaderBadge(count: action.badgeCount!),
                  ),
              ],
            ),
          ),
        );
      case HeaderActionType.text:
        return _HeaderButton(
          onTap: action.onTap,
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 8.h),
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
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Text(
              action.text!,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.5,
                  ),
            ),
          ),
        );
      case HeaderActionType.custom:
        return _HeaderButton(
          onTap: action.onTap,
          child: action.customWidget!,
        );
    }
  }

  @override
  Size get preferredSize => const Size.fromHeight(56);
}

class HeaderAction {
  final HeaderActionType type;
  final IconData? icon;
  final String? text;
  final Widget? customWidget;
  final VoidCallback? onTap;
  final int? badgeCount;

  const HeaderAction._({
    required this.type,
    this.icon,
    this.text,
    this.customWidget,
    this.onTap,
    this.badgeCount,
  });

  factory HeaderAction.icon({
    required IconData icon,
    VoidCallback? onTap,
    int? badgeCount,
  }) {
    return HeaderAction._(
      type: HeaderActionType.icon,
      icon: icon,
      onTap: onTap,
      badgeCount: badgeCount,
    );
  }

  factory HeaderAction.text({
    required String text,
    VoidCallback? onTap,
  }) {
    return HeaderAction._(
      type: HeaderActionType.text,
      text: text,
      onTap: onTap,
    );
  }

  factory HeaderAction.custom({
    required Widget widget,
    VoidCallback? onTap,
  }) {
    return HeaderAction._(
      type: HeaderActionType.custom,
      customWidget: widget,
      onTap: onTap,
    );
  }
}

enum HeaderActionType {
  icon,
  text,
  custom,
}

class _HeaderButton extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;

  const _HeaderButton({
    required this.child,
    this.onTap,
  });

  @override
  State<_HeaderButton> createState() => _HeaderButtonState();
}

class _HeaderButtonState extends State<_HeaderButton>
    with TickerProviderStateMixin {
  late AnimationController _scaleController;
  late AnimationController _rippleController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rippleAnimation;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();
    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 150),
      vsync: this,
    );
    _rippleController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );

    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.92,
    ).animate(CurvedAnimation(
      parent: _scaleController,
      curve: Curves.easeInOut,
    ));

    _rippleAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _rippleController,
      curve: Curves.easeOut,
    ));

    _opacityAnimation = Tween<double>(
      begin: 1.0,
      end: 0.0,
    ).animate(CurvedAnimation(
      parent: _rippleController,
      curve: const Interval(0.5, 1.0, curve: Curves.easeOut),
    ));
  }

  @override
  void dispose() {
    _scaleController.dispose();
    _rippleController.dispose();
    super.dispose();
  }

  void _handleTapDown() {
    if (widget.onTap != null) {
      _scaleController.forward();
      _rippleController.forward().then((_) {
        _rippleController.reset();
      });
    }
  }

  void _handleTapUp() {
    if (widget.onTap != null) {
      _scaleController.reverse();
    }
  }

  void _handleTapCancel() {
    if (widget.onTap != null) {
      _scaleController.reverse();
      _rippleController.reset();
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _handleTapDown(),
      onTapUp: (_) => _handleTapUp(),
      onTapCancel: () => _handleTapCancel(),
      onTap: widget.onTap,
      child: AnimatedBuilder(
        animation: Listenable.merge(
            [_scaleAnimation, _rippleAnimation, _opacityAnimation]),
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: Container(
              width: 44.w,
              height: 44.h,
              alignment: Alignment.center,
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  // Ripple effect
                  if (_rippleAnimation.value > 0)
                    Positioned.fill(
                      child: Container(
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppTheme.primaryColor.withOpacity(
                            (0.1 * _opacityAnimation.value),
                          ),
                        ),
                        transform: Matrix4.identity()
                          ..scale(_rippleAnimation.value * 1.5),
                      ),
                    ),
                  // Main content
                  widget.child,
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _HeaderBadge extends StatefulWidget {
  final int count;

  const _HeaderBadge({required this.count});

  @override
  State<_HeaderBadge> createState() => _HeaderBadgeState();
}

class _HeaderBadgeState extends State<_HeaderBadge>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.elasticOut,
    ));
    _animationController.forward();
  }

  @override
  void didUpdateWidget(_HeaderBadge oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.count != widget.count) {
      _animationController.reset();
      _animationController.forward();
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final displayText = widget.count > 99 ? '99+' : widget.count.toString();
    final isWide = displayText.length > 1;

    return AnimatedBuilder(
      animation: _scaleAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: Container(
            height: 20.h,
            width: isWide ? null : 20.w,
            padding: isWide ? EdgeInsets.symmetric(horizontal: 6.w) : null,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppTheme.primaryColor,
                  AppTheme.primaryLight,
                ],
              ),
              borderRadius: BorderRadius.circular(10.r),
              border: Border.all(
                color: Colors.white,
                width: 2.w,
              ),
              boxShadow: [
                BoxShadow(
                  color: AppTheme.primaryColor.withOpacity(0.4),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 4,
                  offset: const Offset(0, 1),
                ),
              ],
            ),
            child: Center(
              child: Text(
                displayText,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 11.sp,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
