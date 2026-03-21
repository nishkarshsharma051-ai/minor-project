# Contributing to ScholarMetrics

Thanks for your interest in improving ScholarMetrics!

## How to Contribute

1. **Fork the repo** and create your branch from `main`.
2. **Install dependencies** using `pip install -r requirements.txt`.
3. **Make your changes**. Ensure your code follows existing style (simple docstrings, clean logic).
4. **Test your changes** by running the server and training script.
5. **Open a Pull Request** with a clear description of what you've added or fixed.

## Code Style
- Use standard Python indentation (4 spaces).
- Keep docstrings concise and focused.
- Avoid overly complex logic where a simple solution exists.

## Training Data
If you modify the data generation logic, make sure to delete `data/students.csv` and regenerate it to verify your changes.
