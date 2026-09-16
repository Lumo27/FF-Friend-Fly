# Setup del repo — CI y protección de ramas

Esto ya está configurado (vía GitHub Settings → Branches, y `.github/workflows/ci.yml`). Queda documentado acá por si hay que recrearlo o revisar qué incluye.

## CI (`.github/workflows/ci.yml`)

Corre en cada push y cada PR contra `develop` o `main`: `npm ci` seguido de `lint`, `typecheck`, `test` y `build` (cada uno con `--if-present`, así no rompe si algún script todavía no existe). Vive en `web/` — todo el job usa `working-directory: web`.

## Branch protection — `main` y `develop`

Ambas ramas tienen activado:

- **Require a pull request before merging** — sin commits directos.
- **Require approvals: 1** — al menos un compañero tiene que aprobar el PR.
- **Require status checks to pass** — el check `lint-test-build` (el job de `ci.yml`) tiene que estar en verde. Incluye "require branches to be up to date" antes de mergear.
- **Include administrators** — la protección aplica también a los owners/admins, nadie puede saltearla.
- **No permite force-push.**
- **No permite borrar la rama.**

## Si hay que recrearlo

Vía GitHub CLI (necesitás permisos de admin en el repo):

```bash
gh api -X PUT repos/Vladi1221/FF-Friend-Fly/branches/<main|develop>/protection \
  -H "Accept: application/vnd.github+json" \
  --input protection.json
```

con `protection.json` conteniendo el bloque de reglas de arriba (ver la config aplicada en GitHub → Settings → Branches para el JSON exacto vigente).
