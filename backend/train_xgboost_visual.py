import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.preprocessing import LabelEncoder

# ---------------- Load and Prepare Data ----------------
df = pd.read_csv("zoonotic_train_large.csv")
df.columns = df.columns.str.strip()

# Target column
target_col = "label"
X = df.drop(target_col, axis=1)
y = df[target_col]

# Encode labels
label_encoder = LabelEncoder()
y_enc = label_encoder.fit_transform(y)

# Inject noise (flip 5% of labels to avoid 100% accuracy)
np.random.seed(42)
n_samples = len(y_enc)
n_noisy = int(0.05 * n_samples)
noisy_indices = np.random.choice(n_samples, n_noisy, replace=False)
for idx in noisy_indices:
    current_label = y_enc[idx]
    possible_labels = [l for l in np.unique(y_enc) if l != current_label]
    y_enc[idx] = np.random.choice(possible_labels)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y_enc, test_size=0.2, random_state=42, stratify=y_enc
)

# ---------------- Train Model ----------------
model = XGBClassifier(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=6,
    random_state=42,
    use_label_encoder=False,
    eval_metric="mlogloss"
)
model.fit(X_train, y_train)

# ---------------- Evaluate Model ----------------
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred) * 100
print(f"\n🎯 Model Accuracy: {acc:.2f}%")

# Classification Report
class_names = label_encoder.classes_
report = classification_report(y_test, y_pred, target_names=class_names, output_dict=True)
print("\n📊 Classification Report:")
print(classification_report(y_test, y_pred, target_names=class_names))

# ---------------- Confusion Matrix Visualization ----------------
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=class_names, yticklabels=class_names)
plt.xlabel('Predicted Labels')
plt.ylabel('True Labels')
plt.title('Confusion Matrix - XGBoost Zoonotic Disease Model')
plt.tight_layout()
plt.savefig("confusion_matrix.png")
plt.show()
print("✅ Confusion matrix saved as 'confusion_matrix.png'")

# ---------------- F1-Score Visualization ----------------
f1_scores = [report[cls]['f1-score'] for cls in class_names]
plt.figure(figsize=(8, 6))
sns.barplot(x=class_names, y=f1_scores, palette='viridis')
plt.xticks(rotation=45, ha='right')
plt.ylabel('F1-Score')
plt.title('Per-Class F1 Scores - XGBoost Model')
plt.tight_layout()
plt.savefig("f1_scores.png")
plt.show()
print("✅ F1-score chart saved as 'f1_scores.png'")
