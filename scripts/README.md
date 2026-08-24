# KisanSeva Developer Scripts

This folder contains one-time data generation, migration, and development utilities.
These are **not part of the production application**.

## Scripts Reference

| Script | Language | Purpose |
|--------|----------|---------| 
| `gen_diseases.js` | Node.js | Generate disease library JSON from raw data |
| `gen_chunks.py` | Python | Chunk disease datasets for RAG vector store |
| `gen_parallel.js` | Node.js | Parallel batch generator for disease data |
| `replace_fetch.py` | Python | Migrate legacy fetch patterns to async/await |
| `fix_storage.py` | Python | Fix IndexedDB schema migrations |
| `test_api.js` | Node.js | Smoke test for API endpoints |
| `test_chat.js` | Node.js | Test AI chat response pipeline |
| `update_storage.py` | Python | Update cold storage database fixtures |
| `update_page.py` | Python | Batch-update page templates |

## Running Scripts

```bash
# Python scripts
python scripts/gen_chunks.py

# Node.js scripts
node scripts/gen_diseases.js
```

> Scripts are idempotent where possible. Always review before running against production data.
