cls
Write-Output "File: ghost_of_arcadia.html"
Write-Output "Size: $((Get-Item -Path 'E:\Users\ivory\Documents\GitHub\Ghost\ghost_of_arcadia.html').Length)"
Get-FileHash E:\Users\ivory\Documents\GitHub\Ghost\ghost_of_arcadia.html | ForEach-Object { "$($_.Algorithm): $($_.Hash)" }
Write-Output ""
Write-Output "File: ghost_of_arcadia.css"
Write-Output "Size: $((Get-Item -Path 'E:\Users\ivory\Documents\GitHub\Ghost\ghost_of_arcadia.css').Length)"
Get-FileHash E:\Users\ivory\Documents\GitHub\Ghost\ghost_of_arcadia.css | ForEach-Object { "$($_.Algorithm): $($_.Hash)" }
Write-Output ""
Write-Output "File: translation.json"
Write-Output "Size: $((Get-Item -Path 'E:\Users\ivory\Documents\GitHub\Ghost\translation.json').Length)"
Get-FileHash E:\Users\ivory\Documents\GitHub\Ghost\translation.json | ForEach-Object { "$($_.Algorithm): $($_.Hash)" }