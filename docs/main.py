import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler

# Load data from CSV file
data = pd.read_csv('data.csv')

# Split data into features (X) and target variable (y)
X = data.drop('target', axis=1)
y = data['target']

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features using StandardScaler
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train logistic regression model
logreg = LogisticRegression(max_iter=1000)
logreg.fit(X_train_scaled, y_train)
y_pred_logreg = logreg.predict(X_test_scaled)
logreg_accuracy = accuracy_score(y_test, y_pred_logreg)
print(f'Logistic Regression Accuracy: {logreg_accuracy:.3f}')
print('Logistic Regression Classification Report:')
print(classification_report(y_test, y_pred_logreg))
print('Logistic Regression Confusion Matrix:')
print(confusion_matrix(y_test, y_pred_logreg))

# Train random forest classifier
rfc = RandomForestClassifier(n_estimators=100)
rfc.fit(X_train_scaled, y_train)
y_pred_rfc = rfc.predict(X_test_scaled)
rfc_accuracy = accuracy_score(y_test, y_pred_rfc)
print(f'Random Forest Classifier Accuracy: {rfc_accuracy:.3f}')
print('Random Forest Classifier Classification Report:')
print(classification_report(y_test, y_pred_rfc))
print('Random Forest Classifier Confusion Matrix:')
print(confusion_matrix(y_test, y_pred_rfc))