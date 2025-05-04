from io import BytesIO
from PIL import Image
import numpy as np

def read_file_as_image(file_data: bytes) -> np.ndarray:
    """Reads the image from bytes and returns it as a NumPy array."""
    image = Image.open(BytesIO(file_data))
    return np.array(image)