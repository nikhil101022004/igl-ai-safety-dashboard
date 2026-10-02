# backend/seed_data.py
import sqlite3
import os
import json
import uuid
from datetime import datetime, timedelta
import random
from database import init_db, DB_PATH

# Ensure database and tables exist
init_db()

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

print("🌱 Seeding database with dummy data...")

# 1. Add Dummy Cameras
cameras = [
    {"id": "CAM-001", "name": "Main Gate Camera", "source_type": "rtsp", "source_url": "rtsp://192.168.1.10:554/stream", "status": "ONLINE", "fps": 30.0, "latency_ms": 45.2, "brightness": 0.7, "blur_score": 0.1, "resolution": "1920x1080"},
    {"id": "CAM-002", "name": "Storage Tank A", "source_type": "webcam", "source_url": "http://192.168.1.11:8080/video", "status": "ONLINE", "fps": 25.0, "latency_ms": 120.5, "brightness": 0.5, "blur_score": 0.3, "resolution": "1280x720"},
    {"id": "CAM-003", "name": "Production Line 1", "source_type": "file", "source_url": "C:/videos/test_feed.mp4", "status": "OFFLINE", "not_assessable_reason": "Camera disconnected", "fps": 0.0, "latency_ms": 0.0, "brightness": 0.0, "blur_score": 0.0, "resolution": "1920x1080"},
]

camera_ids = []
for cam in cameras:
    cursor.execute("""
        INSERT OR IGNORE INTO cameras (id, name, source_type, source_url, status, not_assessable_reason, fps, latency_ms, brightness, blur_score, resolution, last_seen)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (cam["id"], cam["name"], cam["source_type"], cam["source_url"], cam["status"], cam.get("not_assessable_reason"), cam["fps"], cam["latency_ms"], cam["brightness"], cam["blur_score"], cam["resolution"], datetime.now().isoformat()))
    camera_ids.append(cam["id"])

print(f"✅ Added {len(cameras)} cameras.")

# 2. Add Dummy Restricted Zones
zones = [
    {"camera_id": "CAM-001", "zone_name": "Main Gate Entry", "coords": [[0.1, 0.1], [0.9, 0.1], [0.9, 0.9], [0.1, 0.9]]},
    {"camera_id": "CAM-002", "zone_name": "Tank A Perimeter", "coords": [[0.2, 0.2], [0.8, 0.2], [0.8, 0.8], [0.2, 0.8]]},
]

for zone in zones:
    cursor.execute("""
        INSERT INTO restricted_zones (camera_id, zone_name, polygon_coords, created_at)
        VALUES (?, ?, ?, ?)
    """, (zone["camera_id"], zone["zone_name"], json.dumps(zone["coords"]), datetime.now().isoformat()))

print(f"✅ Added {len(zones)} restricted zones.")

# 3. Add Dummy Alerts (Matching your main.py event types)
# Types: 'PPE_VIOLATION', 'RESTRICTED_ZONE', 'NEAR_MISS', 'PERSONNEL_ANOMALY', 'FIRE_SMOKE', 'SPILL_LEAK', 'FALL_MAN_DOWN', 'PHONE_MISUSE', 'SLEEPING_ON_DUTY', 'MOBILE_PHONE_USAGE'
event_types = ['PPE_VIOLATION', 'RESTRICTED_ZONE', 'NEAR_MISS', 'MOBILE_PHONE_USAGE', 'SLEEPING_ON_DUTY', 'FIRE_SMOKE']
severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
statuses = ['DETECTED', 'ACKNOWLEDGED', 'RESOLVED']

for i in range(20):
    alert_id = f"ALT-{uuid.uuid4().hex[:8].upper()}"
    cam_id = random.choice(camera_ids)
    cam_name = next((c["name"] for c in cameras if c["id"] == cam_id), "Unknown")
    event = random.choice(event_types)
    severity = random.choice(severities)
    status = random.choice(statuses)
    time_detected = (datetime.now() - timedelta(hours=random.randint(1, 48))).isoformat()
    
    cursor.execute("""
        INSERT INTO alerts (id, event_type, camera_id, camera_name, zone_name, severity, status, confidence, metadata_json, detected_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (alert_id, event, cam_id, cam_name, "General Zone", severity, status, round(random.uniform(0.7, 0.99), 2), json.dumps({"details": "Dummy detection data"}), time_detected))

print("✅ Added 20 dummy alerts.")

# 4. Add Dummy Observations (Needed for Personnel Anomaly check)
for i in range(10):
    track_id = f"TRK-{uuid.uuid4().hex[:4]}"
    cursor.execute("""
        INSERT INTO observations (track_id, camera_id, zone_name, object_type, bounding_box, feature_vector, confidence, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (track_id, "CAM-001", "Main Gate", "person", json.dumps([10, 20, 100, 200]), json.dumps({"r_avg": 120, "g_avg": 100, "b_avg": 110}), 0.95, datetime.now().isoformat()))

print("✅ Added 10 dummy observations.")

conn.commit()
conn.close()
print("🎉 Database seeding complete!")