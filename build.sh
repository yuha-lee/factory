#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to show usage
show_usage() {
    echo -e "${BLUE}Usage:${NC}"
    echo "  ./build.sh <tenant> [build_type]"
    echo "  ./build.sh --list"
    echo ""
    echo -e "${BLUE}Examples:${NC}"
    echo "  ./build.sh tenantA           # Debug build for tenantA"
    echo "  ./build.sh tenantA debug     # Debug build for tenantA" 
    echo "  ./build.sh tenantA release   # Release build for tenantA"
    echo "  ./build.sh --list           # List available tenants"
    echo ""
    echo -e "${BLUE}Available build types:${NC} debug, release"
}

# Function to list available tenants
list_tenants() {
    echo -e "${BLUE}Available tenants:${NC}"
    
    # Check if tenants.yaml exists
    if [[ ! -f "tenants.yaml" ]]; then
        echo -e "${YELLOW}No tenants.yaml found. Run sync-themes first:${NC}"
        echo "  npm run sync-themes"
        return 1
    fi
    
    # Parse YAML and extract tenant IDs
    grep "id:" tenants.yaml | sed 's/.*id: *\(.*\)/\1/' | while read -r tenant; do
        echo "  - $tenant"
    done
}

# Function to capitalize first letter (for task names)
capitalize() {
    echo "$1" | sed 's/^\(.\)/\U\1/'
}

# Check arguments
if [[ $# -eq 0 ]]; then
    show_usage
    exit 1
fi

# Handle --list option
if [[ "$1" == "--list" ]]; then
    list_tenants
    exit 0
fi

# Parse arguments
TENANT="$1"
BUILD_TYPE="${2:-debug}"

# Validate build type
if [[ "$BUILD_TYPE" != "debug" && "$BUILD_TYPE" != "release" ]]; then
    echo -e "${RED}Error: Invalid build type '$BUILD_TYPE'. Use 'debug' or 'release'.${NC}"
    exit 1
fi

# Validate tenant exists (if tenants.yaml is available)
if [[ -f "tenants.yaml" ]]; then
    if ! grep -q "id: *$TENANT" tenants.yaml; then
        echo -e "${YELLOW}Warning: Tenant '$TENANT' not found in tenants.yaml${NC}"
        echo "Available tenants:"
        list_tenants
        echo ""
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
fi

# Build task name (capitalize first letter)
CAPITALIZED_TENANT=$(capitalize "$TENANT")
if [[ "$BUILD_TYPE" == "debug" ]]; then
    TASK="install${CAPITALIZED_TENANT}Debug"
else
    TASK="install${CAPITALIZED_TENANT}Release"
fi

# Show build info
echo -e "${GREEN}Building Android app:${NC}"
echo "  Tenant: $TENANT"
echo "  Build Type: $BUILD_TYPE"
echo "  Task: $TASK"
echo ""

# Navigate to client directory and run build
cd client || {
    echo -e "${RED}Error: client directory not found${NC}"
    exit 1
}

echo -e "${BLUE}Starting build...${NC}"
npx react-native run-android --appIdSuffix "$TENANT" --tasks "$TASK"

# Check if build was successful
if [[ $? -eq 0 ]]; then
    echo -e "${GREEN}✅ Build completed successfully!${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi