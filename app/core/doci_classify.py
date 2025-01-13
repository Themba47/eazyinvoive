import os
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes, OperationStatusCodes
from msrest.authentication import CognitiveServicesCredentials
from django.conf import settings
import time

class MSComputerVision:
    def __init__(self, subscription_key=settings.AZURE_FUNDA_KEY, endpoint=settings.AZURE_FUNDA_ENDPOINT):
        """
        Initialize the Computer Vision client
        
        Args:
            subscription_key (str): Your Azure Computer Vision subscription key
            endpoint (str): Your Azure Computer Vision endpoint URL
        """
        self.client = ComputerVisionClient(
            endpoint=endpoint,
            credentials=CognitiveServicesCredentials(subscription_key)
        )
    
    def analyze_image_url(self, image_url):
        """
        Analyze an image from a URL
        
        Args:
            image_url (str): URL of the image to analyze
            
        Returns:
            dict: Analysis results including tags, description, and objects
        """
        features = [
            VisualFeatureTypes.tags,
            VisualFeatureTypes.description,
            VisualFeatureTypes.objects,
            VisualFeatureTypes.faces,
            VisualFeatureTypes.adult,
            VisualFeatureTypes.color,
            VisualFeatureTypes.brands,
        ]
        
        analysis = self.client.analyze_image(image_url, features)
        
        return {
            'tags': [tag.name for tag in analysis.tags],
            'description': analysis.description.captions[0].text if analysis.description.captions else '',
            'objects': [obj.object_property for obj in analysis.objects],
            'faces': len(analysis.faces),
            'dominant_colors': analysis.color.dominant_colors,
            'brands': [brand.name for brand in analysis.brands] if analysis.brands else []
        }
    
    def analyze_local_image(self, image_path):
        """
        Analyze a local image file
        
        Args:
            image_path (str): Path to local image file
            
        Returns:
            dict: Analysis results including tags, description, and objects
        """
        with open(image_path, "rb") as image_stream:
            features = [
                VisualFeatureTypes.tags,
                VisualFeatureTypes.description,
                VisualFeatureTypes.objects,
                VisualFeatureTypes.faces,
                VisualFeatureTypes.adult,
                VisualFeatureTypes.color,
                VisualFeatureTypes.brands,
                VisualFeatureTypes.categories
            ]
            
            analysis = self.client.analyze_image_in_stream(image_stream, features)
            
            return {
                'tags': [tag.name for tag in analysis.tags],
                'description': analysis.description.captions[0].text if analysis.description.captions else '',
                'objects': [obj.object_property for obj in analysis.objects],
                'faces': len(analysis.faces),
                'dominant_colors': analysis.color.dominant_colors,
                'brands': [brand.name for brand in analysis.brands] if analysis.brands else [],
                "categories": [category.name for category in analysis.categories]
            }

    def read_text_from_local_image(self, image_path):
        """
        Extract text from a local image file using OCR
        
        Args:
            image_path (str): Path to local image file
            
        Returns:
            str: Extracted text from the image
        """
        # Read the image file
        with open(image_path, "rb") as image_stream:
            # Call API with the image
            read_response = self.client.read_in_stream(
                image=image_stream,
                raw=True
            )

            # Get the operation location (URL with an ID at the end)
            read_operation_location = read_response.headers["Operation-Location"]
            # Grab the ID from the URL
            operation_id = read_operation_location.split("/")[-1]

            # Wait for the operation to complete
            while True:
                read_result = self.client.get_read_result(operation_id)
                if read_result.status not in ['notStarted', 'running']:
                    break
                time.sleep(1)

            # Get the results
            text = []
            if read_result.status == OperationStatusCodes.succeeded:
                for text_result in read_result.analyze_result.read_results:
                    for line in text_result.lines:
                        text.append(line.text)
            
            return "\n".join(text)

    def read_text_from_url(self, image_url):
        """
        Extract text from an image URL using OCR
        
        Args:
            image_url (str): URL of the image containing text
            
        Returns:
            str: Extracted text from the image
        """
        read_response = self.client.read(image_url, raw=True)
        read_operation_location = read_response.headers["Operation-Location"]
        operation_id = read_operation_location.split("/")[-1]

        while True:
            read_result = self.client.get_read_result(operation_id)
            if read_result.status.lower() not in ['notstarted', 'running']:
                break
            time.sleep(1)

        text = []
        if read_result.status == OperationStatusCodes.succeeded:
            for text_result in read_result.analyze_result.read_results:
                for line in text_result.lines:
                    text.append(line.text)
        
        return "\n".join(text)

# Example usage:
# if __name__ == "__main__":
#     # Replace with your Azure Computer Vision credentials
#     subscription_key = "6640278bc3eb4e388f63d1cd7b0cb59b"
#     endpoint = "https://funda.cognitiveservices.azure.com/"
    
#     # Initialize the client
#     vision_client = MSComputerVision()
    
#     # Example: Read text from a local image
#     local_image = "/Users/Themba/Downloads/Request for Information_Data and Analytics.pdf"
#     text_results = vision_client.read_text_from_local_image(local_image)
#     print("Extracted Text:", text_results)