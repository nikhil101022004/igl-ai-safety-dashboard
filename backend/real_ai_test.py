# backend/real_ai_test.py
import cv2
from ultralytics import YOLO
import time

print("🤖 Loading Real AI Model (YOLOv8)... This might take a minute the first time.")
# Load the free, pre-trained YOLO model
model = YOLO('yolov8n.pt') 
print("✅ AI Model loaded successfully!")

# Open your laptop webcam (0 is usually the default webcam)
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("❌ Error: Could not open webcam.")
    exit()

print(" Webcam opened! Press 'q' to quit.")

while True:
    # Read a frame from the webcam
    ret, frame = cap.read()
    if not ret:
        break

    # Run the AI on the frame
    results = model(frame, verbose=False)

    # Draw the AI detections on the frame
    annotated_frame = results[0].plot()

    # Show the result in a window
    cv2.imshow("IGL Real-Time AI Vision", annotated_frame)

    # Press 'q' on your keyboard to close the window
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Clean up
cap.release()
cv2.destroyAllWindows()
print("🛑 AI Vision stopped.")