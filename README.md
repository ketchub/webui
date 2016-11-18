# CatchAlong :: WebUI

Dependencies for development environment:
- Docker & Docker Compose
- GNU Make tools (ie. have XCode installed)

#### Developer Setup

Clone the repo and `make dev`. This will build the dev environment, completely
isolated in a Docker container, with the repo code base mounted as a volume.

```
git clone git@github.com:jhartman86/catchalong-webui.git
cd catchalong-webui && make dev
```

When finished working, `Ctrl+C` in the terminal to shut down the Docker container
and it'll be cleaned up automatically. The *image* will remain on your system for
quicker startup next time, but the *container* will be cleaned up.

**SSL & Local Development:** Since everything is run via https, it only makes sense
to develop locally strictly with SSL. Self-signed certificates are bundled in
the repo. Most browsers don't let you access https via
`localhost`, so setup an entry in your `hosts` file (normally `/etc/hosts`). This
step is optional if you already have an alias in your hosts file that you want to
reuse.

```
# /etc/hosts
127.0.0.1   local.dev
```

Navigate to: **https://local.dev:4433**

*Fix Certificate HTTPS Warning:* You'll predictably see a message like
"This site is unsafe, will steal your wife, and kill your dog." Go around it,
or better yet, make the self-signed cert trusted on your system:

- [OSX](http://www.robpeck.com/2010/10/google-chrome-mac-os-x-and-self-signed-ssl-certificates/#.WC5cQaIrLdT)

#### Deployment

- Merge into branch `master`
- According to semver, run one of the following Make tasks:
  - `deploy-patch`
  - `deploy-minor`
  - `deploy-major`

#### Under the Hood

You should never need to run any commands manually (eg. rm'ing Docker containers
daily). Everything should be handled automatically, or via preconfigured Make
targets:

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
