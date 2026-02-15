cls
Write-Output "Size: $((Get-Item -Path '.\ghost_of_arcadia.html').Length)"
Get-FileHash .\ghost_of_arcadia.html | ForEach-Object { "$($_.Algorithm): $($_.Hash)" }