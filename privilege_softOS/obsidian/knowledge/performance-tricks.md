---
type: moc
tags: [knowledge, performance, optimization]
created: 2026-03-07
---

# Performance Tricks

Cross-project encyclopedia of performance optimizations, benchmarks, and scalability patterns.

---

## Benchmarks & Measurements

### Voice AI Latency

| What | Value |
|------|-------|
| Cartesia Sonic TTS TTFA | **40-90 ms** |
| Deepgram Nova-3 STT WER | **6.84%** (fastest STT) |
| Target end-to-end voice latency | **<800 ms** |

### Database Performance

| What | Value |
|------|-------|
| QuestDB OHLCV query (100M rows) | **25 ms** |
| ClickHouse OHLCV query (100M rows) | **547 ms** |
| TimescaleDB OHLCV query (100M rows) | **1,021 ms** |
| kdb+/q OHLCV query (100M rows) | **~6 ms** ($250-500K/yr) |
| QuestDB ingestion rate | **959K rows/sec** |
| ClickHouse ingestion rate | **564K rows/sec** |
| InfluxDB ingestion rate | **334K rows/sec** |
| TimescaleDB ingestion rate | **145K rows/sec** |

### Network & Trading Latency

| What | Value |
|------|-------|
| Binance matching engine (from Tokyo) | **4 ms avg, 13 ms P99** |
| Bybit matching engine (from Tokyo) | **~5-10 ms** |
| OKX matching engine (from Tokyo) | **5-15 ms** |
| HFT tick-to-trade target | **<10 us** |
| FPGA internal logic | **<800 ns** |
| AWS cluster placement groups | **-37% P50, -39% P90 UDP roundtrip** |

### Serialization & Encoding

| What | Value |
|------|-------|
| SBE encode/decode | **~25 ns** |
| Cap'n Proto encode/decode | **~50 ns** |
| FlatBuffers encode/decode | **~100 ns** |
| Protocol Buffers encode/decode | **~1,000 ns** |
| JSON encode/decode | **~10,000 ns** |

### ML/Inference Latency

| What | Value |
|------|-------|
| XGBoost standard inference | **10-100 us** |
| Timber AOT XGBoost->C99 | **~2 us** |
| CCXT signing overhead | **~45 ms** (0.05 ms with Coincurve) |
| INT8 vs FP32 speedup | **2-4x (memory-bound), up to 16x (compute-bound)** |

### Backtesting Performance

| What | Value |
|------|-------|
| VectorBT: 500 tickers, 10 years | **<1 second** |
| Event-driven same test | **15-30 minutes** |
| VectorBT vs Backtrader | **~1000x faster** |
| VectorBT fill accuracy vs Binance | **0.3%** |

---

## ML/Inference Performance

### Model Size & Cache Locality

- **Model < 5KB, int8 quantization = guaranteed in L1 cache.** L1 cache fits 32-64K int8 params.
- **go:embed for weight embedding (~10KB binary)** -- no file I/O at runtime, weights baked into executable.
- Minimal weight format (header + flat LE float32) -- minimal parsing overhead, zero-copy load.

### Per-Flow vs Per-Packet Decisions

- **Per-packet inference at 1 Gbps = 78% CPU** on one core. Untenable.
- **Amortization:** one inference = params for next N packets. SIMD batching further improves utilization.

### crypto/rand Bottleneck (Go)

- **crypto/rand.Read() on hot path = 175 pkt/s (5.7 ms/pkt).** `getrandom` syscall per packet is the bottleneck.
- **Fix: ChaCha8 PRNG seeded from HMAC** -- stdlib (Go 1.22+), cryptographically strong, ~500ns per derivation + ~200ns per 256 bytes. Orders of magnitude faster.

### FiLM Modulation

- **FiLM `x = (1+gamma)*x + beta` outperforms additive injection by 6.5x** on 124M param model.
- **Bottleneck (32d) = feature, not bug** -- forces compression to essentials. Larger dimensions were worse.
- **GRU recurrence = key ingredient** for cross-layer state but **breaks pipeline parallelism** on inference. Architectural dead-end for production LLMs.

### OOM on GPU: Attention is O(seq^2)

- **OOM on A100 40GB at bs=512, seq=512, 6-layer transformer.** Attention scores = O(bs * heads * seq^2) per layer.
- **Fix: bs=128 (sweet spot for 5M param model).** On 8GB Mac: MAX_SEQ_LEN=256 + bs=16.
- **GPU time estimates are unreliable without benchmarking.** Always benchmark 1 epoch first, then extrapolate.

### INT8 Quantization Benefits

- **INT8 vs FP32: 2-4x speedup (memory-bound), up to 16x (compute-bound).**
- **50 bytes per packet sufficient for 99%+ classification accuracy** in traffic analysis.

### Cross-Language Inference Consistency

- `int8(float)` truncation in Go differs from Python. Fix with `math.Round()`.
- Cross-validation with test vectors between implementations is essential for bit-identical results.

---

## Database Performance

### QuestDB (Recommended for Tick Data)

- **QuestDB: 25ms query, 959K rows/sec ingestion on 100M rows.** Columnar, SQL-compatible, 10x faster inserts than InfluxDB.
- Chosen over InfluxDB/TimescaleDB for tick data: columnar storage optimized for time-series append + SQL compatibility.

### Storage Architecture (Hot/Warm/Cold)

- **Hot (real-time):** Redis (in-memory order book, state, sub-ms reads).
- **Warm (current day):** QuestDB (tick ingestion + fast queries).
- **Cold (history):** ClickHouse or Parquet on S3.
- **Research:** DuckDB / ArcticDB + Polars.

### PostgreSQL Patterns

- **GIN index on skills with @> operator** for array containment queries.
- **N+1 queries** in paginated search -- use `selectinload` / `joinedload` for related objects.

### SQLite for Local-First

- **SQLite eliminates server dependency** for project files. No concurrent multi-user access, but data portability matters more.

### Tick Data Storage Sizing

- L1 (50-100 bytes/tick): 1M ticks/day = 50-100 MB, 100M ticks/day = 5-10 GB.
- L2 (500-1000 bytes/tick): 1M ticks/day = 500 MB-1 GB, 100M ticks/day = 50-100 GB.
- 1 year compressed: ~100-400 GB (L1), ~1-4 TB (L2).

---

## Network & Transport

### Kernel Bypass Technologies

| Technology | Type | Latency | Use Case |
|-----------|------|---------|----------|
| DPDK | Full kernel bypass | <5 us | Dedicated NIC HFT |
| AF_XDP | Partial bypass | 5-20 us | Linux fast path |
| io_uring | I/O bypass | 10-50 us | Mixed workloads |
| RDMA | Memory bypass | <2 us | Special hardware |

### CAS (Compare-And-Swap) Performance

- **Without CAS retry: 80% writes lost at 5 agents.** ReadModifyWrite with exponential backoff + jitter (5 retries) is mandatory.
- **CAS exhaustion can orphan resources** -- created but not registered in state, billing leak.

### WebSocket Best Practices (Trading)

- Exponential backoff reconnection (1s, 2s, 4s, max 30s).
- Heartbeat every 15-30 sec. Binance: forced disconnect every 24h (public), 1h (private).
- State recovery: resync order book snapshot on reconnect.
- Dual WebSocket (primary + backup) for redundancy.
- **Block trading on stale data** -- stale data trading = catastrophe.

---

## Low-Latency Architecture

### LMAX Disruptor Pattern

- **Pre-allocated ring buffer** (size = power of two for fast modulus).
- **>6M transactions/sec** in production (LMAX Exchange).
- **3 orders of magnitude lower latency** than queue-based approach in 3-stage pipeline.
- **8x higher throughput** at same configuration.

### Lock-Free Data Structures

- Wait-free, zero-copy message passing with explicit acquire/release semantics.
- Monotonic arena allocators -- eliminate heap contention.
- Padded structs to avoid **false sharing** (cache line = 64 bytes).

### CPU Pinning & NUMA Awareness

- **CPU pinning** = consistent cache locality, data stays in L1/L2.
- **Isolcpus** -- dedicate cores exclusively for latency-critical application.
- **NUMA awareness:** partition data across NUMA nodes + pin threads to local data. Remote memory access via interconnect adds latency.

### Zero-Copy Networking

- **SBE (Simple Binary Encoding):** ~25ns encode/decode, 16-25x faster than Protobuf. Used by CME, Eurex, LSE, NASDAQ, Binance.
- **Principle:** structure in memory = structure on wire (true zero-copy).

### Monolith vs Microservices for Critical Path

- **Function call = nanoseconds, service call = milliseconds (1,000,000x difference).**
- **Stateless monolith handles 100,000 RPS.**
- **Hybrid approach:** critical path = monolithic core; auxiliary services = microservices.

### Rust vs C++ (Trading)

- **Rust FIX engine: 12-15% higher throughput, 30-40% lower tail latency (P99.9)** vs C++.
- **C++ for extreme HFT (nanoseconds); Rust for new systems where memory safety matters.**

---

## Message Queue Performance

| System | Latency | Throughput | Best For |
|--------|---------|------------|----------|
| Chronicle Queue | <1 us (IPC) | Millions/sec | Single-machine HFT, replay |
| LMAX Disruptor | ~1 us (inter-thread) | ~100M msg/sec | Inter-thread communication |
| Aeron | 18-29 us (bare metal) | >100M msg/sec | Network messaging |
| ZeroMQ | 10-100 us | Millions/sec | Direct socket-to-socket |
| NATS JetStream | 100-500 us | Millions/sec | Microservices, event sourcing |
| Kafka | 1-10 ms | Millions/sec | Audit trail, replay, compliance |

---

## Scalability

### Infrastructure Tiers (Trading)

| Budget | Infrastructure | Expected Latency |
|--------|---------------|-----------------|
| $0-200/mo | AWS VPS (Tokyo) | 5-10 ms to exchange |
| $200-2K/mo | AWS Dedicated | ~4 ms (co-located) |
| $2K-20K/mo | Bare metal (Beeks) | <1 ms |
| $20K+/mo | Equinix colocation | <10 us wire-to-wire |

### Bare Metal vs Cloud

- **Bare metal: 20-30% lower latency, zero jitter, up to 76% cheaper** at constant load vs AWS.
- **AWS sufficient for crypto mid-frequency (100ms+).** Bare metal only needed for HFT (<1ms).
- **AWS Aeron:** P99 = 39us at 1M msg/sec.

### Vectorized vs Event-Driven Backtesting

- Vectorized (VectorBT): **<1 second** for 500 tickers, 10 years. **1000+ variations simultaneously.**
- Event-driven: **15-30 minutes** for same test, but higher fill realism.
- **Recommended workflow:** VectorBT scan 10K variations -> top 50 -> NautilusTrader event-driven validation -> top 3 -> paper trading.

### Provisioning Rate Limits

- Provisioning rate limits mandatory: max 10/day, 1/10min, hard cap 2x target pool size.
- Without limits: **$1,440+/night from runaway healing loop.**

---

## Resource Usage Patterns

### Disk I/O Anti-Patterns

- **Unison/sync log grew to 146 GB in 2 weeks.** Root cause: verbose logging + launchd stdout redirect + `log=true` + duplicate LaunchAgents. Fix: `-silent`, stdout->`/dev/null`, `log = false`.
- **Xcode DeviceSupport + CoreSimulator bloat: 18.5 GB** accumulated silently. Safe to delete periodically.

### Memory Patterns

- **eBPF: unnecessary atomic on per-CPU map.** `__sync_fetch_and_add()` on PERCPU_ARRAY has no cross-CPU contention. Simple `(*val)++` suffices.
- **Python asyncio + run_in_executor: memory leak after 7-17 hours.** Monitoring with tracemalloc + auto-restart watchdog.
- **URL.Query() allocation in hot path (Go)** -- replaced with `strings.Count(RawQuery, "&")` for simple counting.

### CPU Patterns

- **Per-packet processing at 1 Gbps = 78% CPU.** Switching to per-flow (every 16 packets) = **5% CPU.**
- **CPU pinning + isolcpus** for trading: data stays in L1/L2, scheduler does not move threads between cores.
- **Go GC: low pause** but not zero -- unsuitable for nanosecond-sensitive HFT, fine for microsecond-level work.

---

## Anti-Patterns (Performance Killers)

### crypto/rand on Hot Path

**Problem:** `crypto/rand.Read()` calls OS entropy pool (getrandom syscall). At 1 Gbps, this creates a bottleneck at **~175 pkt/s (5.7ms per packet)**.
**Fix:** ChaCha8 PRNG seeded from HMAC -- cryptographically strong, stdlib, orders of magnitude faster (~500ns).

### Per-Packet vs Per-Flow Processing

**Problem:** Per-packet inference at high throughput saturates CPU (78% at 1Gbps).

### Context Buffer with UDP Packet Loss

**Problem:** Context buffer desyncs when any packet is lost (5-10% on mobile/satellite). Loss of one packet breaks all subsequent transforms.
**Fix:** Counter-based stateless sync via `HMAC(secret, counter)`. Both sides compute independently from plaintext counter.

### Duplicate LaunchAgents (Double I/O)

**Problem:** Two LaunchAgents doing same sync = double disk I/O. Combined with verbose logging: 146 GB in 2 weeks.
**Fix:** Single agent, `-silent` flag, stdout->`/dev/null`, `log = false`.

### Unnecessary Atomic on Per-CPU Map (eBPF)

**Problem:** `__sync_fetch_and_add()` on PERCPU_ARRAY. Per-CPU maps have no cross-CPU contention.
**Fix:** Simple `(*val)++`.

### URL.Query() Allocation in Hot Path (Go)

**Problem:** `URL.Query()` allocates a new map on every call.
**Fix:** `strings.Count(RawQuery, "&")` for simple counting.

### CAS Without Retry (Shared State)

**Problem:** Plain `Write()` fails on conflict. At 5 agents, 4/5 writes lost every cycle.
**Fix:** ReadModifyWrite with exponential backoff + jitter (5 retries). `If-None-Match: *` for first write.

### Thundering Herd (Healing/Provisioning)

**Problem:** N agents simultaneously heal = N new resources instead of 1 (Nx cost).
**Fix:** Leader election + healing cooldown. Create only 1 resource per heal cycle.

### OOM from Attention Quadratic Scaling

**Problem:** bs=512, seq=512, 6-layer transformer on A100 40GB = OOM. Attention = O(bs * heads * seq^2).
**Fix:** Reduce batch size to sweet spot (bs=128 for 5M params). On 8GB Mac: MAX_SEQ_LEN=256 + bs=16.

### Float for Money

**Problem:** `0.1 + 0.2 = 0.30000000000000004`. Decimal point error can cause $250K loss.
**Fix:** ONLY Decimal/BigNumber. NEVER float/double for monetary values.

### N+1 Queries

**Problem:** Paginated search without eager loading = N+1 query pattern.
**Fix:** Use `selectinload` / `joinedload` for related objects.

### Backtest-to-Live Performance Gap

**Problem:** Sharpe falls 30-50%, Win Rate -10-20pp when going from backtest to live trading.
**Root causes:** Lookahead bias, survivorship bias (+2.1% yearly inflation), overfitting, zero-commission assumption, slippage not modeled.

### Static Obfuscation Parameters = Fingerprint

### Architecture Overlay (File Growth)

**Problem:** File grows >30% from "audit fixes" = overlay. Development complexity increases.
**Fix:** Changes go into root formulas, not wrappers on top. If file doubled from fixes = overlay, decompose.

### Circular Evaluation Inflates Metrics

**Problem:** Training and evaluation on same data inflated metrics to 100%.
**Fix:** Real train/test split. Never evaluate on training data.

---

## Optimization Strategies Summary

### When to Use What

| Scenario | Optimization |
|----------|-------------|
| <5K param model, hot path | INT8 quantization + go:embed + L1 cache |
| High-throughput packet processing | Per-flow (not per-packet) decisions |
| Random bytes on hot path | ChaCha8 PRNG, not crypto/rand |
| UDP-based stateless sync | Counter-based HMAC, not context buffer |
| Time-series DB for tick data | QuestDB (25ms query, 959K rows/sec) |
| Trading critical path | Monolith core + microservice auxiliaries |
| Inter-thread messaging (HFT) | LMAX Disruptor (>6M TPS) |
| Binary encoding (HFT) | SBE (~25ns, true zero-copy) |
| Backtesting scan (1000+ variants) | VectorBT (vectorized, <1s) |
| Voice AI pipeline | Cartesia Sonic TTS (40-90ms TTFA) |
| macOS disk I/O | Single LaunchAgent + `-silent` + `log=false` |
| eBPF per-CPU counters | Simple increment, no atomics |
