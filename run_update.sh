#!/bin/sh
cd src
deno run --allow-net --allow-read --allow-write --allow-env update.ts
