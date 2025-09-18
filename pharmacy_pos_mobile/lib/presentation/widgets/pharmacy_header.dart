import 'package:flutter/material.dart';
import 'modern_header.dart';

class PharmacyHeader extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final bool showBackButton;
  final VoidCallback? onBackPressed;
  final List<PharmacyHeaderAction> rightActions;
  final bool showSearch;
  final VoidCallback? onSearchTap;
  final bool showCart;
  final VoidCallback? onCartTap;
  final int cartItemCount;
  final bool showNotifications;
  final VoidCallback? onNotificationTap;
  final int notificationCount;
  final Color? backgroundColor;
  final Color? textColor;
  final Color? iconColor;

  const PharmacyHeader({
    super.key,
    required this.title,
    this.showBackButton = false,
    this.onBackPressed,
    this.rightActions = const [],
    this.showSearch = false,
    this.onSearchTap,
    this.showCart = false,
    this.onCartTap,
    this.cartItemCount = 0,
    this.showNotifications = false,
    this.onNotificationTap,
    this.notificationCount = 0,
    this.backgroundColor,
    this.textColor,
    this.iconColor,
  });

  factory PharmacyHeader.home({
    VoidCallback? onSearchTap,
    VoidCallback? onCartTap,
    int cartItemCount = 0,
    VoidCallback? onNotificationTap,
    int notificationCount = 0,
    List<PharmacyHeaderAction> rightActions = const [],
  }) {
    return PharmacyHeader(
      title: 'Pharmacy POS',
      showSearch: true,
      onSearchTap: onSearchTap,
      showCart: true,
      onCartTap: onCartTap,
      cartItemCount: cartItemCount,
      showNotifications: true,
      onNotificationTap: onNotificationTap,
      notificationCount: notificationCount,
      rightActions: rightActions,
    );
  }

  factory PharmacyHeader.search({
    required String title,
    VoidCallback? onBackPressed,
    VoidCallback? onFilterTap,
    List<PharmacyHeaderAction> rightActions = const [],
  }) {
    return PharmacyHeader(
      title: title,
      showBackButton: true,
      onBackPressed: onBackPressed,
      rightActions: [
        if (onFilterTap != null)
          PharmacyHeaderAction.filter(onTap: onFilterTap),
        ...rightActions,
      ],
    );
  }

  factory PharmacyHeader.detail({
    required String title,
    VoidCallback? onBackPressed,
    VoidCallback? onEditTap,
    VoidCallback? onDeleteTap,
    List<PharmacyHeaderAction> rightActions = const [],
  }) {
    return PharmacyHeader(
      title: title,
      showBackButton: true,
      onBackPressed: onBackPressed,
      rightActions: [
        if (onEditTap != null) PharmacyHeaderAction.edit(onTap: onEditTap),
        if (onDeleteTap != null)
          PharmacyHeaderAction.delete(onTap: onDeleteTap),
        ...rightActions,
      ],
    );
  }

  factory PharmacyHeader.products({
    VoidCallback? onBackPressed,
    VoidCallback? onAddProductTap,
    VoidCallback? onFilterTap,
    VoidCallback? onSearchTap,
    List<PharmacyHeaderAction> rightActions = const [],
  }) {
    return PharmacyHeader(
      title: 'Products',
      showBackButton: true,
      onBackPressed: onBackPressed,
      rightActions: [
        if (onSearchTap != null)
          PharmacyHeaderAction.search(onTap: onSearchTap),
        if (onFilterTap != null)
          PharmacyHeaderAction.filter(onTap: onFilterTap),
        if (onAddProductTap != null)
          PharmacyHeaderAction.add(onTap: onAddProductTap),
        ...rightActions,
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final List<HeaderAction> modernHeaderActions = [];

    // Add search action
    if (showSearch && onSearchTap != null) {
      modernHeaderActions.add(
        HeaderAction.icon(
          icon: Icons.search,
          onTap: onSearchTap,
        ),
      );
    }

    // Add cart action
    if (showCart && onCartTap != null) {
      modernHeaderActions.add(
        HeaderAction.icon(
          icon: Icons.shopping_cart_outlined,
          onTap: onCartTap,
          badgeCount: cartItemCount > 0 ? cartItemCount : null,
        ),
      );
    }

    // Add notifications action
    if (showNotifications && onNotificationTap != null) {
      modernHeaderActions.add(
        HeaderAction.icon(
          icon: Icons.notifications_outlined,
          onTap: onNotificationTap,
          badgeCount: notificationCount > 0 ? notificationCount : null,
        ),
      );
    }

    // Add custom right actions
    for (final action in rightActions) {
      modernHeaderActions.add(_convertPharmacyAction(action));
    }

    return ModernHeader(
      title: title,
      showBackButton: showBackButton,
      onBackPressed: onBackPressed,
      rightActions: modernHeaderActions,
      backgroundColor: backgroundColor,
      textColor: textColor,
      iconColor: iconColor,
    );
  }

  HeaderAction _convertPharmacyAction(PharmacyHeaderAction action) {
    switch (action.type) {
      case PharmacyHeaderActionType.search:
        return HeaderAction.icon(
          icon: Icons.search,
          onTap: action.onTap,
        );
      case PharmacyHeaderActionType.filter:
        return HeaderAction.icon(
          icon: Icons.filter_list,
          onTap: action.onTap,
        );
      case PharmacyHeaderActionType.add:
        return HeaderAction.icon(
          icon: Icons.add,
          onTap: action.onTap,
        );
      case PharmacyHeaderActionType.edit:
        return HeaderAction.icon(
          icon: Icons.edit,
          onTap: action.onTap,
        );
      case PharmacyHeaderActionType.delete:
        return HeaderAction.icon(
          icon: Icons.delete,
          onTap: action.onTap,
        );
      case PharmacyHeaderActionType.save:
        return HeaderAction.text(
          text: 'Save',
          onTap: action.onTap,
        );
      case PharmacyHeaderActionType.cancel:
        return HeaderAction.text(
          text: 'Cancel',
          onTap: action.onTap,
        );
      case PharmacyHeaderActionType.done:
        return HeaderAction.text(
          text: 'Done',
          onTap: action.onTap,
        );
      case PharmacyHeaderActionType.skip:
        return HeaderAction.text(
          text: 'Skip',
          onTap: action.onTap,
        );
      case PharmacyHeaderActionType.custom:
        return HeaderAction.custom(
          widget: action.customWidget!,
          onTap: action.onTap,
        );
    }
  }

  @override
  Size get preferredSize => const Size.fromHeight(56);
}

class PharmacyHeaderAction {
  final PharmacyHeaderActionType type;
  final VoidCallback? onTap;
  final Widget? customWidget;

  const PharmacyHeaderAction._({
    required this.type,
    this.onTap,
    this.customWidget,
  });

  factory PharmacyHeaderAction.search({VoidCallback? onTap}) {
    return PharmacyHeaderAction._(
      type: PharmacyHeaderActionType.search,
      onTap: onTap,
    );
  }

  factory PharmacyHeaderAction.filter({VoidCallback? onTap}) {
    return PharmacyHeaderAction._(
      type: PharmacyHeaderActionType.filter,
      onTap: onTap,
    );
  }

  factory PharmacyHeaderAction.add({VoidCallback? onTap}) {
    return PharmacyHeaderAction._(
      type: PharmacyHeaderActionType.add,
      onTap: onTap,
    );
  }

  factory PharmacyHeaderAction.edit({VoidCallback? onTap}) {
    return PharmacyHeaderAction._(
      type: PharmacyHeaderActionType.edit,
      onTap: onTap,
    );
  }

  factory PharmacyHeaderAction.delete({VoidCallback? onTap}) {
    return PharmacyHeaderAction._(
      type: PharmacyHeaderActionType.delete,
      onTap: onTap,
    );
  }

  factory PharmacyHeaderAction.save({VoidCallback? onTap}) {
    return PharmacyHeaderAction._(
      type: PharmacyHeaderActionType.save,
      onTap: onTap,
    );
  }

  factory PharmacyHeaderAction.cancel({VoidCallback? onTap}) {
    return PharmacyHeaderAction._(
      type: PharmacyHeaderActionType.cancel,
      onTap: onTap,
    );
  }

  factory PharmacyHeaderAction.done({VoidCallback? onTap}) {
    return PharmacyHeaderAction._(
      type: PharmacyHeaderActionType.done,
      onTap: onTap,
    );
  }

  factory PharmacyHeaderAction.skip({VoidCallback? onTap}) {
    return PharmacyHeaderAction._(
      type: PharmacyHeaderActionType.skip,
      onTap: onTap,
    );
  }

  factory PharmacyHeaderAction.custom({
    required Widget widget,
    VoidCallback? onTap,
  }) {
    return PharmacyHeaderAction._(
      type: PharmacyHeaderActionType.custom,
      customWidget: widget,
      onTap: onTap,
    );
  }
}

enum PharmacyHeaderActionType {
  search,
  filter,
  add,
  edit,
  delete,
  save,
  cancel,
  done,
  skip,
  custom,
}
