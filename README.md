#SUPERUSER

made with node v 14.21.3

Want to take a quick look?

Visit the live site:

[https://superuser.codelogystudios.com/](https://superuser.codelogystudios.com/)

# run with docker
## prod
```bash
docker compose -f docker-compose.prod.yml up -d
```

## dev (with hot reload)
```bash
docker compose -f docker-compose.dev.yml up --build
```

# Run locally

just make sure to have node v 14.21.3


and then just run
```bash
npm install
npm run serve
```

make a build with:

```bash
npm run build
```
