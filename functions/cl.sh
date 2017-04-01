#!/usr/bin/env bash

rm -rf ./node_modules/tubealert
rm -rf ./node_modules/.yarn-integrity
yarn cache clean
yarn install
