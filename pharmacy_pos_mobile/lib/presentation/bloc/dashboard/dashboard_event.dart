part of 'dashboard_bloc.dart';

abstract class DashboardEvent extends Equatable {
  const DashboardEvent();

  @override
  List<Object?> get props => [];
}

class GetDashboardStatsRequested extends DashboardEvent {
  const GetDashboardStatsRequested();
}

class GetRecentSalesRequested extends DashboardEvent {
  const GetRecentSalesRequested();
}
