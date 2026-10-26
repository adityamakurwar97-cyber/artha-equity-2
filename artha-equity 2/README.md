# Artha — A clearer view of value

A desktop equity-research application built from the original PBL repository. It combines reviewed Infosys FY24–FY26 financials, a Python FCFF model, scenarios, comparable analysis and evidence-linked explanations.

The interface uses a light, spacious visual system inspired by Apple's restraint: three primary areas, large readable type and detailed analysis on demand. It is desktop only, with a minimum workspace width of 1180px.

## Run the complete application

Install Node.js 22+ and Python 3.10+. The application has no third-party JavaScript or Python runtime dependencies.

```bash
npm run build
npm start
```

Open http://127.0.0.1:3000. Python owns the financial calculations; Node serves the desktop UI and API. Rebuild after changing public files or reviewed data. The original pandas/Jupyter analysis remains available separately; install `requirements.txt` only for the notebook, data tools and full development tests.

For a container deployment, copy `.env.example` to `.env`, set your own `APP_AUTH_PASSWORD`, then run:

```bash
docker compose up --build -d
```

Follow [the deployment guide](docs/DEPLOYMENT.md) for authentication, persistent storage, HTTPS and verification. No credentials are included. The Docker image definition is provided; an image build was not executed in this environment.

## Three main areas

- **Company:** reported history, source periods, revenue/profit/cash-flow charts, three-statement selected lines and fundamental ratios.
- **Valuation:** base/bull/bear/custom assumptions, CAPM/WACC, five-year FCFF, terminal value, sensitivity, equity bridge and comparable multiples.
- **Research:** explanations linked to reviewed financial facts and official sources, with an optional server-side language-model connector.

Sources, reconciliation checks, saved scenarios and methodology open in dialogs. JSON, CSV, browser print-to-PDF and the complete source ZIP are available from Export. Scenarios and market-import drafts use browser storage. Explicitly saved Python valuations also create immutable local SQLite snapshots with assumptions, provenance and market evidence in the input hash.

## Hosted preview and full application

The hosted Site is a static desktop preview. Its base/bull/bear results and supported explanations are compiled by Python during the build. It does not run a browser financial engine or a Python server. Custom recalculation, CAPM, market imports, SQLite history and optional live LLM calls require the complete Node + Python application.

## Financial scope

The reviewed example is Infosys, with TCS, HCLTech and Wipro FY26 reported-basis peer financials. The default case is an explicitly retrospective March 31, 2026 valuation using later-published annual reports. It is provisional: growth, WACC, margins, sustainable reinvestment, excess cash and employee-award dilution need analyst review.

No price, upside or market multiple is invented. Reviewed official BSE CSV evidence and date-compatible shares are required to activate market comparisons; optional peer bridge inputs require an official-company financial source. Reported EBIT is distinguished from pre-exception EBIT. March 2026 net shares are 404.6940812 crore, already excluding treasury.

This is a deployable research MVP. Automatic ticker/news ingestion, actual FinBERT inference, full PDF/vector RAG and academic report/presentation deliverables are not implemented. The [requirements audit](docs/REQUIREMENTS_AUDIT.md) records the boundary.

## Optional language model

Evidence mode works without a key. To use a provider, set `LLM_API_KEY`, `LLM_MODEL` and the HTTPS `LLM_API_URL` in your local environment, then run:

```bash
node --env-file=.env backend/server.mjs
```

Provider keys stay server-side. Retrieved facts and deterministic Python outputs ground the response; invalid citations/numerical claims trigger an evidence fallback. No live provider call was verified for this release. Structured-fact BM25 retrieval is implemented; this is not full annual-report vector RAG.

## Development verification

```bash
npm test
python3 -m unittest discover -s tests -v
python3 scripts/preflight.py
```

Full tests require `requirements.txt`. Runtime smoke tests additionally run the service with Python site packages disabled. Tests compare the portable Python model with the independent pandas notebook engine across scenarios and cover reconciliation, cutoff dates, shares, API validation and authentication.

## Learn and inspect

Read [the learning guide](docs/LEARNING_GUIDE.md) for concepts before code, [architecture](docs/ARCHITECTURE.md) for service contracts, [model review](docs/MODEL_REVIEW.md) for financial assumptions and [design system](docs/DESIGN_SYSTEM.md) for the visual direction.

| Path | Responsibility |
|---|---|
| `src/portable_finance.py` | Dependency-free production Python FCFF model and sensitivity |
| `backend/python_service.py` | Validated Python API adapter, analytics and comparable values |
| `src/fundamental_analytics.py` | Ratios, CAPM/WACC, multiples and peer-implied values |
| `src/research_store.py` | SQLite snapshots and input fingerprints |
| `backend/server.mjs` | HTTP, authentication, API limits and optional LLM connector |
| `public/app.js`, `public/styles.css` | Desktop interactions and visual system |
| `scripts/prepare_preview.py` | Python compilation of static preview results |
| `data/source_snapshot.json` | Reviewed official evidence |
| `src/equity_platform.py` | Retained pandas notebook/reference model |
| `Dockerfile`, `compose.yaml` | Full-application deployment |
| `tests/`, `web-tests/` | Python, JavaScript, API and parity checks |

Original repository: https://github.com/adityamakurwar97-cyber/Ai-powered-Equity-reserch-and-Valuation-platform-

The original license and learning materials are preserved. This deliverable does not push changes to that original GitHub remote.
