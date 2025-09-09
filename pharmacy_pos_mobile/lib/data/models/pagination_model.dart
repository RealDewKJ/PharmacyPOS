import '../../domain/entities/pagination.dart';

class PaginationModel extends Pagination {
  const PaginationModel({
    required super.page,
    required super.limit,
    required super.total,
    required super.pages,
  });

  factory PaginationModel.fromJson(Map<String, dynamic> json) => PaginationModel(
        page: json['page'] as int,
        limit: json['limit'] as int,
        total: json['total'] as int,
        pages: json['pages'] as int,
      );

  Map<String, dynamic> toJson() => {
        'page': page,
        'limit': limit,
        'total': total,
        'pages': pages,
      };

  factory PaginationModel.fromEntity(Pagination pagination) => PaginationModel(
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        pages: pagination.pages,
      );

  Pagination toEntity() => Pagination(
        page: page,
        limit: limit,
        total: total,
        pages: pages,
      );
}
