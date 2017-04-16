#!/usr/bin/env sh

if [[ $TRAVIS_TEST_RESULT == 1 ]]; then
  echo 'Skipping deploy due to broken build';
  exit 1;
fi

echo 'Starting deploy'

serverless deploy
