part of 'dashboard_bloc.dart';

abstract class DashboardState extends Equatable {
  const DashboardState();

  @override
  List<Object?> get props => [];
}

class DashboardInitial extends DashboardState {}

class DashboardLoading extends DashboardState {}

class DashboardStatsSuccess extends DashboardState {
  final DashboardStats stats;

  const DashboardStatsSuccess({required this.stats});

  @override
  List<Object?> get props => [stats];
}

class DashboardRecentSalesSuccess extends DashboardState {
  final List<Sale> sales;

  const DashboardRecentSalesSuccess({required this.sales});

  @override
  List<Object?> get props => [sales];
}

class DashboardFailure extends DashboardState {
  final String message;

  const DashboardFailure(this.message);

  @override
  List<Object?> get props => [message];
}
