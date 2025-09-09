@echo off
echo Formatting Dart code...

REM Format only specific directories (faster)
dart format lib/presentation/views/
dart format lib/presentation/widgets/
dart format lib/presentation/bloc/
dart format lib/domain/
dart format lib/data/
dart format lib/core/

echo Formatting complete!
