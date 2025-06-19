#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Jun 19 16:49:57 2025

@author: calli
"""

document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:5000/api/data') // Your Python API endpoint
    .then(response => response.json())
    .then(data => {
      const output = document.getElementById('output');
      output.textContent = JSON.stringify(data, null, 2);
    })
    .catch(error => {
      document.getElementById('output').textContent = 'Error: ' + error;
    });
});