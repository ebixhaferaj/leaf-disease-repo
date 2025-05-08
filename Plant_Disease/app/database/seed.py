from sqlalchemy.orm import Session
from app.models.leaf_diseases import Leaf_Diseases

diseases = [
    {
        "index": 0,
        "raw_class": "Background_without_leaves",
        "name": "Background (No Leaves)",
        "description": "No leaves present in the image. No diagnosis required.",
        "pesticides": "None"
    },
    {
        "index": 1,
        "raw_class": "Corn__Gray_Leaf_Spot",
        "name": "Corn Gray Leaf Spot",
        "description": "Fungal disease causing rectangular lesions on corn leaves.",
        "pesticides": "Use azoxystrobin or propiconazole."
    },
    {
        "index": 2,
        "raw_class": "Corn__Healthy",
        "name": "Corn Healthy",
        "description": "Healthy corn leaf with no signs of infection.",
        "pesticides": "None"
    },
    {
        "index": 3,
        "raw_class": "Corn__Northern_Leaf_Blight",
        "name": "Corn Northern Leaf Blight",
        "description": "Long, grayish lesions caused by fungal infection.",
        "pesticides": "Apply pyraclostrobin or mancozeb."
    },
    {
        "index": 4,
        "raw_class": "Grape__Downey_Mildew",
        "name": "Grape Downy Mildew",
        "description": "Yellowish spots on top, white mold below grape leaves.",
        "pesticides": "Use copper-based fungicides."
    },
    {
        "index": 5,
        "raw_class": "Grape__Healthy",
        "name": "Grape Healthy",
        "description": "No disease detected on grape leaves.",
        "pesticides": "None"
    },
    {
        "index": 6,
        "raw_class": "Grape__Powdery_Mildew",
        "name": "Grape Powdery Mildew",
        "description": "White powdery growth on leaves and stems.",
        "pesticides": "Apply sulfur-based or systemic fungicides."
    },
    {
        "index": 7,
        "raw_class": "Olive__Healthy",
        "name": "Olive Healthy",
        "description": "No visible signs of olive disease.",
        "pesticides": "None"
    },
    {
        "index": 8,
        "raw_class": "Olive__Peacock_Spot",
        "name": "Olive Peacock Spot",
        "description": "Circular dark spots on olive leaves.",
        "pesticides": "Apply copper fungicides in fall."
    },
    {
        "index": 9,
        "raw_class": "Olive__Rust_Mite",
        "name": "Olive Rust Mite",
        "description": "Silvery or russeted patches on olive foliage.",
        "pesticides": "Use sulfur or abamectin-based miticides."
    },
    {
        "index": 10,
        "raw_class": "Potato__Early_Blight",
        "name": "Potato Early Blight",
        "description": "Brown spots with concentric rings on potato leaves.",
        "pesticides": "Use chlorothalonil or azoxystrobin."
    },
    {
        "index": 11,
        "raw_class": "Potato__Healthy",
        "name": "Potato Healthy",
        "description": "No symptoms of disease detected on potato plant.",
        "pesticides": "None"
    },
    {
        "index": 12,
        "raw_class": "Potato__Late_blight",
        "name": "Potato Late Blight",
        "description": "Water-soaked lesions rapidly spreading across leaves.",
        "pesticides": "Apply mefenoxam or cymoxanil."
    },
    {
        "index": 13,
        "raw_class": "Tomato__Early_blight",
        "name": "Tomato Early Blight",
        "description": "Brown concentric lesions on older tomato leaves.",
        "pesticides": "Use mancozeb or copper fungicides."
    },
    {
        "index": 14,
        "raw_class": "Tomato__Healthy",
        "name": "Tomato Healthy",
        "description": "Healthy tomato leaves with no disease present.",
        "pesticides": "None"
    },
    {
        "index": 15,
        "raw_class": "Tomato__Late_Blight",
        "name": "Tomato Late Blight",
        "description": "Dark blotches on leaves, stems and fruit.",
        "pesticides": "Spray with metalaxyl or fluopicolide."
    },
    {
        "index": 16,
        "raw_class": "Wheat__Healthy",
        "name": "Wheat Healthy",
        "description": "No visible disease symptoms on wheat.",
        "pesticides": "None"
    },
    {
        "index": 17,
        "raw_class": "Wheat__Septoria",
        "name": "Wheat Septoria",
        "description": "Irregular brown lesions with black fruiting bodies.",
        "pesticides": "Use tebuconazole or epoxiconazole."
    },
    {
        "index": 18,
        "raw_class": "Wheat__Yellow_Rust",
        "name": "Wheat Yellow Rust",
        "description": "Yellow-orange pustules in parallel stripes.",
        "pesticides": "Apply triadimefon or propiconazole."
    }
]

def seed_leaf_diseases(db: Session):
    existing = db.query(Leaf_Diseases).first()
    if existing:
        return 
    
    for d in diseases:
        exists = db.query(Leaf_Diseases).filter_by(index=d["index"]).first()
        if not exists:
            db.add(Leaf_Diseases(**d))
    db.commit()
