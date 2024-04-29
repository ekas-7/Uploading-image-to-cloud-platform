import sys
import json
import random

# Dummy function to simulate prediction
def make_prediction(image_url):
    # Here you would load the image from the URL and perform your actual prediction
    # For the sake of this example, let's just return a dummy prediction
    skin_classes = {
        0: 'Actinic Keratoses (Solar Keratoses) or intraepithelial Carcinoma (Bowen’s disease)',
        1: 'Basal Cell Carcinoma',
        2: 'Benign Keratosis',
        3: 'Dermatofibroma',
        4: 'Melanoma',
        5: 'Melanocytic Nevi',
        6: 'Vascular skin lesion'
    }
    pred_class = random.choice(list(skin_classes.keys()))
    confidence = random.uniform(0.7, 0.95)
    
    prediction = {
        'disease': skin_classes[pred_class],
        'confidence': confidence,
        'medicine': find_medicine(pred_class)
    }
    return prediction

# Dummy function to find medicine based on prediction
def find_medicine(pred):
    switcher = {
        0: "fluorouracil",
        1: "Aldara",
        2: "Prescription Hydrogen Peroxide",
        3: "fluorouracil",
        4: "fluorouracil (5-FU)",
        5: "fluorouracil",
        6: "fluorouracil"
    }
    return switcher.get(pred, "Unknown")

if __name__ == "__main__":
    # Check if the image URL is provided as an argument
    if len(sys.argv) != 2:
        print("Usage: python skin_detection.py <image_url>")
        sys.exit(1)

    # Get the image URL from command line argument
    image_url = sys.argv[1]

    # Perform prediction using the image URL
    prediction_result = make_prediction(image_url)

    # Print the prediction result as JSON
    print(json.dumps(prediction_result))
