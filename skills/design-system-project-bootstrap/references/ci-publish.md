# CI i publikacja

Używaj tej referencji przy tworzeniu GitHub Actions albo setupu publikacji.

## Przepływ budowania

Dla pull requestów oraz zmian tokenów/assetów uruchamiaj:

```bash
npm install
npm run build
npm run build-storybook
```

Użyj Node 22, gdy trzymasz się baseline `design-system-flience`. Jeśli repo docelowe ma już `engines` albo plik wersji
Node, trzymaj się tej konwencji po sprawdzeniu wsparcia zależności.

## Podgląd Storybooka

Dodaj preview deploy na Vercel tylko wtedy, gdy użytkownik to potwierdzi i repo ma:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Dla statycznych deployów Storybooka najpierw zbuduj Storybooka, a potem przygotuj `.vercel/output/static` z
`storybook-static`.

Przechowuj te wartości jako GitHub Actions secrets albo environment secrets. Nie commituj `.vercel/project.json`, chyba
że repo już świadomie śledzi metadane projektu Vercel i użytkownik potwierdzi, że plik nie zawiera wartości wrażliwych.

## Publikacja npm

Publikuj dopiero po potwierdzeniu:

- nazwy paczki npm i poziomu dostępu;
- registry;
- trusted publishing/OIDC albo `NPM_TOKEN`;
- triggera release, na przykład `workflow_dispatch` albo push do `main`.

Unikaj ślepego `npm version patch`, chyba że użytkownik akceptuje automatyczne patch release. Jeśli używasz
auto-versioningu, skonfiguruj użytkownika Git w workflow przed commitem z bumpem wersji.

Preferuj npm trusted publishing z OIDC dla GitHub Actions, gdy paczka/organizacja to wspiera. Jeśli repo musi używać
publikacji tokenem, użyj granular npm token odpowiedniego do CI publishing. Przechowuj go jako `NPM_TOKEN` w GitHub
Actions secrets i przekaż do publikacji jako `NODE_AUTH_TOKEN`. Nigdy nie zapisuj tokenów npm w `.npmrc`, `.env`,
logach workflow ani commitowanych plikach.

## Sekrety GitHub Actions

Domyślnie używaj repository secrets. Używaj environment secrets, gdy preview/prod deploymenty potrzebują różnych reguł
akceptacji albo różnych wartości.

Oczekiwane nazwy dla bazowego workflow:

- `NPM_TOKEN` - token publikacji npm, tylko gdy nie używasz trusted publishing/OIDC.
- `VERCEL_TOKEN` - token API Vercel do deployów.
- `VERCEL_ORG_ID` - ID zespołu/użytkownika Vercel.
- `VERCEL_PROJECT_ID` - ID projektu Vercel.

Preferuj wbudowany `GITHUB_TOKEN` do zapisów w repo w GitHub Actions, jeśli jego uprawnienia wystarczają. Twórz osobny
GitHub personal access token tylko dla narzędzi zewnętrznych takich jak Tokens Studio albo przepływów, które potrzebują
uprawnień niepokrywanych przez `GITHUB_TOKEN`.

## Walidacja

Zgłoś, czy każdy skonfigurowany workflow może działać z sekretami dostępnymi w repo. Nie twierdź, że preview albo
publikacja są gotowe, jeśli brakuje wymaganych sekretów.
