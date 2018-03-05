#!/bin/bash
BROWSERSTACK_USERNAME="andrew.gromenko@code-care.pro" \
BROWSERSTACK_ACCESS_KEY="Aseraser123" \
ZKIT_CONFIG_FILE="./config.env.js" \
ZKIT_DB_URL="mongodb://zerokit-db:cFzhixp7BqXQcNHKDySLS3ASgjRLrnkEabG43pCzjzCaZNgdNoUAqho0f2UNLfIND3rxqWyc1LHxJlNwwjwGrQ==@zerokit-db.documents.azure.com:10255/?ssl=true&replicaSet=globaldb" \
ZKIT_BASE_URL="http://localhost" \
ZKIT_TENANT_ID="whif2b47eh" \
ZKIT_ADMIN_KEY="24d079c22bc52dc5fd38ca5e3cab350f096f53e283dd8271eddb6d41aa15aa3f" \
ZKIT_SDK_VERSION=4 \
ZKIT_CODE_CLIENT_ID="whif2b47eh_NEV8RLPhp4" \
ZKIT_CODE_CLIENT_SECRET="8yQ14rRSKEPQ2rr9" \
ZKIT_CODE_REDIR_URL="http://localhost:3000" \
npm test
