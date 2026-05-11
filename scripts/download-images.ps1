Set-Location "C:\DEV\ersatzteile"
$imgDir = "public\images"
if (-not (Test-Path $imgDir)) { New-Item -ItemType Directory -Path $imgDir | Out-Null }

$headers = @{ "User-Agent" = "ErsatzteileBot/1.0 (tractor-parts-catalog; educational)" }

$groups = @(
  [pscustomobject]@{ local="oil-filter.jpg";        parts="filter-oil";                                                                                                              cands="Engine_oil_filter.JPG,Bosch_Oil_Filter.JPG,Oilfilter01.jpg" },
  [pscustomobject]@{ local="fuel-filter.jpg";       parts="filter-fuel,inj-water-separator";                                                                                        cands="Fuel_filter.jpg,Kraftstofffilter.jpg" },
  [pscustomobject]@{ local="air-filter.jpg";        parts="filter-air-main,filter-air-safety";                                                                                      cands="CALEPH_Truck_Air_Filters.jpg,Air_filter_element.jpg,Air-filter.jpg" },
  [pscustomobject]@{ local="hydraulic-filter.jpg";  parts="filter-hydraulic,filter-gearbox";                                                                                        cands="Hydraulic_filter.jpg,Ölfilter.jpg,Oil_filter.jpg" },
  [pscustomobject]@{ local="water-pump.jpg";        parts="cooling-water-pump";                                                                                                     cands="Water_pump_1.jpg,Water_pump.jpg" },
  [pscustomobject]@{ local="thermostat.jpg";        parts="cooling-thermostat,cooling-radiator-cap,cooling-temp-sensor";                                                            cands="Thermostat_automobile.jpg,Car_thermostat.jpg,Thermostat_valve.jpg" },
  [pscustomobject]@{ local="v-belt.jpg";            parts="cooling-belt";                                                                                                           cands="Keilriemen.jpg,V_belt.jpg,V-belt.jpg,Fan_belt.jpg" },
  [pscustomobject]@{ local="radiator-hose.jpg";     parts="cooling-hose-top,cooling-hose-bottom";                                                                                   cands="Radiator_hose.jpg,Coolant_hose.jpg,Kühlerschlauch.jpg" },
  [pscustomobject]@{ local="hose-clamp.jpg";        parts="cooling-clamps";                                                                                                         cands="Hose_clamp.jpg,Schlauchschelle.jpg,Hose_clip.jpg" },
  [pscustomobject]@{ local="ball-joint.jpg";        parts="base-ball-joint";                                                                                                        cands="Tie_rod_end.jpg,Ball_joint_with_stud.jpg,Spurstangenkopf.jpg" },
  [pscustomobject]@{ local="hydraulic-pump.jpg";    parts="base-hydraulic-pump";                                                                                                    cands="Hydraulic_gear_pump.jpg,Zahnradpumpe.jpg,Gear_pump.jpg,Hydraulikpumpe.jpg" },
  [pscustomobject]@{ local="tractor-tyre.jpg";      parts="base-tyre-rear,base-tyre-front,tyre-tube-rear,tyre-tube-front,tyre-valves,tyre-repair-kit,tyre-patches,tyre-levers,tyre-pressure-gauge"; cands="Tractor_tyres.jpg,Tractor_tires.jpg,Agricultural_tire.jpg" },
  [pscustomobject]@{ local="seeder.jpg";            parts="base-seeder";                                                                                                            cands="Seed_drill.jpg,Sämaschine.jpg,Grain_drill.jpg,Precision_seeder.jpg" },
  [pscustomobject]@{ local="wheel-bearing.jpg";     parts="axle-wheel-bearing,clutch-release-bearing,clutch-pilot-bearing";                                                        cands="Tapered_roller_bearing.jpg,Wheel_bearing.jpg,Ball_bearing.jpg" },
  [pscustomobject]@{ local="oil-seal.jpg";          parts="axle-shaft-seal,clutch-shaft-seal,pto-seal,inj-pump-seal";                                                              cands="Oil_seal.jpg,Wellendichtring.jpg,Radial_shaft_seal.jpg,Simmerring.jpg" },
  [pscustomobject]@{ local="o-ring.jpg";            parts="hyd-o-rings,hyd-copper-rings,inj-copper-rings,axle-bellows";                                                            cands="O-Ring.jpg,O_ring.jpg,O-ring_assortment.jpg" },
  [pscustomobject]@{ local="universal-joint.jpg";   parts="axle-universal-joint,pto-universal-joint";                                                                              cands="Universal_joint.jpg,Kardangelenk.jpg,Cardan_joint.jpg" },
  [pscustomobject]@{ local="hydraulic-seals.jpg";   parts="hyd-seal-loader,hyd-seal-steering,hyd-seal-valve,hyd-hoses,hyd-quick-couplers";                                        cands="Hydraulic_seal.jpg,Hydraulic_cylinder_seal.jpg,Hydraulikdichtung.jpg" },
  [pscustomobject]@{ local="injector.jpg";          parts="inj-nozzle,inj-return-lines,inj-feed-pump";                                                                             cands="Diesel_injector.jpg,Fuel_injector.jpg,Einspritzdüse.jpg,Injector_nozzle.jpg" },
  [pscustomobject]@{ local="starter-motor.jpg";     parts="elec-starter";                                                                                                          cands="Anlasser.jpg,Starter_motor.jpg,Car_starter_motor.jpg,Electric_starter.jpg" },
  [pscustomobject]@{ local="alternator.jpg";        parts="elec-alternator";                                                                                                       cands="Alternator_1GE.jpg,Lichtmaschine.jpg,Car_alternator.jpg,Alternator.jpg" },
  [pscustomobject]@{ local="ignition-switch.jpg";   parts="elec-ignition";                                                                                                         cands="Ignition_switch.jpg,Zündschloss.jpg,Key_switch.jpg" },
  [pscustomobject]@{ local="fuses.jpg";             parts="elec-fuses,elec-fuse-holder,elec-wire,elec-terminals";                                                                  cands="Fuse_box.jpg,Automotive_fuses.jpg,Car_fuses.jpg,Sicherungskasten.jpg" },
  [pscustomobject]@{ local="led-light.jpg";         parts="elec-led-lights";                                                                                                       cands="LED_work_light.jpg,Work_light_LED.jpg,LED_floodlight.jpg,LED_Scheinwerfer.jpg" },
  [pscustomobject]@{ local="grease-gun.jpg";        parts="link-grease-gun,link-grease-cartridge,link-grease-nipples";                                                             cands="Grease_gun.jpg,Fettpresse.jpg,Grease_gun_with_cartridge.jpg,Greasing_gun.jpg" },
  [pscustomobject]@{ local="three-point-hitch.jpg"; parts="link-lower-pin,link-lower-ball,link-top-link,link-lift-rod,link-stabilizers";                                           cands="Three_point_hitch.jpg,Dreipunktaufhängung.jpg,Three-point_hitch.jpg" },
  [pscustomobject]@{ local="ploughshare.jpg";       parts="plough-share,plough-point,plough-landside,plough-mouldboard,plough-bolts,plough-shear-bolts";                           cands="Ploughshare.jpg,Pflugschar.jpg,Plowshare.jpg,Plow_share.jpg" },
  [pscustomobject]@{ local="kingpin.jpg";           parts="axle-kingpin";                                                                                                          cands="Kingpin.jpg,King_pin.jpg,Achsschenkelbolzen.jpg,Steering_knuckle_pin.jpg" },
  [pscustomobject]@{ local="clutch-cable.jpg";      parts="clutch-cable";                                                                                                          cands="Clutch_cable.jpg,Kupplungszug.jpg,Control_cable.jpg,Bowden_cable.jpg" },
  [pscustomobject]@{ local="pressure-gauge.jpg";    parts="hyd-manometer,tyre-pressure-gauge";                                                                                     cands="Bourdon_tube_pressure_gauge.jpg,Pressure_gauge.jpg,Manometer.jpg" },
  [pscustomobject]@{ local="safety-pins.jpg";       parts="link-linch-pins,link-split-pins,pto-shear-pins";                                                                        cands="Lynch_pin.jpg,Linchpin.jpg,Split_pin.jpg,Cotter_pin.jpg" }
)

$mapping = @{}

foreach ($g in $groups) {
  $localPath = "$imgDir\$($g.local)"

  if (Test-Path $localPath) {
    Write-Host "EXISTS  : $($g.local)"
    $g.parts.Split(',') | ForEach-Object { $mapping[$_.Trim()] = "/images/$($g.local)" }
    continue
  }

  $found = $false
  foreach ($cand in $g.cands.Split(',')) {
    $cand = $cand.Trim()
    $enc  = [uri]::EscapeDataString($cand)
    $apiUrl = "https://commons.wikimedia.org/w/api.php?action=query&titles=File:$enc&prop=imageinfo&iiprop=url&iiurlwidth=700&format=json"

    $res = $null
    try { $res = Invoke-RestMethod -Uri $apiUrl -Headers $headers -TimeoutSec 12 } catch {}
    Start-Sleep -Milliseconds 350

    if (-not $res) { continue }
    $page = $res.query.pages.PSObject.Properties.Value | Select-Object -First 1
    if (-not $page -or -not $page.imageinfo) { continue }

    $thumbUrl = $page.imageinfo[0].thumburl
    if (-not $thumbUrl) { continue }

    try {
      Invoke-WebRequest -Uri $thumbUrl -OutFile $localPath -Headers $headers -TimeoutSec 30
      $sizeKB = [math]::Round((Get-Item $localPath).Length / 1KB, 1)
      Write-Host "OK      : $($g.local)  ($sizeKB KB)  <-- $cand"
      $g.parts.Split(',') | ForEach-Object { $mapping[$_.Trim()] = "/images/$($g.local)" }
      $found = $true
      break
    } catch {
      Write-Host "DL-FAIL : $cand"
    }
    Start-Sleep -Milliseconds 200
  }

  if (-not $found) {
    Write-Host "MISSING : $($g.local)"
    $g.parts.Split(',') | ForEach-Object { $mapping[$_.Trim()] = $null }
  }
}

$mapping | ConvertTo-Json -Depth 2 | Set-Content "$imgDir\_mapping.json" -Encoding UTF8

$ok  = @($mapping.Values | Where-Object { $_ }).Count
$nok = @($mapping.Values | Where-Object { -not $_ }).Count
Write-Host ""
Write-Host "=== DONE: $ok mapped, $nok missing ==="
