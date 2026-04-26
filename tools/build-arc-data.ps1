param(
  [string]$BaseUrl = "https://thearcraiders.wiki",
  [string]$OutFile = "arc-data.generated.js"
)

$ErrorActionPreference = "Stop"

function HtmlDecode([string]$value) {
  if ($null -eq $value) { return "" }
  $clean = $value -replace "<!-- -->", ""
  $clean = $clean -replace "\\u0026", "&"
  return [System.Net.WebUtility]::HtmlDecode($clean).Trim()
}

function Slugify([string]$value) {
  $slug = $value.ToLowerInvariant()
  $slug = $slug -replace "'", ""
  $slug = $slug -replace "[^a-z0-9]+", "-"
  return $slug.Trim("-")
}

function Fetch([string]$url) {
  Start-Sleep -Milliseconds 150
  return (Invoke-WebRequest -Uri $url -UseBasicParsing).Content
}

function FirstMatch([string]$text, [string]$pattern, [int]$group = 1) {
  $match = [regex]::Match($text, $pattern, "Singleline")
  if ($match.Success) { return (HtmlDecode ($match.Groups[$group].Value)) }
  return $null
}

Write-Host "Fetching weapon catalog..."
$catalog = Fetch "$BaseUrl/weapons"
$weaponLinks = [ordered]@{}
[regex]::Matches($catalog, 'href="/weapons/([^"]+)".*?<h3[^>]*>([^<]+)</h3>', "Singleline") | ForEach-Object {
  $slug = $_.Groups[1].Value
  $name = HtmlDecode ($_.Groups[2].Value)
  if (-not $weaponLinks.Contains($slug)) {
    $weaponLinks[$slug] = $name
  }
}

$weapons = @()
foreach ($slug in $weaponLinks.Keys) {
  $url = "$BaseUrl/weapons/$slug"
  Write-Host "Fetching $slug..."
  $html = Fetch $url
  if ($html -notmatch "CRAFTING RECIPE") { continue }

  $name = FirstMatch $html '<h1[^>]*>([^<]+)</h1>'
  if (-not $name) { $name = $weaponLinks[$slug] }
  $rarity = FirstMatch $html '<span class="font-mono text-sm text-rarity-[^"]+">([^<]+)</span>'
  $type = FirstMatch $html '<div class="font-mono text-sm text-(?:rust|amber) mb-4">([^<]+)</div>'
  $description = FirstMatch $html '<p class="text-ash leading-relaxed mb-[^"]*">(.+?)</p>'
  $image = FirstMatch $html '"image":"([^"]+)"'

  $craftIndex = $html.IndexOf("Materials Needed")
  $section = if ($craftIndex -ge 0) { $html.Substring($craftIndex, [Math]::Min(20000, $html.Length - $craftIndex)) } else { $html }

  $benchMatches = [regex]::Matches($section, 'href="/hideout/([^"]+)"[^>]*>([^<]+)</a>') |
    ForEach-Object { HtmlDecode ($_.Groups[2].Value) } |
    Select-Object -Unique
  $bench = @($benchMatches)

  $levelRaw = FirstMatch $section 'Level:\s*</span><span[^>]*>(\d+)</span>'
  $level = if ($levelRaw) { [int]$levelRaw } else { $null }
  $blueprint = FirstMatch $section 'href="/items/([^"]+-blueprint)"[^>]*>([^<]+)</a>' 2

  $materials = @()
  [regex]::Matches($section, 'href="/items/([^"#]+)"[^>]*>([^<]+)</a>.*?text-rarity-[^" ]+[^>]*>([^<]+)</span>.*?font-mono text-amber[^>]*>x<!-- -->(\d+)', "Singleline") | ForEach-Object {
    $matName = HtmlDecode ($_.Groups[2].Value)
    if ($matName -notmatch "Blueprint$") {
      $materials += [ordered]@{
        name = $matName
        slug = $_.Groups[1].Value
        rarity = HtmlDecode ($_.Groups[3].Value)
        qty = [int]$_.Groups[4].Value
      }
    }
  }

  $weapons += [ordered]@{
    id = $slug
    name = $name
    category = "Weapon"
    type = $type
    rarity = $rarity
    description = $description
    image = $image
    sourceUrl = $url
    bench = $bench
    level = $level
    blueprint = $blueprint
    materials = $materials
  }
}

Write-Host "Fetching item catalog..."
$itemsCatalog = Fetch "$BaseUrl/items"
$itemLinks = @()
[regex]::Matches($itemsCatalog, 'href="/items/([^"]+)".*?<h3[^>]*>([^<]+)</h3>.*?text-smoke uppercase">([^<]+)</span>.*?text-rarity-[^"]+">([^<]+)</span>', "Singleline") | ForEach-Object {
  $itemLinks += [ordered]@{
    slug = $_.Groups[1].Value
    name = HtmlDecode ($_.Groups[2].Value)
    type = HtmlDecode ($_.Groups[3].Value)
    rarity = HtmlDecode ($_.Groups[4].Value)
  }
}

$allowedItemTypes = @(
  "Quick Use",
  "Modification",
  "Ammunition",
  "Shield",
  "Augment",
  "Topside Material",
  "Refined Material"
)
$existingIds = @{}
foreach ($weapon in $weapons) {
  $existingIds[$weapon.id] = $true
}

foreach ($link in $itemLinks) {
  if ($allowedItemTypes -notcontains $link.type) { continue }
  if ($link.name -match "Blueprint$") { continue }
  if ($existingIds.ContainsKey($link.slug)) { continue }

  $url = "$BaseUrl/items/$($link.slug)"
  Write-Host "Fetching item $($link.slug)..."
  $html = Fetch $url
  if ($html -notmatch "CRAFTING RECIPE") { continue }

  $name = FirstMatch $html '<h1[^>]*>([^<]+)</h1>'
  if (-not $name) { $name = $link.name }
  $rarity = FirstMatch $html '<span class="font-mono text-sm text-rarity-[^"]+">([^<]+)</span>'
  if (-not $rarity) { $rarity = $link.rarity }
  $type = FirstMatch $html '<div class="font-mono text-sm text-(?:rust|amber) mb-4">([^<]+)</div>'
  if (-not $type) { $type = $link.type }
  $description = FirstMatch $html '<p class="text-ash leading-relaxed mb-[^"]*">(.+?)</p>'
  $image = FirstMatch $html '"image":"([^"]+)"'

  $craftIndex = $html.IndexOf("Materials Needed")
  $section = if ($craftIndex -ge 0) { $html.Substring($craftIndex, [Math]::Min(20000, $html.Length - $craftIndex)) } else { $html }

  $benchMatches = [regex]::Matches($section, 'href="/hideout/([^"]+)"[^>]*>([^<]+)</a>') |
    ForEach-Object { HtmlDecode ($_.Groups[2].Value) } |
    Select-Object -Unique
  $bench = @($benchMatches)

  $levelRaw = FirstMatch $section 'Level:\s*</span><span[^>]*>(\d+)</span>'
  $level = if ($levelRaw) { [int]$levelRaw } else { $null }
  $blueprint = FirstMatch $section 'href="/items/([^"]+-blueprint)"[^>]*>([^<]+)</a>' 2

  $materials = @()
  [regex]::Matches($section, 'href="/items/([^"#]+)"[^>]*>([^<]+)</a>.*?text-rarity-[^" ]+[^>]*>([^<]+)</span>.*?font-mono text-amber[^>]*>x<!-- -->(\d+)', "Singleline") | ForEach-Object {
    $matName = HtmlDecode ($_.Groups[2].Value)
    if ($matName -notmatch "Blueprint$") {
      $materials += [ordered]@{
        name = $matName
        slug = $_.Groups[1].Value
        rarity = HtmlDecode ($_.Groups[3].Value)
        qty = [int]$_.Groups[4].Value
      }
    }
  }

  if ($materials.Count -eq 0) { continue }

  $weapons += [ordered]@{
    id = "item-$($link.slug)"
    name = $name
    category = $type
    type = $type
    rarity = $rarity
    description = $description
    image = $image
    sourceUrl = $url
    bench = $bench
    level = $level
    blueprint = $blueprint
    materials = $materials
  }
}

$materialsByName = [ordered]@{}
foreach ($weapon in $weapons) {
  foreach ($material in $weapon.materials) {
    if (-not $materialsByName.Contains($material.name)) {
      $materialsByName[$material.name] = [ordered]@{
        slug = $material.slug
        rarity = $material.rarity
      }
    }
  }
}

$sourceHints = [ordered]@{
  "Metal Parts" = @("Recycle metal junk and low-tier weapons.", "Check industrial, garage, depot, and workshop loot.", "Common salvage from ARC/weapon recycling.")
  "Rubber Parts" = @("Recycle rubber-heavy junk and tactical scrap.", "Check vehicle, industrial, and utility loot spots.", "Often paired with Metal Parts for gun-part crafting.")
  "Plastic Parts" = @("Recycle plastic household junk and containers.", "Check residential, commercial, and office interiors.", "Useful filler material for utility crafts.")
  "Chemicals" = @("Loot medical, laboratory, utility, and cleaning supply containers.", "Recycle chemical junk and some grenades.", "Good target in hospitals, labs, and maintenance rooms.")
  "Fabric" = @("Loot residential, clothing, and luggage containers.", "Recycle cloth salvage and soft gear.", "Common in apartments, offices, and dorm-like spaces.")
  "Simple Gun Parts" = @("Loot weapon and raider containers.", "Recycle common weapons at Speranza.", "Craft or step up into Light, Medium, and Heavy Gun Parts.")
  "Light Gun Parts" = @("Used for pistols and SMGs.", "Craft from Simple Gun Parts plus Rubber Parts once unlocked.", "Can be bought from Celeste for assorted seeds when stocked.")
  "Medium Gun Parts" = @("Used for rifles, LMGs, sniper rifles, and Venator.", "Craft from Simple Gun Parts plus Rubber Parts once unlocked.", "Dropped by critical Bastion and Bombardier sources; also sold by Celeste when stocked.")
  "Heavy Gun Parts" = @("Used for heavy weapons, hand cannons, shotguns, and launchers.", "Craft from Simple Gun Parts plus Rubber Parts once unlocked.", "Dropped by critical Rocketeer sources; also sold by Celeste when stocked.")
  "Complex Gun Parts" = @("Used for legendary weapons like Aphelion, Equalizer, and Jupiter.", "Craft from Light, Medium, and Heavy Gun Parts once unlocked.", "Reported as a Queen drop and occasionally sold by Celeste.")
  "Mechanical Components" = @("Craft in the Refiner from Metal Parts and Rubber Parts.", "Found in Mechanical loot areas.", "Reported from Bastion, Bombardier, Leaper, and Shredder scavenging.")
  "Advanced Mechanical Components" = @("Craft in the Refiner from Steel Spring and Mechanical Components.", "Recycle higher-tier weapons and mechanical salvage.", "Prioritize mechanical/industrial loot routes.")
  "Electrical Components" = @("Craft or loot in electrical/technical containers.", "Recycle electronics such as radios, power cables, and analyzers.", "Look in offices, control rooms, communications, and utility sites.")
  "Advanced Electrical Components" = @("Craft from Electrical Components and Wires.", "Recycle rare electronics.", "Best routes are technical, electrical, and communications interiors.")
  "Mod Components" = @("Recycle weapon modifications.", "Loot weapon benches, armory-style rooms, and raider containers.", "Keep for higher-tier attachments.")
  "Duct Tape" = @("Common in utility, workshop, garage, and residential storage.", "Check shelves, toolboxes, and maintenance containers.", "Keep extra for attachment and utility crafting.")
  "Steel Spring" = @("Loot mechanical and industrial containers.", "Recycle springs/gears and mechanical junk.", "Used heavily in advanced mechanical crafting.")
  "Magnet" = @("Loot electrical, utility, and industrial containers.", "Recycle magnet/electronics junk.", "Also appears in Celeste trade loops through seed economy.")
  "Magnetic Accelerator" = @("Epic refined material for advanced weapons.", "Craft from Power Rod and Advanced Mechanical Components when available.", "Recycle some legendary or epic weapon outputs.")
  "Power Rod" = @("Epic refined electrical component.", "Craft/refine from advanced electrical materials when unlocked.", "Prioritize electrical and ARC-tech loot routes.")
  "Exodus Modules" = @("Epic topside material.", "Prioritize high-value containers, locked rooms, events, and dangerous POIs.", "Keep for advanced epic weapon crafts.")
  "ARC Powercell" = @("Loot ARC-tech containers and ARC salvage.", "Common power source material.", "Useful in energy, shield, and electrical crafts.")
  "Advanced ARC Powercell" = @("Higher-tier ARC power material.", "Target ARC-heavy routes and high-value ARC-tech loot.", "Recycle relevant ARC power salvage when safe.")
  "ARC Alloy" = @("Loot ARC salvage and ARC-tech containers.", "Recycle ARC metal salvage.", "Often appears after fighting ARC machines.")
  "ARC Circuitry" = @("Loot ARC electronics and technical containers.", "Recycle ARC circuitry salvage.", "Best from ARC-heavy and electrical routes.")
  "ARC Motion Core" = @("Loot ARC units and ARC-tech containers.", "Check event/high-value ARC areas.", "Keep for hideout and advanced crafts.")
  "Processor" = @("Loot office, control-room, communications, and electronics containers.", "Recycle computer/electronics salvage.", "High priority for traps and advanced utility items.")
  "Sensors" = @("Loot technical, security, and ARC/electronics containers.", "Recycle scanner or sensor salvage.", "Good in control towers, security rooms, and labs.")
  "Canister" = @("Loot utility, industrial, and storage containers.", "Recycle container/canister-style salvage.", "Used in smoke, gas, and flame utility crafts.")
  "Oil" = @("Loot industrial, vehicle, maintenance, and garage areas.", "Recycle mechanical fluid salvage.", "Useful for mechanical and explosive-adjacent crafting.")
  "Wires" = @("Loot electrical boxes, offices, and communications rooms.", "Recycle electronics, radios, cables, and technical junk.", "Keep a steady stack for electrical crafts.")
  "Voltage Converter" = @("Loot electrical, power, and communications containers.", "Recycle high-value electronics.", "Commonly needed for advanced electrical work.")
  "Explosive Compound" = @("Rare refined explosive material.", "Craft from Crude Explosives and related chemical materials.", "Loot military, security, and explosives containers.")
  "Crude Explosives" = @("Uncommon refined explosive material.", "Craft from Chemicals and explosive salvage.", "Loot military, utility, and blast-related containers.")
  "Antiseptic" = @("Loot medical containers, hospitals, clinics, and labs.", "Craft/refine from medical and chemical materials.", "Keep for healing item crafts.")
  "Durable Cloth" = @("Craft/refine from Fabric and related cloth salvage.", "Loot luggage, residential, and clothing-heavy containers.", "Used for higher-tier medical and utility recipes.")
  "Rope" = @("Loot utility, outdoor, industrial, and storage containers.", "Recycle rope or climbing salvage.", "Often useful for mobility and utility gear.")
  "Synthesized Fuel" = @("Rare fuel material from industrial and ARC-tech routes.", "Check high-value utility, vehicle, and event containers.", "Keep for advanced explosive/utility crafts.")
  "Speaker Component" = @("Loot electronics, entertainment, and communications containers.", "Recycle speaker/audio salvage.", "Look in residential, offices, and control rooms.")
  "Syringe" = @("Loot medical containers and clinics.", "Check hospitals, labs, and residential bathrooms.", "Keep for healing crafts.")
  "Battery" = @("Loot electrical, household, and utility containers.", "Recycle battery/power-bank salvage.", "Check offices, residential interiors, and technical rooms.")
  "Great Mullein" = @("Nature material found while scavenging outdoor and overgrown areas.", "Check vegetation, garden, and wilderness-adjacent loot routes.", "Keep for healing and medical-adjacent crafts.")
  "Moss" = @("Nature material from damp, outdoor, or overgrown routes.", "Check green spaces, ruins, and vegetation-heavy POIs.", "Useful for medical and survival crafts.")
  "Apricot" = @("Nature/food item from residential, market, and garden-style loot.", "Check kitchens, food containers, and outdoor produce spots.", "Useful in consumable crafting chains.")
  "Lemon" = @("Nature/food item from residential, kitchen, and market containers.", "Check food storage, apartments, and produce-heavy locations.", "Keep a few for consumable recipes.")
  "Prickly Pear" = @("Common nature item from outdoor and dry vegetation routes.", "Check wilderness edges, plants, and produce containers.", "Used in basic consumable crafting.")
  "Pop Trigger" = @("Common trigger component from explosive or mechanical salvage.", "Recycle relevant trigger/trap junk when found.", "Check utility, security, and workshop containers.")
  "Blaze Grenade" = @("Can be crafted or found as quick-use loot.", "Check explosives, military, and high-value utility containers.", "Use spare crafted copies directly when another recipe asks for one.")
  "Matriarch Reactor" = @("Legendary reactor tied to Matriarch-level ARC encounters.", "Treat as high-risk boss/event loot.", "Extract only when the route is secure.")
  "Queen Reactor" = @("Legendary reactor tied to Queen-level ARC encounters.", "Treat as high-risk boss/event loot.", "Used for top-end energy weapons.")
}

$materialSources = [ordered]@{}
foreach ($name in $materialsByName.Keys) {
  $entry = $materialsByName[$name]
  $hints = if ($sourceHints.Contains($name)) { $sourceHints[$name] } else { @("Check the linked wiki page for current drops, traders, and recycling sources.", "Prioritize containers matching the item's category and rarity.") }
  $materialSources[$name] = [ordered]@{
    slug = $entry.slug
    rarity = $entry.rarity
    sourceUrl = "$BaseUrl/items/$($entry.slug)"
    hints = $hints
  }
}

$data = [ordered]@{
  generatedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
  sources = @(
    [ordered]@{ name = "ARC Raiders Wiki weapons"; url = "$BaseUrl/weapons" },
    [ordered]@{ name = "ARC Raiders Wiki items"; url = "$BaseUrl/items" },
    [ordered]@{ name = "ArcYield loot database"; url = "https://arcyield.com/" },
    [ordered]@{ name = "Arc Raiders Atlas item database"; url = "https://www.arcraidersatlas.com/items" }
  )
  notes = @(
    "Recipes were scraped from current community wiki weapon pages.",
    "Material source hints combine wiki item pages, public database notes, and practical loot-category routing.",
    "Patch balance and loot tables can change; source links are included for checking the latest exact page."
  )
  craftables = $weapons
  materialSources = $materialSources
}

$json = $data | ConvertTo-Json -Depth 12
$js = "window.ARC_DATA = $json;"
Set-Content -Path $OutFile -Value $js -Encoding UTF8
Write-Host "Wrote $OutFile with $($weapons.Count) craftables and $($materialSources.Count) material entries."
