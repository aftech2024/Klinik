#!/usr/bin/env bash
# smoke.sh — run from clinic-api/ directory
# Starts API if not running, runs curl smoke tests, exits 0 on pass.

set -euo pipefail

API="http://localhost:3001"
STARTED=0

# ── Start API if not already up ──────────────────────────────────────────────
if ! curl -sf "$API/api/branches" > /dev/null 2>&1; then
  echo "[smoke] Starting clinic-api..."
  npm run start:prod &
  API_PID=$!
  STARTED=1
  for i in $(seq 1 30); do
    curl -sf "$API/api/branches" > /dev/null 2>&1 && break
    sleep 1
  done
  if ! curl -sf "$API/api/branches" > /dev/null 2>&1; then
    echo "[smoke] ERROR: API did not start in 30s"
    kill $API_PID 2>/dev/null || true
    exit 1
  fi
  echo "[smoke] API up."
fi

# ── Helpers ───────────────────────────────────────────────────────────────────
PASS=0; FAIL=0
check() {
  local desc="$1"; local url="$2"; local expect_code="${3:-200}"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$code" = "$expect_code" ]; then
    echo "[smoke] PASS  $desc ($code)"
    PASS=$((PASS+1))
  else
    echo "[smoke] FAIL  $desc — expected $expect_code, got $code  ($url)"
    FAIL=$((FAIL+1))
  fi
}

check_json() {
  local desc="$1"; local url="$2"; local jq_path="$3"
  local result
  result=$(curl -sf "$url" 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(eval(\"d$jq_path\"))" 2>/dev/null || echo "ERROR")
  if [ "$result" = "ERROR" ] || [ -z "$result" ]; then
    echo "[smoke] FAIL  $desc — bad JSON or missing field $jq_path"
    FAIL=$((FAIL+1))
  else
    echo "[smoke] PASS  $desc → $result"
    PASS=$((PASS+1))
  fi
}

# ── Auth: register + login ────────────────────────────────────────────────────
TS=$(date +%s)
REG=$(curl -s -X POST "$API/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Smoke User\",\"email\":\"smoke$TS@test.com\",\"password\":\"Test1234!\"}")
TOKEN=$(echo "$REG" | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "[smoke] FAIL  register/login — no accessToken"
  FAIL=$((FAIL+1))
else
  echo "[smoke] PASS  register → accessToken obtained"
  PASS=$((PASS+1))
fi

AUTH_HEADER=""
[ -n "$TOKEN" ] && AUTH_HEADER="-H Authorization: Bearer $TOKEN"

# ── Public endpoints ──────────────────────────────────────────────────────────
check "GET /api/branches"   "$API/api/branches"
check "GET /api/doctors"    "$API/api/doctors"
check "GET /api/services"   "$API/api/services"
check "GET /api/articles"   "$API/api/articles"
check "GET /api/promotions" "$API/api/promotions"

check_json "branches[0].name exists"  "$API/api/branches"  "[0]['name']"
check_json "doctors[0].specialty exists" "$API/api/doctors"  "[0]['specialty']"

# ── Protected: 401 without token ─────────────────────────────────────────────
check "GET /api/patients (no auth) → 401" "$API/api/patients" "401"
check "GET /api/billing (no auth) → 401"  "$API/api/billing"  "401"

# ── Protected with token ──────────────────────────────────────────────────────
if [ -n "$TOKEN" ]; then
  CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $TOKEN" "$API/api/notifications")
  if [ "$CODE" = "200" ]; then
    echo "[smoke] PASS  GET /api/notifications (authed) → 200"
    PASS=$((PASS+1))
  else
    echo "[smoke] FAIL  GET /api/notifications (authed) → $CODE"
    FAIL=$((FAIL+1))
  fi
fi

# ── Reports (admin-only, 403 with PATIENT token is fine) ─────────────────────
check "GET /api/reports/dashboard (no auth) → 401" "$API/api/reports/dashboard" "401"

# ── Result ────────────────────────────────────────────────────────────────────
echo ""
echo "[smoke] ─────────────────────────────────────────"
echo "[smoke] PASS: $PASS   FAIL: $FAIL"

[ "$STARTED" = "1" ] && kill $API_PID 2>/dev/null || true

[ "$FAIL" = "0" ]
