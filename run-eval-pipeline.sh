#!/bin/bash
cd generator && npm i && ./relink

cd .. && cd eval && python3 pipeline.py
