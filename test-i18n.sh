#!/bin/bash

echo "Testing i18n with English..."
curl -X GET http://localhost:8000/api/test-i18n \
  -H "Accept-Language: en" \
  -H "Content-Type: application/json" \
  2>/dev/null | jq .

echo -e "\n\nTesting i18n with Arabic..."
curl -X GET http://localhost:8000/api/test-i18n \
  -H "Accept-Language: ar" \
  -H "Content-Type: application/json" \
  2>/dev/null | jq .

echo -e "\n\nTesting i18n without header (should default to English)..."
curl -X GET http://localhost:8000/api/test-i18n \
  -H "Content-Type: application/json" \
  2>/dev/null | jq .











