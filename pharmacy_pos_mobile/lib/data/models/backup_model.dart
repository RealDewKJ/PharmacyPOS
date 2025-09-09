import '../../domain/entities/backup.dart';

class BackupModel extends Backup {
  const BackupModel({
    required super.id,
    required super.name,
    required super.date,
    required super.size,
    required super.path,
  });

  factory BackupModel.fromJson(Map<String, dynamic> json) => BackupModel(
        id: json['id'] as int,
        name: json['name'] as String,
        date: DateTime.parse(json['date'] as String),
        size: json['size'] as String,
        path: json['path'] as String,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'date': date.toIso8601String(),
        'size': size,
        'path': path,
      };

  factory BackupModel.fromEntity(Backup backup) => BackupModel(
        id: backup.id,
        name: backup.name,
        date: backup.date,
        size: backup.size,
        path: backup.path,
      );

  Backup toEntity() => Backup(
        id: id,
        name: name,
        date: date,
        size: size,
        path: path,
      );
}
