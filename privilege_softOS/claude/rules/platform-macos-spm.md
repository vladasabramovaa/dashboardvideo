## macOS Menubar App (SPM) Learnings

- SPM executables: `-Xlinker -sectcreate -Xlinker __TEXT -Xlinker __info_plist -Xlinker path` (каждый arg через -Xlinker)
- `codesign --force --sign -` для .app bundle
- Pattern: start `.regular` -> create NSStatusItem -> switch to `.accessory`
- `NSPrincipalClass=NSApplication` в Info.plist обязательно
- `MenuBarExtra` SwiftUI НЕ работает с SPM executables
- MacBook с notch: menubar overflow скрывает новые иконки
