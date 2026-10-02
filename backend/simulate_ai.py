# backend/simulate_ai.py
import time
import random
import requests
import uuid
from datetime import datetime

BACKEND_URL = "http://localhost:8000"

event_types = ['PPE_VIOLATION', 'MOBILE_PHONE_USAGE', 'SLEEPING_ON_DUTY', 'RESTRICTED_ZONE']
severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
zones = ["Production Zone", "Storage Zone", "Main Gate"]

print("🤖 AI Simulation Started... Press Ctrl+C to stop.")

try:
    while True:
        event = random.choice(event_types)
        zone = random.choice(zones)
        severity = random.choice(severities)
        
        print(f"📸 AI Detected: {event} in {zone} (Severity: {severity})")
        
        # 1. Send Alert
        payload = {
            "event_type": event,
            "camera_id": "CAM-001",
            "camera_name": "Main Gate Camera",
            "zone_name": zone,
            "severity": severity,
            "confidence": round(random.uniform(0.85, 0.99), 2),
            "metadata": {"details": f"Simulated {event} detection"}
        }
        
        try:
            res = requests.post(f"{BACKEND_URL}/api/alerts", json=payload)
            if res.status_code == 200:
                print("   ✅ Alert sent to dashboard!")
            else:
                print(f"   ⚠️ Backend error: {res.status_code}")
        except Exception as e:
            print(f"   ❌ Could not connect to backend: {e}")
            
        # 2. Record Observation (to build history)
        obs_payload = {
            "track_id": f"TRK-{uuid.uuid4().hex[:4]}",
            "camera_id": "CAM-001",
            "zone_name": zone,
            "object_type": "person",
            "bounding_box": [10, 20, 100, 200],
            "feature_vector": {"r_avg": random.randint(100, 200), "g_avg": random.randint(100, 200), "b_avg": random.randint(100, 200)},
            "confidence": 0.95
        }
        requests.post(f"{BACKEND_URL}/api/observations", json=obs_payload)

        # Wait 3 to 8 seconds before next detection
        time.sleep(random.randint(3, 8))

except KeyboardInterrupt:
    print("\n🛑 Simulation stopped.")