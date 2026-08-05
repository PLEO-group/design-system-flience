# Checklista TODO przepływu pracy

Używaj tej referencji, gdy bootstrap ma objąć pełny setup zewnętrzny potrzebny do synchronizacji tokenów, CI, preview
deployów i publikacji npm. Zostawiaj elementy jako TODO, dopóki użytkownik nie potwierdzi wykonania albo nie da dostępu
do ich weryfikacji.

## Repozytorium

- [ ] Utworzyć albo potwierdzić repozytorium GitHub.
- [ ] Potwierdzić nazwę domyślnego brancha, zwykle `main`.
- [ ] Potwierdzić nazewnictwo branchy oczekiwane przez Tokens Studio, na przykład `feature/**` albo dedykowany branch `token-sync`.
- [ ] Potwierdzić przepływ PR: zmiany tokenów otwierają PR, CI buduje tokeny i Storybooka, a merge uruchamia publikację, jeśli jest włączona.
- [ ] Potwierdzić uprawnienia GitHub Actions wymagane przez workflowy, szczególnie `contents: write`, `pull-requests: write`,
  `packages: write` i `id-token: write` tylko tam, gdzie są realnie potrzebne.
- [ ] Zabezpieczyć `main`, jeśli projekt wymaga review przed publikacją.

## npm

- [ ] Potwierdzić nazwę paczki i npm scope.
- [ ] Potwierdzić dostęp paczki: public, private, scoped public albo scoped private.
- [ ] Potwierdzić target registry, zwykle `https://registry.npmjs.org/`.
- [ ] Wybrać tryb autoryzacji publikacji: npm trusted publishing/OIDC (preferowane, gdy dostępne) albo granular npm token.
- [ ] Przy trusted publishing skonfigurować paczkę/organizację npm tak, żeby ufała dokładnemu workflow GitHub Actions publikującemu paczkę.
- [ ] Przy publikacji tokenem wygenerować granular npm access token odpowiedni do CI publish.
- [ ] Przy publikacji tokenem dodać token do GitHub Actions secrets jako `NPM_TOKEN`.
- [ ] Przy publikacji tokenem sprawdzić, że workflow przekazuje `NPM_TOKEN` do `npm publish` jako `NODE_AUTH_TOKEN`.
- [ ] Potwierdzić politykę 2FA konta/organizacji npm i to, czy token-based automation publishing jest dozwolone.
- [ ] Uruchomić dry publish, gdy to możliwe: `npm publish --dry-run`.

## Sekrety i zmienne GitHub

- [ ] Dodać `NPM_TOKEN` jako repository albo environment secret.
- [ ] Pominąć `NPM_TOKEN` tylko wtedy, gdy npm trusted publishing/OIDC jest skonfigurowane i zweryfikowane.
- [ ] Dodać `VERCEL_TOKEN` jako repository albo environment secret, jeśli preview Storybooka używa Vercel CLI.
- [ ] Dodać `VERCEL_ORG_ID` i `VERCEL_PROJECT_ID` jako repository/environment secrets albo variables.
- [ ] Zdecydować, czy `VERCEL_ORG_ID` i `VERCEL_PROJECT_ID` są sekretami czy zwykłymi variables według polityki repo.
- [ ] Używać wbudowanego `GITHUB_TOKEN` do checkoutu, komentarzy PR i commitów, gdy wystarcza.
- [ ] Utworzyć osobny GitHub PAT tylko wtedy, gdy wymaga tego integracja zewnętrzna.
- [ ] Nigdy nie commitować sekretów do `.env`, `.npmrc`, workflow YAML, przykładów README z realnymi wartościami ani plików Storybooka.

## Vercel

- [ ] Utworzyć albo potwierdzić projekt Vercel dla preview Storybooka.
- [ ] Spiąć repo/projekt lokalnie albo w CI na tyle, żeby uzyskać `orgId` i `projectId`.
- [ ] Wygenerować Vercel access token z dostępem do docelowego teamu/projektu.
- [ ] Zapisać dane Vercel w GitHub Actions jako `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
- [ ] Potwierdzić, czy automatyczna integracja Vercel Git jest włączona czy wyłączona. Unikaj podwójnych deployów, gdy
  GitHub Actions też wdraża preview.
- [ ] Potwierdzić strategię raportowania preview URL, na przykład Action summary, komentarz PR albo tylko dashboard Vercel.
- [ ] Przetestować `vercel pull --yes --environment=preview` i `vercel deploy --prebuilt --yes` z CI przed uznaniem preview deployów za gotowe.

## Tokens Studio

- [ ] Potwierdzić, że Tokens Studio jest źródłem prawdy dla JSON tokenów.
- [ ] Potwierdzić dostawcę przechowywania tokenów: synchronizacja z repozytorium GitHub.
- [ ] Wygenerować GitHub token dla Tokens Studio z minimalnym dostępem do odczytu i zapisu plików tokenów w repo.
- [ ] Skonfigurować Tokens Studio Git sync z owner/name repo, branchem, base path i ścieżkami plików zgodnymi z `tokens/`.
- [ ] Potwierdzić, czy Tokens Studio zapisuje bezpośrednio na branch funkcyjny, czy przez kontrolowany przepływ branchy.
- [ ] Potwierdzić, że eksportowany format tokenów to DTCG (`$value`, `$type`) albo dodać jawny krok migracji.
- [ ] Uruchomić jeden testowy sync z Tokens Studio do GitHub.
- [ ] Sprawdzić, że powstały diff dotyka tylko oczekiwanych plików JSON tokenów i zachowuje nazewnictwo typu `Color/Core/Value.json`.
- [ ] Otworzyć PR z brancha token sync i zweryfikować, że GitHub Actions buduje tokeny i Storybooka.

## Lokalny test

- [ ] Uruchomić `npm install`.
- [ ] Uruchomić `npm run build`.
- [ ] Uruchomić `npm run build-storybook`.
- [ ] Potwierdzić, że wygenerowane pliki `dist/css` istnieją.
- [ ] Potwierdzić, że wygenerowane outputy React SVG i raw SVG istnieją, gdy istnieją źródłowe SVG.
- [ ] Uruchomić build dwa razy i sprawdzić idempotencję outputów albo opisać oczekiwany churn.
- [ ] Uruchomić PR workflow raz z brancha ze zmianą tokena albo assetu.
- [ ] Uruchomić publish workflow dopiero po potwierdzeniu nazwy paczki, registry, tokena i release policy.

## Przekazanie

- [ ] Zgłosić, które TODO są wykonane, które pozostają zablokowane przez dostęp użytkownika/dostawcy i które świadomie pominięto.
- [ ] Wypisać dokładne nazwy sekretów oczekiwane przez GitHub Actions, bez drukowania wartości sekretów.
- [ ] Wypisać dashboardy zewnętrzne, które użytkownik musi sprawdzić: npm package/org, GitHub repository secrets,
  projekt Vercel, ustawienia Tokens Studio sync.
