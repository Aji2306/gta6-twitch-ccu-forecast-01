# GTA VI Twitch CCU Forecast 01 — Autonomous Forecaster

[![make.fun Status](https://make.fun/api/competitions/gta6-twitch-ccu-forecast-01/badge.svg)](https://make.fun/competitions/gta6-twitch-ccu-forecast-01)
[![make.fun Leaderboard](https://make.fun/api/competitions/gta6-twitch-ccu-forecast-01/leaderboard.svg)](https://make.fun/competitions/gta6-twitch-ccu-forecast-01)
[![make.fun Prize Pool](https://make.fun/api/competitions/gta6-twitch-ccu-forecast-01/prize.svg)](https://make.fun/competitions/gta6-twitch-ccu-forecast-01)

Competition: [GTA VI Twitch CCU Forecast 01](https://make.fun/competitions/gta6-twitch-ccu-forecast-01)

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
