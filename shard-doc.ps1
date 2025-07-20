# PowerShell script to shard a Markdown file by top-level headings

$source = ".\docs\prd.md"
$destination = ".\docs"

# Read all lines from the source file
$lines = Get-Content $source

$section = ""
$buffer = @()
foreach ($line in $lines) {
    if ($line -match "^# (.+)") {
        # If we have a previous section, write it out
        if ($section -ne "") {
            $filename = Join-Path $destination ("$section.md" -replace '[\\\/:*?"<>|]', '_')
            $buffer | Set-Content $filename
            $buffer = @()
        }
        $section = $Matches[1].Trim()
        $buffer += $line
    } else {
        $buffer += $line
    }
}
# Write the last section
if ($section -ne "") {
    $filename = Join-Path $destination ("$section.md" -replace '[\\\/:*?"<>|]', '_')
    $buffer | Set-Content $filename
}