#!/bin/bash

# Fuse16tt API Test Runner
# This script runs the Postman collection using Newman (Postman CLI)

echo "🚀 Fuse16tt API Test Runner"
echo "================================"
echo ""

# Check if Newman is installed
if ! command -v newman &> /dev/null
then
    echo "❌ Newman is not installed!"
    echo ""
    echo "Install Newman globally with:"
    echo "  npm install -g newman"
    echo ""
    echo "Or install with HTML reporter:"
    echo "  npm install -g newman newman-reporter-htmlextra"
    echo ""
    exit 1
fi

echo "✅ Newman found: $(newman --version)"
echo ""

# Check if services are running
echo "🔍 Checking if services are running..."
echo ""

# Check API Gateway (port 3000)
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ API Gateway (port 3000) - Running"
else
    echo "❌ API Gateway (port 3000) - Not running"
    echo "   Start with: cd backend/ApiGateway && npm run dev"
fi

# Check User Service (port 4000)
if curl -s http://localhost:4000 > /dev/null 2>&1; then
    echo "✅ User Service (port 4000) - Running"
else
    echo "❌ User Service (port 4000) - Not running"
    echo "   Start with: cd backend/UserService && npm run dev"
fi

# Check Article Service (port 7000)
if curl -s http://localhost:7000 > /dev/null 2>&1; then
    echo "✅ Article Service (port 7000) - Running"
else
    echo "❌ Article Service (port 7000) - Not running"
    echo "   Start with: cd backend/ArticleService && npm run dev"
fi

# Check Notification Service (port 8000)
if curl -s http://localhost:8000 > /dev/null 2>&1; then
    echo "✅ Notification Service (port 8000) - Running"
else
    echo "⚠️  Notification Service (port 8000) - Not running (optional)"
    echo "   Start with: cd backend/NotificationService && npm run dev"
fi

echo ""
echo "================================"
echo ""

# Prompt user to continue
read -p "Continue with tests? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Aborted."
    exit 0
fi

echo ""
echo "🧪 Running Postman Collection..."
echo ""

# Create reports directory
mkdir -p test-reports

# Get timestamp for report filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Run Newman with the collection
# Options:
#   -e: environment file
#   --bail: stop on first failure (remove to run all tests)
#   --timeout-request: request timeout in ms
#   --reporters: cli (console) and htmlextra (HTML report)

if command -v newman-reporter-htmlextra &> /dev/null
then
    echo "📊 Generating HTML report..."
    newman run Fuse16tt_API_Collection.postman_collection.json \
        -e Fuse16tt_Environment.postman_environment.json \
        --timeout-request 10000 \
        --reporters cli,htmlextra \
        --reporter-htmlextra-export "test-reports/report_${TIMESTAMP}.html" \
        --reporter-htmlextra-title "Fuse16tt API Test Report" \
        --reporter-htmlextra-logs
else
    echo "ℹ️  Running with CLI reporter only (install newman-reporter-htmlextra for HTML reports)"
    newman run Fuse16tt_API_Collection.postman_collection.json \
        -e Fuse16tt_Environment.postman_environment.json \
        --timeout-request 10000 \
        --reporters cli
fi

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All tests passed!"
    if command -v newman-reporter-htmlextra &> /dev/null
    then
        echo "📄 HTML Report: test-reports/report_${TIMESTAMP}.html"
    fi
else
    echo ""
    echo "❌ Some tests failed. Check the output above."
fi

echo ""
echo "================================"
echo "Test run completed at $(date)"
echo "================================"
