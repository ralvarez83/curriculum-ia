# Pendiente: limpiar la clave privada del historial

En el commit `f75ff90` (julio de 2024) se subieron por error una clave privada
TLS y el certificado de `*.rubenalvarezgonzalez.eu`. Los ficheros se retiraron
del árbol de trabajo durante la migración a Astro, **pero siguen en el
historial de git**, y el repositorio es público.

## Estado

El certificado asociado caducó, así que la clave ya no sirve para nada: esto es
higiene, no una urgencia. Aun así conviene cerrarlo.

Ficheros afectados, todos introducidos en `f75ff90`:

- `path/to/key.pem/_cert.pem` — clave privada RSA
- `.ssl-data/_cert.pem` — otra clave privada
- `.ssl-data/rubenalvarezgonzalez.cer` — certificado
- `.ssl-data/rubenalvarezgonzalez-ca-bundle.crt`
- `.ssl-data/dhparam.pem`
- `.ssl-data/letsencrypt/config`

## Procedimiento

Reescribe el historial en un clon aparte y súbelo forzando:

```bash
pip install git-filter-repo

git clone https://github.com/ralvarez83/curriculum-ia limpieza
cd limpieza

git filter-repo --invert-paths --path-glob 'path/to/*' --path '.ssl-data'

git remote add origin https://github.com/ralvarez83/curriculum-ia
git push --force origin main
```

### Comprobación

Antes de subir, verifica que no queda ningún blob con material de clave:

```bash
git rev-list --objects --all | cut -d' ' -f1 | sort -u | while read -r o; do
  [ "$(git cat-file -t "$o" 2>/dev/null)" = blob ] || continue
  git cat-file blob "$o" 2>/dev/null | grep -qa "PRIVATE KEY" && echo "queda: $o"
done
```

Se ejecutó en su día sobre el historial ya reescrito: 0 coincidencias sobre 201
blobs, y el árbol resultante daba el mismo hash que el original, o sea que no se
perdía ni un fichero del estado actual.

## Dos advertencias

**Los clones existentes quedan inservibles.** Cualquiera que tenga el repo
clonado —tú incluido— tendrá que volver a clonarlo. No sirve un `git pull`.

**Un force-push no borra los objetos de GitHub.** Los commits antiguos siguen
siendo accesibles por su SHA directa hasta que GitHub pase su recolector de
basura. Para eliminarlos de verdad hay que abrir un ticket a GitHub Support
pidiendo que purguen los objetos inalcanzables del repositorio.

## Para que no vuelva a pasar

El `.gitignore` ya ignora `*.key`, `*.pem`, `*.cer`, `*.crt` y `.ssl*`. La
trampa de entonces fue el nombre: el fichero se llamaba `_cert.pem` dentro de
`path/to/key.pem/`, un directorio creado por accidente.

Conviene además activar la **protección de push** de GitHub (*Settings →
Code security → Push protection*), que bloquea el envío de commits con secretos
detectados antes de que lleguen al repositorio.
