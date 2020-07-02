# 2.0.10
- meta: CHANGELOG.md started
- meta: added eslint config, fixed resulting issues
- feature: added StrategyWorkerWSServer
- refactor: removed vestigial logic from pre-bfx project adoption
- refactor: startHFServer now waits for API server to open
- refactor: API ws server now waits for internal clients to connect on open()
- refactor: API server creates Credential before success res on auth init
- fix: API server now closes WS clients on close()
- fix: typo in API server info.auth_configured res on auth init
