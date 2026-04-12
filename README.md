# CyberNews Aggregator

A High-Performance React News Aggregator built with Vite, React, and Google's Core Web Vitals (CWV) in mind. This project sources real-time data from the HackerNews API and demonstrates the difference between unoptimized and optimized technical strategies in modern web development.

## Project Structure

This project contains two distinct versions:

1. **`main` Branch (Optimized)**: The highly tuned variant showcasing parallel processing, list virtualization, selective imports, image optimization, and bundle chunking.
2. **`slow-version` Branch (Unoptimized)**: A deliberately poorly-performing baseline variant built with intentional anti-patterns to establish comparison metrics.

## Installation & Running Locally

### Optimized Version (main)
To run the optimized app efficiently locally:
1. `npm install`
2. `npm run dev`

### Slow Version (slow-version)
To observe the anti-patterns and performance bottlenecks:
1. `git checkout slow-version`
2. `npm install`
3. `npm run dev`

### Using Docker (Production Deployment)
The project comes packaged with Docker to easily deploy and run the optimized App using Nginx.

Ensure everything is configured via `.env` (use `.env.example` as a template):
```env
PORT=3000
```
Run the following command:
```bash
docker-compose up -d --build
```
This builds your containerized app, resolving multi-stage configurations, and binding it seamlessly to `localhost:3000`. Wait until the container reports `healthy` before establishing a connection.

## Performance Auditing

All metrics and steps taken to remediate Core Web Vitals (CLS, INP/TBT, LCP) have been meticulously documented in `PERFORMANCE.md`.
