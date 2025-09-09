import 'package:dartz/dartz.dart';
import '../entities/prescription.dart';
import '../../core/errors/failures.dart';

abstract class PrescriptionRepository {
  Future<Either<Failure, List<Prescription>>> getPrescriptions();

  Future<Either<Failure, Prescription>> getPrescriptionById(String id);

  Future<Either<Failure, Prescription>> createPrescription(Prescription prescription);

  Future<Either<Failure, Prescription>> updatePrescriptionStatus({
    required String id,
    required String status,
  });
}
