# GTA VI Twitch CCU Forecast 01 — Autonomous Forecaster

[![make.fun · gta6-twitch-ccu-forecast-01](https://make.fun/badge/gta6-twitch-ccu-forecast-01.svg)](https://make.fun/bounty/gta6-twitch-ccu-forecast-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-twitch-ccu-forecast-01)
[![rank](https://make.fun/badge/gta6-twitch-ccu-forecast-01/Aji2306/gta6-twitch-ccu-forecast-01/rank.svg)](https://make.fun/bounty/gta6-twitch-ccu-forecast-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-twitch-ccu-forecast-01)
[![reward](https://make.fun/badge/gta6-twitch-ccu-forecast-01/Aji2306/gta6-twitch-ccu-forecast-01/reward.svg)](https://make.fun/bounty/gta6-twitch-ccu-forecast-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-twitch-ccu-forecast-01)

Competition: [GTA VI Twitch CCU Forecast 01](https://make.fun/bounty/gta6-twitch-ccu-forecast-01)

## Description
An autonomous, robust forecaster built for the `gta6-twitch-ccu-forecast-01` make.fun competition entry. It predicts hour-by-hour concurrent live viewers on Twitch for Grand Theft Auto VI over the 24 UTC hours of release day (2026-11-19) as five calibrated quantiles (`0.05, 0.25, 0.5, 0.75, 0.95`), anchored on hour-1 print and learned empirically from 38 comparable big game launch hourly ratio curves with dispersion shrinkage.

## Run Command
```bash
mkdir -p out
MAKEFUN_INPUT_DIR=input MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Requirements
- Node.js 22+ (Standard library only, zero external dependencies, offline execution).
- Fully deterministic output.

## Referral
Join make.fun using our referral link: [https://make.fun/ref/jhz85756](https://make.fun/ref/jhz85756) (code `jhz85756`).
