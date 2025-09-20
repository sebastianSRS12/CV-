# Backup and Restore Guide

This document explains how to create and manage backups of your CV Builder project using Git.

## Creating a Backup

### Using PowerShell (Recommended)
1. Run the backup script:
   ```powershell
   .\Backup.ps1
   ```
   This will:
   - Create a new branch named `backup/YYYYMMDD-HHMMSS`
   - Commit all current changes
   - Push to the remote repository
   - Return to your previous branch

### Manual Backup
```bash
git checkout -b backup/$(date +%Y%m%d-%H%M%S)
git add .
git commit -m "Backup: $(date +'%Y-%m-%d %H:%M:%S')"
git push -u origin HEAD
git checkout -
```

## Listing Available Backups

```bash
git branch -a | grep "backup/"
```

## Restoring a Backup

1. Find the backup branch you want to restore:
   ```bash
   git branch -a | grep "backup/"
   ```

2. Create a new branch from the backup:
   ```bash
   git checkout -b restored-backup backup/20250920-015005
   ```

3. If you want to make this your new main branch:
   ```bash
   git checkout -b new-main
   git push -u origin new-main
   ```

## Important Notes

1. **Always create a backup before making major changes**
2. Backup branches are automatically pushed to the remote repository
3. To save space, you can delete old backup branches:
   ```bash
   # Delete local backup branch
   git branch -d backup/OLD_BACKUP_DATE
   
   # Delete remote backup branch
   git push origin --delete backup/OLD_BACKUP_DATE
   ```

## Troubleshooting

- If you get permission errors, ensure you have the correct access rights
- If you can't find your backup, check all branches:
  ```bash
  git fetch --all
  git branch -a
  ```

## Backup Script (Backup.ps1)

```powershell
# Backup.ps1
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$branchName = "backup/$timestamp"

git checkout -b $branchName
git add .
git commit -m "Backup: $timestamp"
git push -u origin $branchName
git checkout -

Write-Host "✅ Backup created in branch: $branchName"
```

## Rollback Script (Rollback.ps1)

```powershell
# Rollback.ps1
Write-Host "Available backup branches:"
git branch -a | Select-String "backup/"

$branchToRestore = Read-Host "Enter backup branch to restore (e.g., backup/20250920-204523)"
git checkout -b "restored-$branchToRestore" $branchToRestore
Write-Host "✅ Restored backup to branch: restored-$branchToRestore"
```

---
