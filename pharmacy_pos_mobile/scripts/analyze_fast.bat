@echo off
echo Analyzing Dart code...

REM Analyze only specific directories (faster)
flutter analyze lib/presentation/views/
flutter analyze lib/presentation/widgets/
flutter analyze lib/presentation/bloc/
flutter analyze lib/domain/
flutter analyze lib/data/
flutter analyze lib/core/

echo Analysis complete!
