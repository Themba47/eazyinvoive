from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import numpy as np

EXPENSE_CATEGORIES = {
    'office_supplies': ['paper', 'pens', 'printer', 'ink'],
    'software': ['license', 'subscription', 'saas'],
    'travel': ['flight', 'hotel', 'taxi', 'uber'],
    'utilities': ['electricity', 'water', 'internet']
}

class ExpenseClassifier:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        self.classifier = MultinomialNB()
        
    def predict_category(self, description):
        text_features = self.vectorizer.transform([description])
        prediction = self.classifier.predict(text_features)
        confidence = np.max(self.classifier.predict_proba(text_features))
        return prediction[0], confidence
     
     
    def update_model(self, description, correct_category):
     # Update training data
     if correct_category not in EXPENSE_CATEGORIES:
         EXPENSE_CATEGORIES[correct_category] = []
     EXPENSE_CATEGORIES[correct_category].append(description)
    
     # Retrain model
     self.train_model()