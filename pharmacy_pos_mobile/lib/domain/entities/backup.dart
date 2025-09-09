import 'package:equatable/equatable.dart';

class Backup extends Equatable {
  final int id;
  final String name;
  final DateTime date;
  final String size;
  final String path;

  const Backup({
    required this.id,
    required this.name,
    required this.date,
    required this.size,
    required this.path,
  });

  @override
  List<Object?> get props => [id, name, date, size, path];
}
