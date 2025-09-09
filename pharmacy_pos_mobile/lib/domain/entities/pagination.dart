import 'package:equatable/equatable.dart';

class Pagination extends Equatable {
  final int page;
  final int limit;
  final int total;
  final int pages;

  const Pagination({
    required this.page,
    required this.limit,
    required this.total,
    required this.pages,
  });

  @override
  List<Object?> get props => [page, limit, total, pages];
}
