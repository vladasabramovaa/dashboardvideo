## Git Conventions

- Semantic commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `checkpoint:`, `chore:`
- `checkpoint:` commit ПЕРЕД каждым крупным изменением (название: `checkpoint: перед <описание>`)
- Lock-файлы (package-lock.json, Pipfile.lock, pubspec.lock) ВСЕГДА в git
- НИКОГДА `git reset --hard` / `push --force` без явного подтверждения пользователя
- Staging: добавляй конкретные файлы, НЕ `git add -A`
- Не коммить `.env`, credentials, API keys
- Перед push — проверь что все тесты проходят
