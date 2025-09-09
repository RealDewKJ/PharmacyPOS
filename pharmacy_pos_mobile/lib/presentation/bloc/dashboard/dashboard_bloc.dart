import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../domain/entities/dashboard.dart';
import '../../../domain/entities/sale.dart';
import '../../../domain/usecases/dashboard/get_dashboard_stats_usecase.dart';
import '../../../domain/usecases/dashboard/get_recent_sales_usecase.dart';
import '../../../core/errors/failures.dart';

part 'dashboard_event.dart';
part 'dashboard_state.dart';

class DashboardBloc extends Bloc<DashboardEvent, DashboardState> {
  final GetDashboardStatsUseCase _getDashboardStatsUseCase;
  final GetRecentSalesUseCase _getRecentSalesUseCase;

  DashboardBloc({
    required GetDashboardStatsUseCase getDashboardStatsUseCase,
    required GetRecentSalesUseCase getRecentSalesUseCase,
  })  : _getDashboardStatsUseCase = getDashboardStatsUseCase,
        _getRecentSalesUseCase = getRecentSalesUseCase,
        super(DashboardInitial()) {
    on<GetDashboardStatsRequested>(_onGetDashboardStatsRequested);
    on<GetRecentSalesRequested>(_onGetRecentSalesRequested);
  }

  Future<void> _onGetDashboardStatsRequested(
    GetDashboardStatsRequested event,
    Emitter<DashboardState> emit,
  ) async {
    emit(DashboardLoading());
    
    final result = await _getDashboardStatsUseCase();

    result.fold(
      (failure) => emit(DashboardFailure(_mapFailureToMessage(failure))),
      (stats) => emit(DashboardStatsSuccess(stats: stats)),
    );
  }

  Future<void> _onGetRecentSalesRequested(
    GetRecentSalesRequested event,
    Emitter<DashboardState> emit,
  ) async {
    emit(DashboardLoading());
    
    final result = await _getRecentSalesUseCase();

    result.fold(
      (failure) => emit(DashboardFailure(_mapFailureToMessage(failure))),
      (sales) => emit(DashboardRecentSalesSuccess(sales: sales)),
    );
  }

  String _mapFailureToMessage(Failure failure) {
    switch (failure.runtimeType) {
      case ServerFailure:
        return 'Server error: ${failure.message}';
      case NetworkFailure:
        return 'Network error: ${failure.message}';
      case ValidationFailure:
        return 'Validation error: ${failure.message}';
      default:
        return 'Unexpected error: ${failure.message}';
    }
  }
}
