# CatchAlong :: WebUI

Dependencies for development environment:
- Docker & Docker Compose
- GNU Make tools (ie. have XCode installed)

#### Developer Setup

```
git clone git@github.com:jhartman86/catchalong-webui.git
cd catchalong-webui && make dev
```

In a browser, hit http://localhost:8080.

When finished working, `Ctrl+C` in the terminal to shut down the dev environment (a Docker container) and it'll be cleaned up automatically. The *image* will remain on your system for quicker startup next time, but the *container* will be removed.

#### Deployment

- Merge into branch `master`
- According to semver, run one of the following Make tasks:
  - `deploy-patch`
  - `deploy-minor`
  - `deploy-major`

#### Under the Hood

Aside from Docker (and Compose), nothing else needs to be on your system. The dev environment will be provisioned into a container and executed entirely isolated, while mounting your local directory for development. All tasks you may need to run should be available via Make targets:

\# __dev__ - launch dev environment via Docker

\# __halt__ - force stop dev environment

\# __setup__ - build docker container and install npm modules

\# __npm-install__ - install npm modules

\# __dockerize__ - build docker container

\# __build-production__ - build with production settings

\# __serve-production__ - build production ^ and serve locally

\# __test-node__ - execute test suite via node

\# __bump-patch__ - bump package version: patch (semver)

\# __bump-minor__ - bump package version: minor (semver)

\# __bump-major__ - bump package version: major (semver)

\# __ssh__ - ssh into the dev container when running

\# __inspect-docker-compose-config__ - inspect docker compose settings
