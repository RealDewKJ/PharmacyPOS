import 'package:dartz/dartz.dart';
import '../entities/backup.dart';
import '../../core/errors/failures.dart';

abstract class BackupRepository {
  Future<Either<Failure, Backup>> createBackup();

  Future<Either<Failure, List<Backup>>> getBackups();

  Future<Either<Failure, void>> restoreBackup(String backupName);

  Future<Either<Failure, void>> deleteBackup(String backupName);
}
