import os
import requests
from io import BytesIO

from django.conf import settings
from django.core.files.storage import default_storage


"""
Function to make url request to IFCB Dashboard get image if missing locally
Args: 'dataset_obj': Dataset object, 'img_name': string
"""
def _get_image_ifcb_dashboard(dataset_obj, img_name):
    image = None
    if not os.path.isfile(os.path.join(settings.MEDIA_ROOT , F'ifcb/images/{img_name}.png')):
        img_url = F'https://ifcb-data.whoi.edu/{dataset_obj.dashboard_id_name}/{img_name}.png'
        response = requests.get(img_url)
        if response.status_code == 200:
            file = BytesIO()
            file.write(response.content)
            filename = F'{img_name}.png'
            image = default_storage.save('ifcb/images/' + filename, file)
    return image
