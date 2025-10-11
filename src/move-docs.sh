#!/bin/bash

# Create docs directory
mkdir -p docs

# Move all documentation files to docs/ (keep README.md in root)
mv APP_STORE_GUIDE.md docs/ 2>/dev/null
mv APP_STORE_MONETIZATION_GUIDE.md docs/ 2>/dev/null
mv APP_STORE_SUBMISSION_GUIDE.md docs/ 2>/dev/null
mv Attributions.md docs/ 2>/dev/null
mv CHEAT_SHEET.md docs/ 2>/dev/null
mv COMPLETE_ICON_GUIDE.md docs/ 2>/dev/null
mv COST_CONTROL_CHEAT_SHEET.txt docs/ 2>/dev/null
mv DATA_LIMITS_GUIDE.md docs/ 2>/dev/null
mv DEPLOYMENT_CHECKLIST_PRINTABLE.txt docs/ 2>/dev/null
mv DEPLOYMENT_FLOWCHART.txt docs/ 2>/dev/null
mv DEPLOY_IOS_PWA_FIX.md docs/ 2>/dev/null
mv DEPLOY_NOW.md docs/ 2>/dev/null
mv DEPLOY_WITH_ICONS.md docs/ 2>/dev/null
mv FINAL_ICON_DEPLOYMENT.md docs/ 2>/dev/null
mv HOW_TO_INSTALL.md docs/ 2>/dev/null
mv ICONS_QUICK_START.txt docs/ 2>/dev/null
mv ICON_ASSET_CHEAT_SHEET.txt docs/ 2>/dev/null
mv IMPORTANT_UPDATE_WORKFLOW.md docs/ 2>/dev/null
mv IOS_PWA_INSTALL_GUIDE.md docs/ 2>/dev/null
mv IOS_PWA_QUICK_FIX.txt docs/ 2>/dev/null
mv IOS_STANDALONE_DEBUG.md docs/ 2>/dev/null
mv IOS_TROUBLESHOOTING.md docs/ 2>/dev/null
mv LAUNCH_CHECKLIST.md docs/ 2>/dev/null
mv MISSING_ICONS_TODO.txt docs/ 2>/dev/null
mv PAID_APP_SUMMARY.md docs/ 2>/dev/null
mv PUBLIC_FOLDER_BACKUP.md docs/ 2>/dev/null
mv PUSH_NOW.txt docs/ 2>/dev/null
mv PWA_ICONS_DEPLOYMENT.md docs/ 2>/dev/null
mv PWA_ICON_MAPPING.md docs/ 2>/dev/null
mv PWA_SETUP.md docs/ 2>/dev/null
mv QUICK_START.txt docs/ 2>/dev/null
mv README_DEPLOYMENT.md docs/ 2>/dev/null
mv SAFE_PUSH_GUIDE.md docs/ 2>/dev/null
mv START_HERE.md docs/ 2>/dev/null
mv TEST_DATA_LIMITS.md docs/ 2>/dev/null
mv USER_INSTALL_INSTRUCTIONS.md docs/ 2>/dev/null

echo "✅ All documentation files moved to /docs/"
echo "📄 README.md kept in root (standard practice)"
echo ""
echo "Next steps:"
echo "1. Review the /docs/ folder"
echo "2. Delete this script: rm move-docs.sh"
echo "3. Commit changes: git add . && git commit -m 'Organize docs into /docs folder'"
