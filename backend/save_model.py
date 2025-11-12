import pandas as pd
import numpy as np
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import warnings

# Suppress XGBoost deprecation warnings
warnings.filterwarnings("ignore", category=UserWarning)

# --- Configuration ---
TRAINING_FILE = "zoonotic_train_large.csv"
MODEL_FILE = "xgboost_disease_model.pkl"
ENCODER_FILE = "label_encoder.pkl"
TARGET_COL = "label"
TEST_SIZE = 0.2
RANDOM_SEED = 42

try:
    # 1. Load Data
    df = pd.read_csv(TRAINING_FILE)
    df.columns = df.columns.str.strip()

    # 2. Prepare Data and Encode Labels
    X = df.drop(TARGET_COL, axis=1)
    y = df[TARGET_COL]

    label_encoder = LabelEncoder()
    y_enc = label_encoder.fit_transform(y)
    
    # Re-inject noise just like your original script (optional but keeps consistency)
    n_samples = len(y_enc)
    n_noisy = int(0.05 * n_samples)
    np.random.seed(RANDOM_SEED)
    noisy_indices = np.random.choice(n_samples, n_noisy, replace=False)
    for idx in noisy_indices:
        current_label = y_enc[idx]
        possible_labels = [l for l in np.unique(y_enc) if l != current_label]
        y_enc[idx] = np.random.choice(possible_labels)

    # 3. Train Model
    model = XGBClassifier(
        n_estimators=200,
        learning_rate=0.1,
        max_depth=6,
        random_state=RANDOM_SEED,
        use_label_encoder=False,
        eval_metric="mlogloss"
    )
    # Using all data for training before deployment save (optional)
    model.fit(X, y_enc) 

    # 4. Save Model and Encoder using joblib (PICKLE format)
    joblib.dump(model, MODEL_FILE)
    joblib.dump(label_encoder, ENCODER_FILE)

    print(f"\n✅ SUCCESS: Model and encoder saved.")
    print(f"   Model file: {MODEL_FILE}")
    print(f"   Encoder file: {ENCODER_FILE}")

except FileNotFoundError:
    print(f"\n❌ ERROR: Training file '{TRAINING_FILE}' not found.")
    print("         Make sure it is in the same directory as save_model.py.")
except Exception as e:
    print(f"\n❌ FAILED TO TRAIN/SAVE MODEL: {e}")