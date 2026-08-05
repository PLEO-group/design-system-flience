# Kiedy Pominąć

Używaj tej referencji, gdy trzeba ocenić, czy `design-system-project-bootstrap` faktycznie pasuje do zadania.

Pomiń skill, gdy zadanie nie dotyczy fundamentów paczki design systemu. Użyj węższego workflow, jeśli użytkownik chce tylko:

- zmienić jedną istniejącą wartość tokena;
- dodać, zmienić nazwę albo usunąć pojedynczy asset SVG;
- poprawić copy albo layout w jednej story Storybooka;
- naprawić pojedynczy błąd w wygenerowanym CSS bez ruszania scaffoldingu;
- zmienić treść README bez zmiany setupu konsumenckiego;
- pracować w aplikacji produktowej, która tylko konsumuje design system.

Użyj tego skilla, jeśli drobne z pozoru zadanie ujawnia problem scaffoldingu, na przykład brakujące package exports,
zepsute skrypty builda, brak konfiguracji Storybooka, brak struktury tokenów źródłowych albo niespójny kontrakt `dist/css`.

Jeśli wymagany stack różni się od tego skilla, zatrzymaj niedopasowaną część i poproś o decyzję techniczną. Typowe
warunki zatrzymania:

- generator tokenów nie jest Style Dictionary;
- dokumentacja nie jest w Storybooku;
- paczka nie jest dystrybuowana przez npm-style exports;
- format źródłowy tokenów nie jest DTCG i użytkownik nie zlecił migracji;
- celem jest aplikacja produktowa, nie reużywalna paczka design systemu.
