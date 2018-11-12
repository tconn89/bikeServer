curl -H "Content-Type: application/json" \
     -X POST \
     -d '{"ride": {"name": "Next Ride", "coords": {"time": 1540434393135, "lat": 35.7842626, "long": -78.659761}}}' \
     http://localhost:4000/CaptureRides/update/meta