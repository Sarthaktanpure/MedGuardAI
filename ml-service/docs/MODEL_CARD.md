# MedGuard Model Card

This model is currently scaffolded for the MedGuard training pipeline.

Important:

- The shipped model must be treated as non-production until it is trained and evaluated on a real curated dataset.
- Synthetic/bootstrap data may be used to stand up the pipeline, but it is not a substitute for production-grade evidence.
- Any metric surfaced in the API or docs must come from an actual evaluation run.

## Planned Pipeline

- `data/prepare.py` builds the dataset
- `train.py` fine-tunes the model
- `eval.py` writes evaluation metrics
- `export.py` emits ONNX artifacts
- `gradcam.py` generates visualization references
