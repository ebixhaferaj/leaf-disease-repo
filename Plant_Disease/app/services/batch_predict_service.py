from io import BytesIO
from PIL import Image
import numpy as np
from typing import List

def read_files_as_images(data_list: List[bytes]) -> np.ndarray:
    images = []
    for data in data_list:
        image = Image.open(BytesIO(data))
        image_array = np.array(image)
        images.append(image_array)
    return np.stack(images)
