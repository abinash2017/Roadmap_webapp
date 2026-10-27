/* ============================================
   DATA — MONTHS + STUDY TIPS
   Pure static data, no dependencies.
   ============================================ */

// ── Roadmap variant: AI/LLM Engineer (original 10-month plan) ──
export const MONTHS_AI_LLM = [
  {
    id: 0, num: "01", title: "Python Foundations + Basic Backend",
    duration: "6 weeks", hours: "2–3 hrs/day, 4–5 hrs weekends", difficulty: "Easy-Medium",
    diffClass: "difficulty-easy",
    description: "Go from basic Python to confident backend developer. Build REST APIs, connect databases, containerize with Docker.",
    goals: [
      "Write confident Python (OOP, decorators, generators)",
      "Understand Big-O and basic data structures",
      "Build a REST API with FastAPI",
      "Connect to a PostgreSQL database",
      "Dockerize and deploy an application",
      "Have 3–4 GitHub repos as proof of work"
    ],
    resources: [
      { name: "100 Days of Code: Python (Angela Yu)", type: "Course", cost: "₹449", link: "https://www.udemy.com/course/100-days-of-code/" },
      { name: "Python for Everybody (Dr. Chuck)", type: "Course", cost: "Free", link: "https://www.py4e.com/" },
      { name: "Corey Schafer YouTube — OOP, Decorators", type: "YouTube", cost: "Free", link: "https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU" },
      { name: "FastAPI Official Tutorial", type: "Docs", cost: "Free", link: "https://fastapi.tiangolo.com/tutorial/" },
      { name: "RealPython.com", type: "Articles", cost: "Free", link: "https://realpython.com/" },
      { name: "NeetCode.io — Curated DSA", type: "Practice", cost: "Free", link: "https://neetcode.io/" }
    ],
    weeks: [
      {
        title: "Week 1 — Python Core Deep Dive",
        tag: "Days 1–7",
        days: [
          { title: "Day 1–2: Data Structures & Memory",
            topics: ["Mutable vs Immutable types", "list / tuple / set / dict — when to use each", "Big-O basics: O(1), O(n), O(n²), O(log n)", "Hash tables and why dict lookup is O(1)", "LeetCode: Two Sum (#1), Contains Duplicate (#217), Valid Anagram (#242)"] },
          { title: "Day 3–4: Object-Oriented Programming",
            topics: ["Classes, __init__, self, instance variables", "Inheritance, super(), polymorphism", "Magic methods: __str__, __repr__, __len__", "@classmethod, @staticmethod", "Build: Bank Account System with inheritance", "LeetCode: Valid Parentheses (#20)"] },
          { title: "Day 5–6: Decorators, Generators, Advanced",
            topics: ["Decorators (basic, with arguments, @functools.wraps)", "Generators and yield (lazy evaluation)", "Context managers (with statement)", "Lambda, comprehensions, *args/**kwargs", "Build: logging, retry, timer decorators", "LeetCode: Fibonacci Number (#509)"] },
          { title: "Day 7: Mini Project — CLI Expense Tracker",
            topics: ["OOP + decorators + generators combined", "Add/view/delete expenses, JSON persistence", "Category filtering, monthly summaries", "Push to GitHub: cli-expense-tracker"] }
        ]
      },
      {
        title: "Week 2 — FastAPI & REST API Basics",
        tag: "Days 8–14",
        days: [
          { title: "Day 8–9: HTTP + First FastAPI App",
            topics: ["HTTP protocol, methods (GET/POST/PUT/DELETE)", "Status codes (200, 201, 400, 401, 404, 500)", "FastAPI setup, path params, query params", "Swagger UI auto-docs at /docs"] },
          { title: "Day 10–11: Pydantic Models + CRUD",
            topics: ["Pydantic validation, type hints", "Request/response models, Field validation", "Build: Task Manager API (in-memory)", "All CRUD endpoints with filtering"] },
          { title: "Day 12–13: PostgreSQL + SQLAlchemy",
            topics: ["SQL basics: CREATE, SELECT, INSERT, UPDATE, DELETE", "PostgreSQL setup with pgAdmin", "SQLAlchemy ORM models", "Connect Task Manager API to real database"] },
          { title: "Day 14: Polish + Push",
            topics: ["Error handling (HTTPException)", "requirements.txt, .gitignore, README", "Push to GitHub: task-manager-api"] }
        ]
      },
      {
        title: "Week 3 — Authentication + Async",
        tag: "Days 15–21",
        days: [
          { title: "Day 15–16: JWT Authentication",
            topics: ["JWT tokens (header, payload, signature)", "Password hashing with bcrypt", "Register/login endpoints", "Protected routes, user-scoped data"] },
          { title: "Day 17–18: Async Programming",
            topics: ["sync vs async, async/await", "asyncio basics, parallel tasks", "Refactor endpoints to async def", "Background tasks in FastAPI"] },
          { title: "Day 19–20: Error Handling + Project Structure",
            topics: ["Custom exceptions, global handlers", "Python logging module", "Clean folder structure (routers/models/schemas/services)", "Environment variables with python-dotenv"] },
          { title: "Day 21: Week 3 Polish",
            topics: ["Complete Task Manager with auth + async + logging", "Push polished version to GitHub"] }
        ]
      },
      {
        title: "Week 4 — Docker + Testing",
        tag: "Days 22–28",
        days: [
          { title: "Day 22–23: Docker Basics",
            topics: ["Containers vs VMs", "Dockerfile syntax, docker build, docker run", "Docker Compose (API + PostgreSQL)", "Dockerize Task Manager, test with docker-compose up"] },
          { title: "Day 24–25: Testing with Pytest",
            topics: ["pytest basics, assertions, fixtures", "TestClient for FastAPI endpoints", "Test auth flows and CRUD operations", "Run with pytest -v and pytest --cov"] },
          { title: "Day 26–28: Deploy + Catch-up",
            topics: ["Deploy to Render.com (free tier)", "Set up PostgreSQL on Render", "Buffer time: catch up, review, rest"] }
        ]
      },
      {
        title: "Week 5 — Consolidation (Buffer)",
        tag: "Days 29–31",
        days: [
          { title: "Day 29–31: Blog Platform API (Fresh Project)",
            topics: ["Build from scratch (no copy-paste)", "JWT auth, CRUD posts, categories, tags", "Search, pagination, PostgreSQL, Docker", "Tests (at least 10), independent building"] }
        ]
      }
    ],
    checklist: [
      "Create a FastAPI app from scratch",
      "Define Pydantic models with validation",
      "Connect to PostgreSQL with SQLAlchemy",
      "Implement JWT authentication",
      "Write basic SQL queries",
      "Write pytest tests for API endpoints",
      "Dockerize an application",
      "Deploy to a cloud platform",
      "Explain Big-O of common operations",
      "Write clean Python with OOP, decorators, generators"
    ],
    repos: ["python-core-practice", "cli-expense-tracker", "task-manager-api", "blog-platform-api"]
  },
  {
    id: 1, num: "02", title: "Advanced Backend + Deployment",
    duration: "6 weeks", hours: "2–3 hrs/day, 4–5 hrs weekends", difficulty: "Medium",
    diffClass: "difficulty-medium",
    description: "Level up to production-grade backend skills. Middleware, WebSockets, CI/CD, system design basics.",
    goals: [
      "Handle advanced backend patterns (middleware, WebSockets, uploads)",
      "Write comprehensive tests with 80%+ coverage",
      "Set up CI/CD pipelines with GitHub Actions",
      "Understand basic system design concepts",
      "Build and deploy a polished backend project",
      "🎓 Cert: AWS Cloud Practitioner (CLF-C02) — $100, online proctored"
    ],
    resources: [
      { name: "FastAPI Official Docs — Advanced", type: "Docs", cost: "Free", link: "https://fastapi.tiangolo.com/advanced/" },
      { name: "GitHub Actions Docs", type: "Docs", cost: "Free", link: "https://docs.github.com/en/actions" },
      { name: "Gaurav Sen — System Design YouTube", type: "YouTube", cost: "Free", link: "https://www.youtube.com/@gaborsen" },
      { name: "Docker Mastery (Bret Fisher)", type: "Course", cost: "₹449", link: "https://www.udemy.com/course/docker-mastery/" },
      { name: "Designing Data-Intensive Applications", type: "Book", cost: "₹800", link: "https://dataintensive.net/" }
    ],
    weeks: [
      {
        title: "Week 1 — Python Foundations Wrap-up",
        tag: "Days 1–4",
        days: [
          { title: "Day 1–2: Blog Platform API (continued)",
            topics: ["Build from scratch (no copy-paste)", "JWT auth, CRUD posts, categories, tags"] },
          { title: "Day 3–4: Deploy + Review",
            topics: ["Deploy Blog Platform on Render", "Write portfolio-worthy README", "Month 1 review — pass the checklist!", "Push to GitHub: blog-platform-api"] }
        ]
      },
      {
        title: "Week 2 — Advanced FastAPI Patterns",
        tag: "Days 5–11",
        days: [
          { title: "Day 5–6: Middleware, CORS, Rate Limiting",
            topics: ["Middleware concepts, CORS setup", "Rate limiting, request ID tracking", "Global exception handlers"] },
          { title: "Day 7–8: File Uploads + WebSockets",
            topics: ["File upload endpoints (profile pics, documents)", "WebSocket basics for real-time chat", "Background tasks (email notifications)"] },
          { title: "Day 9–11: API Design Best Practices",
            topics: ["Pagination patterns (offset, cursor)", "Filtering and sorting", "API versioning (v1/v2)", "OpenAPI documentation polish"] }
        ]
      },
      {
        title: "Week 3 — Testing Mastery + CI/CD",
        tag: "Days 12–18",
        days: [
          { title: "Day 12–14: Comprehensive Testing",
            topics: ["Unit tests, integration tests, e2e tests", "Fixtures, conftest.py, parametrize", "Mocking external services", "Target: 80%+ code coverage"] },
          { title: "Day 15–18: CI/CD with GitHub Actions",
            topics: ["GitHub Actions workflow files", "Auto-run tests on every push", "Code quality: black, ruff, mypy", "Auto-deploy to Render on merge"] }
        ]
      },
      {
        title: "Week 4 — System Design + Caching",
        tag: "Days 19–25",
        days: [
          { title: "Day 19–21: System Design Basics",
            topics: ["Client-server architecture", "Load balancing, horizontal scaling", "Database indexing, N+1 problem", "Caching strategies (Redis intro)"] },
          { title: "Day 22–25: Redis + Advanced DB Patterns",
            topics: ["Redis setup and basic commands", "Caching API responses with Redis", "Database migrations with Alembic", "Connection pooling"] }
        ]
      },
      {
        title: "Week 5 — Capstone Project",
        tag: "Days 26–30",
        days: [
          { title: "Day 26–28: Collaborative Notes API",
            topics: ["Real-time collaboration with WebSockets", "User roles and permissions", "Full test suite, CI/CD pipeline", "Redis caching layer"] },
          { title: "Day 29–30: Deploy + Polish",
            topics: ["Dockerized deployment", "Portfolio-worthy README", "Push to GitHub: collaborative-notes-api"] }
        ]
      }
    ],
    checklist: [
      "Build middleware (logging, auth, rate limiting)",
      "Handle file uploads in FastAPI",
      "Implement WebSocket endpoints",
      "Write tests with 80%+ coverage",
      "Set up GitHub Actions CI/CD",
      "Use Redis for caching",
      "Explain basic system design concepts",
      "Use Alembic for database migrations",
      "API versioning and pagination",
      "🎓 Pass AWS Cloud Practitioner (CLF-C02)"
    ],
    repos: ["advanced-api-patterns", "collaborative-notes-api"]
  },
  {
    id: 2, num: "03", title: "Math Basics + ML Foundations",
    duration: "7 weeks", hours: "2–3 hrs/day, 4–5 hrs weekends", difficulty: "Medium-Hard",
    diffClass: "difficulty-hard",
    description: "Math intuition (not PhD-level) + first ML models. This is where most people struggle — but don't quit!",
    goals: [
      "Understand math intuition behind ML (linear algebra, calculus, probability)",
      "Train models with scikit-learn",
      "Know linear regression, logistic regression, decision trees",
      "Evaluate models properly (not just accuracy)",
      "Build a complete ML prediction project",
      "🎓 Cert: Stanford ML Specialization (Coursera — Andrew Ng) — Free audit / ~$49/mo for cert"
    ],
    resources: [
      { name: "Andrew Ng ML Specialization — Course 1", type: "Course", cost: "Free (audit)", link: "https://www.coursera.org/specializations/machine-learning-introduction" },
      { name: "3Blue1Brown — Essence of Linear Algebra", type: "YouTube", cost: "Free", link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" },
      { name: "3Blue1Brown — Essence of Calculus", type: "YouTube", cost: "Free", link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr" },
      { name: "StatQuest with Josh Starmer", type: "YouTube", cost: "Free", link: "https://www.youtube.com/@statquest" },
      { name: "Hands-On ML (Géron) — Chapters 1–6", type: "Book", cost: "₹500–800", link: "https://github.com/ageron/handson-ml3" },
      { name: "Kaggle — Learn courses", type: "Practice", cost: "Free", link: "https://www.kaggle.com/learn" }
    ],
    weeks: [
      {
        title: "Week 1 — Linear Algebra for ML",
        tag: "Days 1–7",
        days: [
          { title: "Day 1–2: Vectors & Matrices",
            topics: ["Vectors, matrices, operations with NumPy", "Dot product, matrix multiplication", "3Blue1Brown: Essence of Linear Algebra (videos 1–4)"] },
          { title: "Day 3–4: Transforms & Eigenvalues",
            topics: ["Linear transformations, matrix as a function", "Determinants, inverse matrices", "Eigenvalues/eigenvectors (intuition for PCA)", "3Blue1Brown: Essence of Linear Algebra (videos 5–10)"] },
          { title: "Day 5–7: NumPy Practice",
            topics: ["Broadcasting, vectorized operations", "Matrix operations in NumPy (no loops)", "Mini-project: solve a system of equations with NumPy", "Quiz yourself: can you explain dot product without notes?"] }
        ]
      },
      {
        title: "Week 2 — Calculus & Probability for ML",
        tag: "Days 8–14",
        days: [
          { title: "Day 8–9: Calculus Intuition",
            topics: ["What is a derivative (rate of change)", "Gradient descent — going downhill to find best answer", "Partial derivatives (intuition only)", "3Blue1Brown: Essence of Calculus (first 5 videos)"] },
          { title: "Day 10–11: Calculus in ML Context",
            topics: ["Chain rule (why backpropagation works)", "Cost functions and optimization", "Implement gradient descent from scratch in Python", "Visualize loss landscape"] },
          { title: "Day 12–14: Probability & Statistics",
            topics: ["Mean, median, standard deviation, variance", "Normal distribution, Bayes' theorem", "Correlation vs causation", "Hypothesis testing basics (p-value intuition)", "StatQuest videos on probability"] }
        ]
      },
      {
        title: "Week 3 — First ML Models",
        tag: "Days 15–21",
        days: [
          { title: "Day 15–16: ML Concepts + Linear Regression",
            topics: ["Supervised vs unsupervised learning", "Train/test split, overfitting/underfitting", "Linear regression from scratch concept", "scikit-learn: House price prediction"] },
          { title: "Day 17–18: Logistic Regression",
            topics: ["Classification vs regression", "Sigmoid function, decision boundary", "Build: Spam classifier", "Metrics: accuracy, precision, recall, F1"] },
          { title: "Day 19–21: Evaluation Deep Dive",
            topics: ["Confusion matrix, ROC curve, AUC", "Cross-validation (k-fold)", "When accuracy is misleading", "Andrew Ng ML course materials"] }
        ]
      },
      {
        title: "Week 4 — Tree-Based Models",
        tag: "Days 22–28",
        days: [
          { title: "Day 22–24: Decision Trees + Random Forests",
            topics: ["Decision tree intuition (yes/no questions)", "Random Forest (many trees voting)", "Feature importance", "StatQuest: Decision Trees, Random Forests"] },
          { title: "Day 25–28: Bias-Variance + Practice",
            topics: ["Bias-variance tradeoff", "Overfitting vs underfitting solutions", "Regularization basics", "Kaggle dataset practice"] }
        ]
      },
      {
        title: "Week 5 — End-to-End ML Project",
        tag: "Days 29–35",
        days: [
          { title: "Day 29–31: Pandas Mastery + EDA",
            topics: ["DataFrame operations, groupby, merge", "Data cleaning: missing values, outliers", "Visualization: matplotlib, seaborn", "Exploratory Data Analysis workflow"] },
          { title: "Day 32–35: Churn Prediction Project",
            topics: ["Full pipeline: data → clean → train → evaluate", "Multiple model comparison", "Serve model via FastAPI endpoint", "Push to GitHub: ml-churn-prediction"] }
        ]
      },
      {
        title: "Week 6 — Buffer & Catch-up",
        tag: "Days 36–40",
        days: [
          { title: "Day 36–40: Review + Catch-up",
            topics: ["Revisit any weak areas", "Extra Kaggle practice", "Start Andrew Ng Course 2 (if ahead)", "LeetCode catch-up"] }
        ]
      }
    ],
    checklist: [
      "Explain what linear algebra is used for in ML",
      "Perform matrix operations with NumPy (no loops)",
      "Explain gradient descent in simple terms",
      "Implement gradient descent from scratch in Python",
      "Explain chain rule and why backprop needs it",
      "Train a linear regression model",
      "Train a logistic regression classifier",
      "Use decision trees and random forests",
      "Evaluate with precision, recall, F1, ROC-AUC",
      "Perform cross-validation",
      "Clean data with Pandas",
      "Build an end-to-end ML project with API serving",
      "Explain overfitting and how to prevent it",
      "🎓 Complete Stanford ML Specialization (Coursera)"
    ],
    repos: ["ml-house-prices", "ml-spam-classifier", "ml-churn-prediction"]
  },
  {
    id: 3, num: "04", title: "ML Engineering + MLOps",
    duration: "6 weeks", hours: "2–3 hrs/day, 4–5 hrs weekends", difficulty: "Medium",
    diffClass: "difficulty-medium",
    description: "Production ML: hyperparameter tuning, XGBoost, ETL pipelines, MLflow, model deployment and monitoring.",
    goals: [
      "Tune models with cross-validation and hyperparameter search",
      "Build production-grade data pipelines (ETL)",
      "Track experiments with MLflow",
      "Understand the full ML lifecycle",
      "Build a complete end-to-end ML system",
      "🎓 Cert: Google Cloud Digital Leader ($99) — validates cloud + AI fundamentals"
    ],
    resources: [
      { name: "Andrew Ng ML Specialization — Course 2", type: "Course", cost: "Free (audit)", link: "https://www.coursera.org/specializations/machine-learning-introduction" },
      { name: "Made With ML (Goku Mohandas)", type: "Website", cost: "Free", link: "https://madewithml.com/" },
      { name: "MLflow Official Docs", type: "Docs", cost: "Free", link: "https://mlflow.org/docs/latest/index.html" },
      { name: "Kaggle Competitions", type: "Practice", cost: "Free", link: "https://www.kaggle.com/competitions" },
      { name: "Full Stack Deep Learning (YouTube)", type: "YouTube", cost: "Free", link: "https://www.youtube.com/@FullStackDeepLearning" }
    ],
    weeks: [
      {
        title: "Week 1 — Math & ML Wrap-up",
        tag: "Days 1–4",
        days: [
          { title: "Day 1–4: Review + Catch-up (continued)",
            topics: ["Revisit any weak areas", "Extra Kaggle practice", "Start Andrew Ng Course 2 (if ahead)", "LeetCode catch-up"] }
        ]
      },
      {
        title: "Week 2 — Model Tuning + Advanced Models",
        tag: "Days 5–11",
        days: [
          { title: "Day 5–6: Hyperparameter Tuning",
            topics: ["Parameters vs hyperparameters", "Grid Search, Random Search", "Cross-validation + search together", "Diminishing returns — when to stop"] },
          { title: "Day 7–9: XGBoost + LightGBM",
            topics: ["Gradient boosting concept", "XGBoost training and tuning", "LightGBM (faster alternative)", "Compare: RF vs XGBoost vs LightGBM"] },
          { title: "Day 10–11: Feature Engineering",
            topics: ["Creating new features from existing data", "Encoding categoricals (one-hot, target)", "Feature selection methods", "Kaggle competition entry"] }
        ]
      },
      {
        title: "Week 3 — Pipelines + Experiment Tracking",
        tag: "Days 12–18",
        days: [
          { title: "Day 12–14: sklearn Pipelines + ETL",
            topics: ["sklearn Pipeline and ColumnTransformer", "Preprocessing + model in one pipeline", "Saving/loading pipelines with joblib"] },
          { title: "Day 15–18: MLflow",
            topics: ["MLflow setup, experiment tracking", "Log parameters, metrics, artifacts", "Model registry", "Compare experiment runs in MLflow UI"] }
        ]
      },
      {
        title: "Week 4 — Model Serving + Monitoring",
        tag: "Days 19–25",
        days: [
          { title: "Day 19–21: Model API + Docker",
            topics: ["Serve sklearn model with FastAPI", "Load model in endpoint, predict", "Dockerize the model API", "Health check and versioning endpoints"] },
          { title: "Day 22–25: Monitoring Basics",
            topics: ["Data drift detection concepts", "Model performance monitoring", "Logging predictions for auditing", "When to retrain"] }
        ]
      },
      {
        title: "Week 5 — Complete ML System",
        tag: "Days 26–30",
        days: [
          { title: "Day 26–30: Churn ML System Capstone",
            topics: ["Full project: data → pipeline → train → MLflow → API → Docker", "Clean project structure", "CI/CD for ML model", "Push to GitHub: churn-ml-system"] }
        ]
      }
    ],
    checklist: [
      "Perform hyperparameter tuning (Grid/Random Search)",
      "Train XGBoost and LightGBM models",
      "Build sklearn Pipelines",
      "Track experiments with MLflow",
      "Serve a model via FastAPI",
      "Dockerize an ML model API",
      "Explain the full ML lifecycle",
      "Feature engineering techniques",
      "Understand data drift and model monitoring",
      "🎓 Pass Google Cloud Digital Leader"
    ],
    repos: ["kaggle-competition", "churn-ml-system"]
  },
  {
    id: 4, num: "05", title: "Deep Learning (CNN + RNN)",
    duration: "7 weeks", hours: "2–3 hrs/day, 4–5 hrs weekends", difficulty: "Hard",
    diffClass: "difficulty-hard",
    description: "Neural networks from scratch, PyTorch, CNNs for images, RNNs for sequences. The 'magic' starts making sense.",
    goals: [
      "Understand how neural networks learn (forward pass, backpropagation)",
      "Build neural networks with PyTorch",
      "Train an image classifier (CNN)",
      "Train a text classifier (RNN/LSTM)",
      "Deploy a deep learning model as an API",
      "🎓 Cert: DeepLearning.AI Deep Learning Specialization (Coursera) — ~$49/mo for cert"
    ],
    resources: [
      { name: "fast.ai — Practical Deep Learning", type: "Course", cost: "Free", link: "https://course.fast.ai/" },
      { name: "Andrew Ng — Deep Learning Specialization", type: "Course", cost: "Free (audit)", link: "https://www.coursera.org/specializations/deep-learning" },
      { name: "PyTorch Official '60 Minute Blitz'", type: "Tutorial", cost: "Free", link: "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html" },
      { name: "Daniel Bourke — PyTorch Course", type: "YouTube", cost: "Free", link: "https://www.youtube.com/watch?v=Z_ikDlimN6A" },
      { name: "Google Colab (free GPU)", type: "Tool", cost: "Free", link: "https://colab.research.google.com/" }
    ],
    weeks: [
      {
        title: "Week 1 — Neural Network Fundamentals",
        tag: "Days 1–7",
        days: [
          { title: "Day 1–3: NN From Scratch + PyTorch Basics",
            topics: ["Perceptron, activation functions", "Forward pass, loss function, backpropagation", "Build a simple NN with NumPy only", "PyTorch tensors, autograd, nn.Module", "Training loop: forward → loss → backward → update"] },
          { title: "Day 4–7: PyTorch Deep Dive",
            topics: ["Datasets, DataLoaders, transforms", "Optimizers (SGD, Adam)", "Learning rate schedulers", "Train MNIST digit classifier", "Google Colab GPU setup"] }
        ]
      },
      {
        title: "Week 2 — CNNs (Convolutional Neural Networks)",
        tag: "Days 8–14",
        days: [
          { title: "Day 8–10: CNN Theory + Build",
            topics: ["Convolution operation, filters, feature maps", "Pooling, stride, padding", "AlexNet → VGG → ResNet evolution", "Build CNN for CIFAR-10 classification"] },
          { title: "Day 11–14: Transfer Learning",
            topics: ["Pre-trained models (ResNet, EfficientNet)", "Fine-tuning vs feature extraction", "Data augmentation techniques", "Build: Image classifier with transfer learning"] }
        ]
      },
      {
        title: "Week 3 — RNNs and Sequence Models",
        tag: "Days 15–21",
        days: [
          { title: "Day 15–17: RNN + LSTM Theory",
            topics: ["Sequential data, time steps", "Vanishing gradient problem", "LSTM: forget, input, output gates", "GRU (simplified LSTM)"] },
          { title: "Day 18–21: Sequence Projects",
            topics: ["Sentiment analysis on IMDB dataset", "Next word predictor (character-level)", "Embeddings for text", "Compare RNN vs LSTM performance"] }
        ]
      },
      {
        title: "Week 4 — DL Model Deployment",
        tag: "Days 22–28",
        days: [
          { title: "Day 22–28: Serve DL Model with FastAPI",
            topics: ["Save/load PyTorch models", "Build prediction API endpoint", "Handle image upload → classify → respond", "Dockerize and deploy", "Push to GitHub: image-classifier-cnn, sentiment-rnn"] }
        ]
      },
      {
        title: "Week 5 — Buffer + Community",
        tag: "Days 29–31",
        days: [
          { title: "Day 29–31: Review + Networking",
            topics: ["Revisit weak areas (backprop, LSTM)", "Extra Kaggle image/text competitions", "Join AI/ML Discord communities (MLOps, Weights & Biases)", "Write your first blog post about something you learned", "LeetCode catch-up"] }
        ]
      }
    ],
    checklist: [
      "Build a neural network from scratch (NumPy)",
      "Build and train models with PyTorch",
      "Explain forward pass and backpropagation",
      "Build a CNN image classifier",
      "Use transfer learning with pre-trained models",
      "Build an RNN/LSTM text classifier",
      "Explain vanishing gradient problem",
      "Use Google Colab with GPU",
      "Deploy a DL model as an API",
      "🎓 Complete DeepLearning.AI Deep Learning Specialization"
    ],
    repos: ["pytorch-nn-from-scratch", "image-classifier-cnn", "sentiment-rnn"]
  },
  {
    id: 5, num: "06", title: "NLP + Transformers",
    duration: "7 weeks", hours: "2–3 hrs/day, 4–5 hrs weekends", difficulty: "Hard",
    diffClass: "difficulty-hard",
    description: "The MOST important month for AI careers. Transformers power everything — ChatGPT, BERT, Copilot, DALL-E.",
    goals: [
      "Understand the Transformer architecture",
      "Know how BERT and GPT work conceptually",
      "Fine-tune BERT for text classification",
      "Understand tokenization, embeddings, attention",
      "Build a semantic search system with FAISS",
      "🎓 Cert: DeepLearning.AI NLP Specialization (Coursera) — ~$49/mo for cert"
    ],
    resources: [
      { name: "HuggingFace NLP Course", type: "Course", cost: "Free", link: "https://huggingface.co/learn/nlp-course" },
      { name: "Jay Alammar — 'The Illustrated Transformer'", type: "Blog", cost: "Free", link: "https://jalammar.github.io/illustrated-transformer/" },
      { name: "Jay Alammar — 'The Illustrated BERT'", type: "Blog", cost: "Free", link: "https://jalammar.github.io/illustrated-bert/" },
      { name: "3Blue1Brown — 'Attention in Transformers'", type: "YouTube", cost: "Free", link: "https://www.youtube.com/watch?v=eMlx5fFNoYc" },
      { name: "Attention Is All You Need (paper)", type: "Paper", cost: "Free", link: "https://arxiv.org/abs/1706.03762" },
      { name: "HuggingFace Transformers docs", type: "Docs", cost: "Free", link: "https://huggingface.co/docs/transformers" }
    ],
    weeks: [
      {
        title: "Week 1 — Deep Learning Wrap-up",
        tag: "Days 1–4",
        days: [
          { title: "Day 1–4: Review + Catch-up (continued)",
            topics: ["Revisit weak areas (backprop, LSTM)", "Extra Kaggle image/text competitions", "fast.ai additional lessons", "LeetCode catch-up"] }
        ]
      },
      {
        title: "Week 2 — Tokenization + Attention Mechanism",
        tag: "Days 5–11",
        days: [
          { title: "Day 5–7: Tokenization + Text Representation",
            topics: ["Word-level, subword (BPE, WordPiece), character-level", "HuggingFace tokenizers library", "Word embeddings (Word2Vec concept)", "Why tokenization matters for LLMs"] },
          { title: "Day 8–11: Attention Mechanism",
            topics: ["Self-attention intuition", "Query, Key, Value matrices", "Scaled dot-product attention", "Multi-head attention", "Read: 'The Illustrated Transformer'"] }
        ]
      },
      {
        title: "Week 3 — Transformer Architecture + HuggingFace",
        tag: "Days 12–18",
        days: [
          { title: "Day 12–14: Full Transformer Architecture",
            topics: ["Encoder-decoder structure", "Positional encoding", "Layer normalization, feed-forward layers", "BERT (encoder-only) vs GPT (decoder-only)"] },
          { title: "Day 15–18: HuggingFace Pipelines + BERT",
            topics: ["Pipeline API for 7+ NLP tasks", "Fine-tune BERT for sentiment classification", "Trainer API, evaluation metrics", "Named Entity Recognition (NER)"] }
        ]
      },
      {
        title: "Week 4 — Embeddings + Vector Search",
        tag: "Days 19–25",
        days: [
          { title: "Day 19–21: Sentence Embeddings",
            topics: ["Sentence-transformers library", "Generate embeddings for any text", "Cosine similarity for matching", "Compare embedding models"] },
          { title: "Day 22–25: FAISS + Semantic Search",
            topics: ["FAISS vector index setup", "Build: Semantic search API", "Embed documents → index → query → rank", "FastAPI endpoint for search"] }
        ]
      },
      {
        title: "Week 5 — Document Intelligence System",
        tag: "Days 26–31",
        days: [
          { title: "Day 26–31: Capstone Project",
            topics: ["Combine: classify + NER + search + summarize", "Multi-model pipeline", "FastAPI with all endpoints", "Push to GitHub: document-intelligence"] }
        ]
      }
    ],
    checklist: [
      "Explain how the Transformer architecture works",
      "Explain self-attention (Q, K, V)",
      "Difference between BERT and GPT",
      "Tokenize text using HuggingFace",
      "Fine-tune BERT for classification",
      "Generate sentence embeddings",
      "Build a FAISS vector index",
      "Build a semantic search API",
      "Explain positional encoding purpose",
      "Use HuggingFace pipelines for NLP tasks",
      "🎓 Complete DeepLearning.AI NLP Specialization"
    ],
    repos: ["nlp-transformer-experiments", "semantic-search-api", "document-intelligence"]
  },
  {
    id: 6, num: "07", title: "LLM APIs + RAG Systems",
    duration: "6 weeks", hours: "2–3 hrs/day, 4–5 hrs weekends", difficulty: "Medium",
    diffClass: "difficulty-medium",
    description: "THE money month. Build RAG systems and LLM-powered apps — 80% of AI Engineer job postings are this.",
    goals: [
      "Use OpenAI and open-source LLM APIs confidently",
      "Master prompt engineering techniques",
      "Build a complete RAG system from scratch",
      "Use LangChain for LLM applications",
      "Build and deploy a PDF chatbot",
      "Start networking: attend 1 virtual AI meetup or webinar",
      "🎓 Cert: LangChain Academy Certification + DeepLearning.AI Prompt Engineering — Free"
    ],
    resources: [
      { name: "ChatGPT Prompt Engineering for Devs", type: "DeepLearning.AI", cost: "Free", link: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/" },
      { name: "LangChain for LLM Application Dev", type: "DeepLearning.AI", cost: "Free", link: "https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/" },
      { name: "LangChain: Chat with Your Data", type: "DeepLearning.AI", cost: "Free", link: "https://www.deeplearning.ai/short-courses/langchain-chat-with-your-data/" },
      { name: "OpenAI API Docs", type: "Docs", cost: "~₹400-800/mo", link: "https://platform.openai.com/docs" },
      { name: "LangChain Docs", type: "Docs", cost: "Free", link: "https://python.langchain.com/docs/get_started/introduction" },
      { name: "ChromaDB Docs", type: "Docs", cost: "Free", link: "https://docs.trychroma.com/" }
    ],
    weeks: [
      {
        title: "Week 1 — NLP + Transformers Wrap-up",
        tag: "Days 1–4",
        days: [
          { title: "Day 1–4: Review + Preview (continued)",
            topics: ["Solidify transformer understanding", "Preview RAG concepts for Month 7", "LeetCode catch-up", "Rest if needed — hard months done!"] }
        ]
      },
      {
        title: "Week 2 — LLM APIs + Prompt Engineering",
        tag: "Days 5–11",
        days: [
          { title: "Day 5–7: OpenAI API + Basics",
            topics: ["API setup, chat completions", "Streaming responses, multi-turn conversations", "Temperature, max_tokens, system prompts", "Ollama for free local LLMs"] },
          { title: "Day 8–11: Prompt Engineering",
            topics: ["Zero-shot, few-shot, chain-of-thought", "System prompts for persona/constraints", "Output formatting (JSON mode)", "Prompt templates and best practices"] }
        ]
      },
      {
        title: "Week 3 — RAG From Scratch + LangChain",
        tag: "Days 12–18",
        days: [
          { title: "Day 12–14: Build RAG Without Frameworks",
            topics: ["Load → chunk → embed → store → retrieve → generate", "Text splitting strategies", "ChromaDB vector store", "Build complete RAG pipeline in plain Python"] },
          { title: "Day 15–18: LangChain RAG",
            topics: ["LangChain document loaders, text splitters", "LangChain retrievers and chains", "Conversational RAG with memory", "Compare: vanilla vs LangChain approach"] }
        ]
      },
      {
        title: "Week 4 — PDF Chatbot Project",
        tag: "Days 19–25",
        days: [
          { title: "Day 19–25: Build PDF Chatbot",
            topics: ["Upload PDF → parse → chunk → embed → index", "Chat endpoint with conversation history", "Streaming responses (SSE)", "FastAPI + ChromaDB + OpenAI/Ollama", "Push to GitHub: pdf-chatbot-rag"] }
        ]
      },
      {
        title: "Week 5 — Production RAG Features",
        tag: "Days 26–30",
        days: [
          { title: "Day 26–30: Production Polish + Job Prep Start",
            topics: ["Redis caching for repeated queries", "Hybrid search (semantic + keyword)", "Docker Compose (API + ChromaDB + Redis)", "Deploy and test production RAG", "Start drafting your resume — don't wait until Month 10"] }
        ]
      }
    ],
    checklist: [
      "Use OpenAI API for chat completions",
      "Implement streaming responses",
      "Apply prompt engineering techniques",
      "Build RAG from scratch (no frameworks)",
      "Build RAG with LangChain",
      "Use ChromaDB as a vector store",
      "Build a PDF chatbot with upload + chat",
      "Implement conversation memory",
      "Add Redis caching to RAG",
      "Deploy a production RAG system",
      "Attend 1 virtual AI meetup or webinar",
      "🎓 Complete LangChain Academy + Prompt Engineering certs"
    ],
    repos: ["llm-prompt-experiments", "rag-from-scratch", "pdf-chatbot-rag"]
  },
  {
    id: 7, num: "08", title: "Production RAG + DevOps for AI",
    duration: "5 weeks", hours: "2–3 hrs/day, 4–5 hrs weekends", difficulty: "Medium",
    diffClass: "difficulty-medium",
    description: "DevOps for AI systems. Advanced Docker, CI/CD pipelines, system design, monitoring. Start job hunting!",
    goals: [
      "Containerize AI projects professionally",
      "Set up CI/CD for AI applications",
      "Understand system design for AI",
      "Build production-quality RAG with monitoring",
      "Make your first open-source contribution (even a docs fix counts)",
      "START APPLYING FOR JOBS",
      "🎓 Cert: Docker Certified Associate ($195) or GitHub Actions Certification ($99)"
    ],
    resources: [
      { name: "Docker Mastery (Bret Fisher)", type: "Course", cost: "₹449", link: "https://www.udemy.com/course/docker-mastery/" },
      { name: "GitHub Actions Docs", type: "Docs", cost: "Free", link: "https://docs.github.com/en/actions" },
      { name: "Designing ML Systems (Chip Huyen)", type: "Book", cost: "₹800", link: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/" },
      { name: "ByteByteGo YouTube", type: "YouTube", cost: "Free", link: "https://www.youtube.com/@ByteByteGo" }
    ],
    weeks: [
      {
        title: "Week 1 — Advanced Docker",
        tag: "Days 1–7",
        days: [
          { title: "Day 1–4: Multi-Stage Builds + Compose",
            topics: ["Multi-stage Docker builds (smaller images)", "Docker Compose for full AI stack", "postgres + redis + chromadb + nginx + API", "Health checks, restart policies"] },
          { title: "Day 5–7: Container Optimization",
            topics: [".dockerignore best practices", "Layer caching strategies", "Security: non-root user, secrets"] }
        ]
      },
      {
        title: "Week 2 — CI/CD Deep Dive",
        tag: "Days 8–14",
        days: [
          { title: "Day 8–14: GitHub Actions for AI",
            topics: ["Multi-job pipeline (lint → test → build → deploy)", "Model performance CI (auto-test model quality)", "Secrets management for API keys", "Docker image build + push in CI", "Auto-deploy on merge to main"] }
        ]
      },
      {
        title: "Week 3 — System Design for AI",
        tag: "Days 15–21",
        days: [
          { title: "Day 15–18: Scaling AI Systems",
            topics: ["Horizontal vs vertical scaling", "Async processing with queues", "Rate limiting LLM API calls", "Cost optimization strategies"] },
          { title: "Day 19–21: Monitoring + Alerting",
            topics: ["RAG quality metrics tracking", "Request logging and analytics", "Alerting on quality drop", "System design document writing"] }
        ]
      },
      {
        title: "Week 4 — Polish + Start Job Hunt",
        tag: "Days 22–28",
        days: [
          { title: "Day 22–28: Portfolio Polish + Apply",
            topics: ["Polish all repos with great READMEs", "System design document for capstone", "Update resume and LinkedIn", "START APPLYING FOR JOBS NOW"] }
        ]
      }
    ],
    checklist: [
      "Build multi-stage Docker images",
      "Docker Compose with 4+ services",
      "CI/CD pipeline with GitHub Actions",
      "Model quality tests in CI",
      "Explain system design for a RAG system",
      "Monitor AI system quality metrics",
      "Secrets management for API keys",
      "Write a system design document",
      "Resume updated for AI roles",
      "Applied to first 10+ jobs",
      "Made 1+ open-source contribution",
      "🎓 Pass Docker Certified Associate or GitHub Actions cert"
    ],
    repos: ["production-rag-system"]
  },
  {
    id: 8, num: "09", title: "AI Agents + Fine-tuning + Evaluation",
    duration: "6 weeks", hours: "2–3 hrs/day, 4–5 hrs weekends", difficulty: "Hard",
    diffClass: "difficulty-hard",
    description: "Cutting-edge: AI agents, LLM fine-tuning, and AI evaluation — learn to test what you build, the skill most AI developers skip.",
    goals: [
      "Build AI agents with tool calling",
      "Fine-tune small LLMs with LoRA/QLoRA",
      "Build AI evaluation frameworks",
      "Create an AI test case generator (testing + AI combined)",
      "Understand hallucination detection",
      "Position yourself as an AI/LLM Developer — strong evaluation skills are your edge",
      "🎓 Cert: AWS ML Specialty (MLS-C01) — $300 (you now have enough depth)",
      "🎓 Cert: Hugging Face Course Certificate — Free, self-paced"
    ],
    resources: [
      { name: "Functions, Tools and Agents with LangChain", type: "DeepLearning.AI", cost: "Free", link: "https://www.deeplearning.ai/short-courses/functions-tools-agents-langchain/" },
      { name: "Fine Tuning Large Language Models", type: "DeepLearning.AI", cost: "Free", link: "https://www.deeplearning.ai/short-courses/finetuning-large-language-models/" },
      { name: "Building and Evaluating Advanced RAG", type: "DeepLearning.AI", cost: "Free", link: "https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/" },
      { name: "HuggingFace PEFT Docs", type: "Docs", cost: "Free", link: "https://huggingface.co/docs/peft" },
      { name: "LangGraph Docs", type: "Docs", cost: "Free", link: "https://langchain-ai.github.io/langgraph/" },
      { name: "RAGAS Docs", type: "Docs", cost: "Free", link: "https://docs.ragas.io/" }
    ],
    weeks: [
      {
        title: "Week 1 — AI Evaluation (Your Superpower)",
        tag: "Days 1–7",
        days: [
          { title: "Day 1–2: Understanding AI Quality",
            topics: ["Why AI evaluation is hard (no pass/fail)", "Metrics: correctness, faithfulness, relevance", "LLM-as-Judge pattern", "Automated vs human evaluation"] },
          { title: "Day 3–4: Build Evaluation Framework",
            topics: ["RAGEvaluator class (faithfulness, relevance, correctness)", "Evaluate dataset with aggregate metrics", "Pass rate and failure analysis"] },
          { title: "Day 5–6: RAGAS Framework",
            topics: ["RAGAS metrics for RAG evaluation", "Create evaluation datasets", "Automated evaluation pipelines"] },
          { title: "Day 7: AI Test Case Generator",
            topics: ["Auto-generate test cases for AI systems", "Normal, edge, adversarial, ambiguous cases", "Push to GitHub: ai-evaluation-framework"] }
        ]
      },
      {
        title: "Week 2 — AI Agents",
        tag: "Days 8–14",
        days: [
          { title: "Day 8–9: Agent Concepts",
            topics: ["What is an AI agent (LLM that takes actions)", "Tool calling / function calling", "Agent loop: Think → Act → Observe → Repeat", "ReAct, plan-and-execute patterns"] },
          { title: "Day 10–11: Build Agent with Tool Calling",
            topics: ["OpenAI function calling API", "Define tools (search, calculate, DB query)", "Agent loop implementation", "Multi-tool reasoning"] },
          { title: "Day 12–14: LangChain Agents + LangGraph",
            topics: ["LangGraph state graph for workflows", "Multi-step agent pipelines", "Agent API endpoint", "Push to GitHub: ai-agent-system"] }
        ]
      },
      {
        title: "Week 3 — Fine-tuning LLMs",
        tag: "Days 15–21",
        days: [
          { title: "Day 15–16: Fine-tuning Theory",
            topics: ["Why fine-tune (specialize a general model)", "LoRA: add small trainable matrices", "QLoRA: quantized LoRA (saves memory)", "RAG vs fine-tuning: when to use which"] },
          { title: "Day 17–18: Fine-tune with LoRA",
            topics: ["HuggingFace PEFT + TRL libraries", "BitsAndBytes 4-bit quantization", "Training data preparation", "Fine-tune on Google Colab (free GPU)"] },
          { title: "Day 19–21: Evaluate Fine-tuned Model",
            topics: ["Compare base vs fine-tuned model", "Measure task-specific accuracy", "Check for regressions", "Push to GitHub: fine-tuned-llm"] }
        ]
      },
      {
        title: "Week 4 — AI-Powered QA Tool (Unique Project)",
        tag: "Days 22–28",
        days: [
          { title: "Day 22–28: AI QA Platform Capstone",
            topics: ["Auto-generate test cases for AI systems", "Run evaluations against any RAG endpoint", "Hallucination detection endpoint", "Evaluation reports and dashboards", "Docker deployment + CI/CD", "Push to GitHub: ai-qa-platform"] }
        ]
      },
      {
        title: "Week 5 — Buffer + Advanced",
        tag: "Days 29–30",
        days: [
          { title: "Day 29–30: Catch-up + Explore",
            topics: ["CrewAI multi-agent systems (if ahead)", "LLM safety and alignment", "Practice explaining concepts", "LeetCode: graphs, design problems"] }
        ]
      }
    ],
    checklist: [
      "Build an AI evaluation framework",
      "Use RAGAS for RAG evaluation",
      "Detect hallucinations in AI outputs",
      "Build an AI test case generator",
      "Build an agent with tool calling",
      "Use LangGraph for agent workflows",
      "Fine-tune an LLM with LoRA",
      "Explain RAG vs fine-tuning tradeoffs",
      "Deploy AI QA platform",
      "Write blog post: 'How I Became an AI Developer'",
      "Explain LLM-as-Judge evaluation",
      "🎓 Complete Hugging Face Course Certificate",
      "🎓 Pass AWS ML Specialty (MLS-C01)"
    ],
    repos: ["ai-evaluation-framework", "ai-agent-system", "ai-qa-platform"]
  },
  {
    id: 9, num: "10", title: "Portfolio, Capstone & Job Prep",
    duration: "8 weeks", hours: "2–3 hrs/day, 5–6 hrs weekends", difficulty: "Medium",
    diffClass: "difficulty-medium",
    description: "Final stretch: flagship capstone, portfolio polish, dedicated interview preparation, and aggressive job applications. Interview prep is separate from learning: revise core subjects, solve timed problems, and practice explaining decisions.",
    goals: [
      "Complete a FLAGSHIP capstone project",
      "Polish GitHub portfolio (22+ repos with great READMEs)",
      "Resume tailored for AI/LLM engineering roles",
      "Be interview-ready (Python, DSA, CS fundamentals, system design, AI, behavioral)",
      "Apply to 50+ jobs",
      "🎓 Cert: AWS AI Practitioner (AIF-C01) — $75, online proctored"
    ],
    resources: [
      { name: "Pramp.com — Mock Interviews", type: "Practice", cost: "Free", link: "https://www.pramp.com/" },
      { name: "Interviewing.io", type: "Practice", cost: "Free", link: "https://interviewing.io/" },
      { name: "NeetCode — Interview Prep", type: "Practice", cost: "Free", link: "https://neetcode.io/practice" },
      { name: "ByteByteGo — System Design", type: "YouTube", cost: "Free", link: "https://www.youtube.com/@ByteByteGo" },
      { name: "GitHub Pages / Vercel", type: "Tool", cost: "Free", link: "https://pages.github.com/" }
    ],
    weeks: [
      {
        title: "Week 1 — AI Agents Wrap-up",
        tag: "Days 1–5",
        days: [
          { title: "Day 1–5: Catch-up + Explore (continued)",
            topics: ["CrewAI multi-agent systems (if ahead)", "LLM safety and alignment", "Practice explaining concepts", "LeetCode: graphs, design problems"] }
        ]
      },
      {
        title: "Week 2–3 — Flagship Capstone",
        tag: "Days 6–19",
        days: [
          { title: "Day 6–11: Core Build",
            topics: ["Enterprise AI Platform: FastAPI + RAG + Agents + Evaluation", "JWT auth, document upload, multi-tenant", "RAG pipeline with hybrid search", "AI agent with tool calling"] },
          { title: "Day 12–17: Features + Quality",
            topics: ["Quality monitoring dashboard", "Redis caching, rate limiting", "Tests (80%+ coverage)", "CI/CD pipeline"] },
          { title: "Day 18–19: Deploy + Document",
            topics: ["Docker Compose full stack", "Stellar README + API docs + architecture", "Record demo (GIF/video)", "Push to GitHub: enterprise-ai-platform"] }
        ]
      },
      {
        title: "Week 4 — GitHub Portfolio Polish",
        tag: "Days 20–26",
        days: [
          { title: "Day 20–23: Audit All Repos",
            topics: ["Clean READMEs for every repo", "Remove debug code, fix .gitignore", "Consistent naming, MIT license", "Pin 6 best repos on profile"] },
          { title: "Day 24–26: Profile + Website",
            topics: ["GitHub profile README", "Optional: portfolio website (GitHub Pages)", "Blog posts (2–3 on Medium/dev.to)"] }
        ]
      },
      {
        title: "Week 5 — Resume + LinkedIn + Strategy",
        tag: "Days 27–31",
        days: [
          { title: "Day 27–28: Resume",
            topics: ["One page, AI-focused", "Projects section > Experience section", "Numbers everywhere (95% faithfulness, 85% coverage)", "ATS-friendly format (no tables/images)"] },
          { title: "Day 29–30: LinkedIn Optimization",
            topics: ["Headline: 'AI/LLM Developer | RAG Systems & LLM Applications'", "Featured: capstone project, AI QA platform, blog post", "Skills: LLM, RAG, AI Evaluation, LangChain, PyTorch, FastAPI"] },
          { title: "Day 31: Job Strategy",
            topics: ["Target: 10 applications/day", "LinkedIn Jobs, Wellfound, Hacker News", "Cold outreach templates", "Track in spreadsheet"] }
        ]
      },
      {
        title: "Week 6 — Interview Preparation",
        tag: "Days 32–38",
        days: [
          { title: "Day 32–33: Python + Core CS Revision",
            topics: ["Python interview questions: data model, OOP, exceptions, iterators, generators, decorators", "Operating Systems: processes, threads, memory, scheduling, synchronization", "DBMS: SQL, normalization, indexes, transactions, joins", "Computer Networking: HTTP, TCP/IP, DNS, REST, authentication"] },
          { title: "Day 34: Web Development + Project Discussion",
            topics: ["Explain one backend and one web project end to end", "API design, databases, Redis caching, background jobs, testing, and deployment", "Justify technology choices and discuss tradeoffs", "Prepare concise project stories using problem -> approach -> result"] },
          { title: "Day 35: DSA Pattern Revision",
            topics: ["Work through a curated list of 450 DSA questions by pattern, not random order", "Arrays, strings, hash maps, two pointers, sliding window, stacks, queues, trees, graphs, heaps, recursion, and dynamic programming", "Re-solve missed questions without notes and record the key insight"] },
          { title: "Day 36: System Design for AI",
            topics: ["Design a Document Q&A system", "Design a chatbot with memory", "Framework: requirements → design → deep dive → quality → scale"] },
          { title: "Day 37: AI Concept Questions",
            topics: ["20 must-know AI interview questions", "RAG, transformers, attention, embeddings", "Hallucination, evaluation, fine-tuning", "Practice answering out loud"] },
          { title: "Day 38: Competitive Programming + Mock Interview",
            topics: ["LeetCode: timed practice and review of failed attempts", "Codeforces Div. 2: solve at least one contest or virtual contest", "Understand CP as a long-term skill; prioritize consistency over rating", "Aptitude, reasoning, programming MCQs, puzzles, and one mock interview"] }
        ]
      },
      {
        title: "Week 7 — Certifications + Interview Readiness",
        tag: "Days 39–45",
        days: [
          { title: "Day 39–41: Certification Review",
            topics: ["Choose certifications that match the target role instead of collecting unrelated badges", "Review official objectives, practice questions, and weak areas", "Schedule one certification attempt only after passing practice tests consistently"] },
          { title: "Day 42–43: Interview Question Bank",
            topics: ["Create short answers for Python, OOP, OS, DBMS, networking, ML, Redis, web development, and system design", "Practice explaining solutions without memorized wording", "Separate knowledge gaps from communication or time-management gaps"] },
          { title: "Day 44–45: Full Interview Simulation",
            topics: ["One timed coding round, one CS fundamentals round, one system design round", "Review mistakes and update the personal question bank", "Interview preparation validates recall and problem-solving under constraints; it is different from the main learning roadmap"] }
        ]
      },
      {
        title: "Week 8 — Launch Job Hunt",
        tag: "Days 46–54",
        days: [
          { title: "Day 46–54: Apply + Continue Learning",
            topics: ["Apply to 10+ jobs per day", "1 blog post per week", "2–3 LeetCode per day", "Join AI communities (Discord, meetups, local AI groups)", "Open-source contributions (even docs fixes)", "Reach out to people on LinkedIn doing AI quality work"] }
        ]
      }
    ],
    checklist: [
      "Capstone project complete and deployed",
      "All 22+ repos have clean READMEs",
      "6 best repos pinned on GitHub",
      "GitHub profile README created",
      "Resume polished (1 page, AI-focused)",
      "LinkedIn optimized",
      "Can explain each project in 2 minutes",
      "Practiced 20 common AI interview questions",
      "Completed 2+ mock interviews",
      "Applied to 50+ jobs",
      "Can whiteboard design a RAG system",
      "Can solve Medium LeetCode in 25 min",
      "Revise Python, OOP, OS, DBMS, and networking fundamentals",
      "Complete a curated DSA question list and review missed problems",
      "Practice LeetCode and Codeforces Div. 2 consistently",
      "Revise web development, Redis, ML, and project tradeoffs",
      "Complete aptitude, reasoning, programming MCQ, and puzzle practice",
      "Complete certification preparation for the target role",
      "🎓 Pass AWS AI Practitioner (AIF-C01)"
    ],
    repos: ["enterprise-ai-platform"]
  }
];

// ── Roadmap variant: AI + Full-Stack Backend Developer (10 months authored) ──

export const MONTHS_AI_FULLSTACK = [
  {
    id: 0, num: "01", title: "Python Foundations + FastAPI Basics",
    duration: "6 weeks", hours: "2–3 hrs/day, 4–5 hrs weekends", difficulty: "Easy-Medium",
    diffClass: "difficulty-easy",
    description: "Go from basic Python to confident backend developer. Build real FastAPI services with Postgres, JWT auth, Docker, and pytest. Write tests from day one — test-first is the norm, not the exception.",
    goals: [
      "Write Pythonic code (OOP, decorators, generators, type hints)",
      "Ship a REST API with FastAPI + Pydantic v2 validation",
      "Connect to PostgreSQL with SQLAlchemy",
      "Add JWT authentication that you can defend in an interview",
      "Dockerize an app and run it with docker-compose",
      "Cover code with pytest — make testing a habit, not an afterthought",
      "3 GitHub repos with clean READMEs by the end of the month"
    ],
    resources: [
      { name: "Python for Everybody (Dr. Chuck)", type: "Course", cost: "Free", link: "https://www.py4e.com/" },
      { name: "Corey Schafer — OOP, Decorators, Generators", type: "YouTube", cost: "Free", link: "https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU" },
      { name: "FastAPI Official Tutorial", type: "Docs", cost: "Free", link: "https://fastapi.tiangolo.com/tutorial/" },
      { name: "SQLAlchemy 2.0 ORM Quickstart", type: "Docs", cost: "Free", link: "https://docs.sqlalchemy.org/en/20/orm/quickstart.html" },
      { name: "Miguel Grinberg — FastAPI Auth blog series", type: "Blog", cost: "Free", link: "https://blog.miguelgrinberg.com/" },
      { name: "TestDriven.io — free FastAPI articles", type: "Articles", cost: "Free", link: "https://testdriven.io/blog/" },
      { name: "NeetCode.io — DSA roadmap", type: "Practice", cost: "Free", link: "https://neetcode.io/" },
      { name: "uv — fast Python package + env manager", type: "Docs", cost: "Free", link: "https://docs.astral.sh/uv/" },
      { name: "Ruff — linter + formatter (one tool)", type: "Docs", cost: "Free", link: "https://docs.astral.sh/ruff/" }
    ],
    weeks: [
      {
        title: "Week 1 — Python Core Deep Dive",
        tag: "Days 1–7",
        days: [
          { title: "Day 1–2: Data structures & Big-O",
            topics: ["Mutable vs immutable — trace what actually changes in memory", "list / tuple / set / dict — pick based on lookup vs order vs uniqueness", "Big-O of common operations (dict.get is O(1), list.index is O(n))", "Hash tables — why they're behind dict and set", "Type hints as documentation you can lint"] },
          { title: "Day 3–4: Object-oriented Python",
            topics: ["Classes, __init__, self, instance vs class attributes", "Inheritance, super(), when NOT to inherit", "Dunder methods: __str__, __repr__, __eq__, __len__", "@classmethod vs @staticmethod — actual use cases", "Build: Bank Account System (Account → SavingsAccount → CheckingAccount) with tests"] },
          { title: "Day 5–6: Decorators, generators, context managers",
            topics: ["Decorators from scratch: closures → decorator → parametrised decorator → @functools.wraps", "Generators: yield, generator expressions, lazy evaluation", "Write 3 decorators: @timing, @retry, @log_calls", "Context managers: with statement + writing your own via @contextmanager"] },
          { title: "Day 7: Mini project — CLI expense tracker",
            topics: ["OOP (Expense, Category, Tracker) + decorators + JSON persistence", "argparse for CLI arguments", "Add / list / delete / filter-by-month commands", "Push to GitHub: py-expense-cli with README + usage examples"] }
        ]
      },
      {
        title: "Week 2 — FastAPI + Pydantic",
        tag: "Days 8–14",
        days: [
          { title: "Day 8–9: HTTP + first FastAPI app",
            topics: ["HTTP methods and correct status codes (200/201/204/400/401/403/404/409/422/500)", "Path parameters vs query parameters vs body", "FastAPI Hello World, then a small in-memory notes API", "Swagger UI at /docs — the fastest API feedback loop you've ever had", "uvicorn --reload for the dev server"] },
          { title: "Day 10–11: Pydantic v2 + CRUD",
            topics: ["BaseModel, Field constraints, custom validators", "Separate request models from response models (avoid leaking password hashes etc.)", "Build: Task Manager API (in-memory dict store)", "Proper error responses with HTTPException + custom exception handlers"] },
          { title: "Day 12–13: Postman meets your own API",
            topics: ["Import the OpenAPI spec straight into Postman", "Write positive + negative test collections (this is your comfort zone — go fast)", "Environment variables for base URL and tokens", "Save the collection alongside the repo — a portfolio artifact"] },
          { title: "Day 14: Polish + push",
            topics: ["Modern Python tooling: uv for env + deps (pyproject.toml + uv.lock) instead of raw pip/requirements.txt", "ruff for lint + format (one tool replaces black + flake8 + isort)", ".gitignore, README, architecture diagram (draw.io or Excalidraw)", "Push to GitHub: fastapi-task-manager"] }
        ]
      },
      {
        title: "Week 3 — Postgres + SQLAlchemy",
        tag: "Days 15–21",
        days: [
          { title: "Day 15–16: SQL fundamentals",
            topics: ["CREATE, SELECT, INSERT, UPDATE, DELETE — write by hand, don't shortcut", "JOIN types (INNER, LEFT) with a paper diagram", "Run Postgres in Docker (one command, no local install)", "Use TablePlus or DBeaver as GUI — skip pgAdmin"] },
          { title: "Day 17–18: SQLAlchemy 2.0 ORM",
            topics: ["Engine, Session, declarative_base with typed models", "Relationships: one-to-many, many-to-many", "CRUD via the session pattern", "Introduce Alembic (autogenerate first migration, review it — don't blindly trust)"] },
          { title: "Day 19–20: Rebuild Task Manager on Postgres",
            topics: ["Replace in-memory dict with real DB", "Add filtering, sorting, limit/offset pagination", "Handle unique constraint violations gracefully (409 conflict)", "Write 5 pytest tests covering happy + error paths"] },
          { title: "Day 21: Polish + push polished v2",
            topics: ["docker-compose stub for local Postgres", "README with 'run this in 3 commands' section", "Push updated fastapi-task-manager"] }
        ]
      },
      {
        title: "Week 4 — Auth + Async",
        tag: "Days 22–28",
        days: [
          { title: "Day 22–23: JWT authentication",
            topics: ["JWT anatomy (header . payload . signature) — don't trust it, verify it", "Password hashing with passlib + bcrypt (never store plaintext)", "Register / login / /me endpoints", "Protecting routes with Depends(get_current_user)"] },
          { title: "Day 24–25: Async fundamentals for backend devs",
            topics: ["sync vs async — the 30-second version and when it actually matters", "async def + await, no thread magic", "FastAPI endpoints as async by default", "httpx.AsyncClient for outbound calls (never use requests in async)"] },
          { title: "Day 26–27: Error handling + logging",
            topics: ["Global exception handlers vs per-route try/except", "Python logging: levels, formatters, propagation", "Structured logging with structlog (or just JSON formatter)", "Correlation IDs / request IDs in logs"] },
          { title: "Day 28: DSA catch-up",
            topics: ["Two-pointer patterns (Valid Palindrome #125, Two Sum II #167)", "Redo any Week 1–3 problem you couldn't solve without hints", "Push notes to your notebook"] }
        ]
      },
      {
        title: "Week 5 — Docker + Testing",
        tag: "Days 29–35",
        days: [
          { title: "Day 29–30: Docker fundamentals",
            topics: ["Containers vs VMs (30-second version)", "Dockerfile: FROM, WORKDIR, COPY, RUN, CMD, EXPOSE", "docker build / run / logs / exec", "Multi-stage build for a smaller final image"] },
          { title: "Day 31–32: docker-compose",
            topics: ["API + Postgres in one compose file", "depends_on with healthchecks (not just 'start it and pray')", "Environment variables via .env", "docker-compose up --build vs up -d", "Persist Postgres data with a named volume"] },
          { title: "Day 33–35: Pytest as a backend dev (your zone)",
            topics: ["pytest fixtures, conftest.py, scopes (function/module/session)", "@pytest.mark.parametrize for multiplying coverage", "httpx.AsyncClient with FastAPI TestClient pattern", "Test DB per test using SAVEPOINT + ROLLBACK", "Target: >70% coverage on Task Manager"] }
        ]
      },
      {
        title: "Week 6 — Consolidation Capstone",
        tag: "Days 36–42",
        days: [
          { title: "Day 36–40: Blog Platform API (fresh build, no copy-paste)",
            topics: ["JWT auth, CRUD posts, categories, tags", "Search + pagination + sorting", "Postgres + SQLAlchemy + Alembic migrations", "docker-compose (API + Postgres)", "pytest suite with fixtures, >70% coverage", "Structured logging + request IDs"] },
          { title: "Day 41–42: Deploy + document",
            topics: ["Deploy on Railway or Render (free tier)", "README with architecture diagram, features, run instructions", "Screenshots + short demo GIF", "Push to GitHub: fastapi-blog-platform"] }
        ]
      }
    ],
    checklist: [
      "Write Pythonic OOP with dunder methods",
      "Build 3 decorators from scratch (@timing, @retry, @log_calls)",
      "Use generators and context managers appropriately",
      "Set up a project with uv (pyproject.toml + uv.lock)",
      "Lint + format with ruff",
      "Create a FastAPI app with Pydantic v2 models",
      "Connect FastAPI to PostgreSQL via SQLAlchemy 2.0",
      "Run Alembic migrations (autogenerate + review)",
      "Implement JWT authentication with bcrypt password hashing",
      "Write async endpoints and use httpx.AsyncClient",
      "Add structured logging with correlation IDs",
      "Dockerize a FastAPI app with a multi-stage build",
      "Write docker-compose.yml with healthchecks",
      "Reach 70%+ pytest coverage on one project",
      "Deploy one project to a public URL",
      "Push 3 GitHub repos with clean READMEs"
    ],
    repos: ["py-expense-cli", "fastapi-task-manager", "fastapi-blog-platform"]
  },

  {
    id: 1, num: "02", title: "Advanced FastAPI + Postgres + Testing + CI/CD",
    duration: "5 weeks", hours: "2–3 hrs/day, 4–5 hrs weekends", difficulty: "Medium",
    diffClass: "difficulty-medium",
    description: "Level up to production-shaped backends: middleware, background tasks, advanced Postgres (indexes + N+1 hunting), 80%+ pytest coverage, Schemathesis contract testing (your differentiator), and a real GitHub Actions pipeline.",
    goals: [
      "Write custom FastAPI middleware and background tasks",
      "Read EXPLAIN output and add indexes that actually help",
      "Detect + fix N+1 queries with SQLAlchemy loader strategies",
      "Reach 80%+ pytest coverage using fixtures and parametrize",
      "Add Schemathesis property-based contract tests to CI",
      "Ship a GitHub Actions pipeline (lint → test → build → push image)"
    ],
    resources: [
      { name: "FastAPI Advanced Docs", type: "Docs", cost: "Free", link: "https://fastapi.tiangolo.com/advanced/" },
      { name: "GitHub Actions Docs", type: "Docs", cost: "Free", link: "https://docs.github.com/en/actions" },
      { name: "Schemathesis Docs", type: "Docs", cost: "Free", link: "https://schemathesis.readthedocs.io/" },
      { name: "TestDriven.io — TDD with FastAPI", type: "Articles", cost: "Free (blog)", link: "https://testdriven.io/blog/topics/fastapi/" },
      { name: "Use The Index, Luke!", type: "Book (online)", cost: "Free", link: "https://use-the-index-luke.com/" },
      { name: "Awesome Compose (docker-compose examples)", type: "Repo", cost: "Free", link: "https://github.com/docker/awesome-compose" }
    ],
    weeks: [
      {
        title: "Week 1 — Advanced FastAPI Patterns",
        tag: "Days 1–7",
        days: [
          { title: "Day 1–2: Middleware you'll actually write",
            topics: ["ASGI request/response cycle in one diagram", "Built-in middleware: CORSMiddleware, GZipMiddleware, TrustedHostMiddleware", "Custom middleware: request ID + timing + structured access log", "Middleware ordering — why it matters"] },
          { title: "Day 3–4: Background tasks + file uploads",
            topics: ["FastAPI BackgroundTasks — when it's enough, when it isn't", "Send-email-after-signup pattern", "UploadFile: streaming, size limits, MIME sniffing", "Serve static files behind FastAPI (or offload to a bucket)"] },
          { title: "Day 5–7: WebSockets + API design",
            topics: ["WebSocket endpoint basics + a minimal in-memory chat room", "Connection manager pattern (broadcast, disconnect handling)", "Pagination: offset vs cursor (when to pick which)", "API versioning strategies (v1/v2, header vs path)", "OpenAPI polish — tags, summaries, examples"] }
        ]
      },
      {
        title: "Week 2 — Advanced Postgres + SQLAlchemy",
        tag: "Days 8–14",
        days: [
          { title: "Day 8–9: Indexing + query performance",
            topics: ["EXPLAIN vs EXPLAIN ANALYZE — read them, don't skim", "B-tree vs hash vs GIN — the 90% version", "When to add an index (and when it hurts writes)", "Composite indexes: column order matters", "Practice: profile Task Manager, add 2 indexes with justification"] },
          { title: "Day 10–11: Transactions + isolation",
            topics: ["BEGIN / COMMIT / ROLLBACK in psql", "Isolation levels overview (READ COMMITTED vs REPEATABLE READ)", "SQLAlchemy Session lifecycle (unit of work)", "Nested transactions with SAVEPOINT"] },
          { title: "Day 12–13: N+1 detection + fixes",
            topics: ["The N+1 problem — draw it once, spot it forever", "selectinload vs joinedload vs subqueryload", "Log SQL statements in dev to see what actually runs", "Write a test that fails on N+1 (query count assertion)"] },
          { title: "Day 14: Alembic migrations deep dive",
            topics: ["autogenerate → review every diff → edit → apply", "Reversible migrations (write your downgrade)", "Data migrations vs schema migrations", "Practice: 3 real migrations on your Blog Platform"] }
        ]
      },
      {
        title: "Week 3 — Testing Mastery + Schemathesis",
        tag: "Days 15–21",
        days: [
          { title: "Day 15–16: pytest deep dive",
            topics: ["Fixture scopes (function/module/session) and autouse — pick with intent", "Parametrize for multiplying coverage without duplicating code", "conftest.py hierarchies", "factory-boy or plain fixture factories for test data"] },
          { title: "Day 17–18: FastAPI integration testing",
            topics: ["httpx.AsyncClient with FastAPI (TestClient sync too, know both)", "Isolated DB per test using SAVEPOINT + ROLLBACK", "Overriding Depends() in tests", "Testing auth flows end-to-end"] },
          { title: "Day 19–20: Schemathesis property-based contract testing",
            topics: ["Point Schemathesis at your OpenAPI spec", "Auto-generates edge cases you'd never write manually", "Integrate with pytest so it runs in CI", "Compare with your hand-written Postman tests — count the bugs found", "Automated contract testing is a skill that impresses interviewers"] },
          { title: "Day 21: 80% coverage push",
            topics: ["Run coverage.py; find the 3 files below 80%", "Write missing branch tests", "Fail CI if coverage drops"] }
        ]
      },
      {
        title: "Week 4 — CI/CD with GitHub Actions",
        tag: "Days 22–28",
        days: [
          { title: "Day 22–24: GitHub Actions basics",
            topics: ["Workflow YAML anatomy — jobs / steps / runners", "Cache uv dependencies (uv sync in CI — fast, reproducible)", "Matrix builds (Python 3.12 + 3.13)", "Run pytest on every push and every PR"] },
          { title: "Day 25–26: Quality gates",
            topics: ["ruff for lint + format (replace black + flake8)", "mypy for typing (fail on new errors, not existing)", "pre-commit hooks for local + CI parity", "Enforce >=80% coverage and passing Schemathesis"] },
          { title: "Day 27–28: Docker in CI",
            topics: ["Build image in CI, tag with git SHA + branch", "Push to GitHub Container Registry (ghcr.io)", "Cache Docker layers for fast rebuilds", "Deploy step on merge to main (optional but useful)"] }
        ]
      },
      {
        title: "Week 5 — Capstone: Notes API v2",
        tag: "Days 29–35",
        days: [
          { title: "Day 29–33: Notes API v2 (fresh build)",
            topics: ["Users, folders, notes, shared-with-user permissions", "Postgres full-text search (tsvector + GIN index)", "WebSocket 'note updated' notifications", "docker-compose (API + Postgres) with healthchecks", "Alembic migrations, Schemathesis in CI, ruff + mypy gates"] },
          { title: "Day 34–35: Deploy + document",
            topics: ["Deploy on Railway (or Fly.io)", "Portfolio-grade README (architecture, run steps, screenshots)", "Publish CI + coverage badges on the repo", "Push to GitHub: notes-api-v2"] }
        ]
      }
    ],
    checklist: [
      "Write a custom FastAPI middleware (request ID + timing)",
      "Use BackgroundTasks for a real async job",
      "Handle file uploads with size limits",
      "Read EXPLAIN ANALYZE and justify an index change",
      "Detect + fix an N+1 query and prove it with a test",
      "Write reversible Alembic migrations",
      "Reach 80%+ pytest coverage",
      "Add Schemathesis contract tests to CI",
      "Ship a GitHub Actions pipeline (lint → test → build → push)",
      "Publish CI + coverage badges on a repo",
      "Deploy notes-api-v2 to a public URL"
    ],
    repos: ["notes-api-v2", "(extend fastapi-blog-platform with CI/CD + Schemathesis)"]
  },

  {
    id: 2, num: "03", title: "Async Patterns, Redis, Celery, System Design",
    duration: "4 weeks", hours: "2–3 hrs/day, 4–5 hrs weekends", difficulty: "Medium",
    diffClass: "difficulty-medium",
    description: "The plumbing that turns a demo into a real backend. Deep asyncio patterns, Redis for caching + rate limiting + sessions, Celery for background jobs, and enough system design vocabulary to defend a chatbot backend on a whiteboard.",
    goals: [
      "Master real asyncio patterns (gather, TaskGroup, timeouts, cancellation)",
      "Cache API responses with Redis and pick the right invalidation strategy",
      "Implement rate limiting with Redis (fixed / sliding window / token bucket)",
      "Run background jobs with Celery + Redis broker + docker-compose",
      "Draw a chatbot backend architecture and explain every arrow",
      "Extend an existing project with caching + rate limiting + a worker"
    ],
    resources: [
      { name: "Real Python — Asyncio articles", type: "Articles", cost: "Free", link: "https://realpython.com/tutorials/async-io/" },
      { name: "Redis Docs — Data types & commands", type: "Docs", cost: "Free", link: "https://redis.io/docs/latest/develop/data-types/" },
      { name: "TestDriven.io — FastAPI + Celery", type: "Article", cost: "Free (blog)", link: "https://testdriven.io/blog/fastapi-and-celery/" },
      { name: "Celery Docs — Getting Started", type: "Docs", cost: "Free", link: "https://docs.celeryq.dev/en/stable/getting-started/introduction.html" },
      { name: "ByteByteGo — System Design YouTube", type: "YouTube", cost: "Free", link: "https://www.youtube.com/@ByteByteGo" },
      { name: "Designing Data-Intensive Applications — Chapters 1–3", type: "Book", cost: "₹800 / library", link: "https://dataintensive.net/" }
    ],
    weeks: [
      {
        title: "Week 1 — Deep Async Patterns",
        tag: "Days 1–7",
        days: [
          { title: "Day 1–2: asyncio the way it actually works",
            topics: ["Event loop, coroutines, tasks, futures — one mental model", "What blocks the loop (CPU work, blocking I/O) and what doesn't", "When NOT to use async (CPU-bound → processes; simple scripts → sync)"] },
          { title: "Day 3–4: Concurrent patterns",
            topics: ["asyncio.gather() — fire N calls, wait for all", "asyncio.TaskGroup (3.11+) — structured concurrency", "asyncio.wait_for + asyncio.shield — timeouts done right", "Cancellation semantics — what happens to in-flight work"] },
          { title: "Day 5–6: httpx.AsyncClient in production",
            topics: ["Connection pooling, per-request timeouts", "Retries + exponential backoff with tenacity", "Circuit breaker pattern (concept + when to reach for it)"] },
          { title: "Day 7: Mini project — async URL health checker",
            topics: ["Read 100 URLs from a file", "Hit them concurrently with a semaphore-limited pool", "Report status code + latency as a table", "Push to GitHub: async-url-checker"] }
        ]
      },
      {
        title: "Week 2 — Redis Fundamentals + Caching",
        tag: "Days 8–14",
        days: [
          { title: "Day 8–9: Redis basics",
            topics: ["Run Redis in Docker (single command)", "Data types: strings, hashes, lists, sets, sorted sets — pick by access pattern", "TTL + expiration policies", "redis-py + redis.asyncio — sync vs async client"] },
          { title: "Day 10–11: Cache-aside pattern in FastAPI",
            topics: ["Cache expensive queries with a Depends()-based helper", "Cache invalidation strategies (TTL / write-through / manual bust)", "Cache stampede prevention (single-flight lock)", "Measure: p50/p95 latency before and after — write it down"] },
          { title: "Day 12–13: Rate limiting with Redis",
            topics: ["Fixed window vs sliding window vs token bucket — pick with intent", "Implement one from scratch on Redis", "Then compare with slowapi middleware for FastAPI", "Test rate-limit behaviour with pytest"] },
          { title: "Day 14: Session storage",
            topics: ["Store session tokens in Redis (not in cookies)", "Refresh token flow", "Logout that actually invalidates a token"] }
        ]
      },
      {
        title: "Week 3 — Celery + Background Jobs",
        tag: "Days 15–21",
        days: [
          { title: "Day 15–16: Celery basics",
            topics: ["Broker (Redis) + result backend (Redis or Postgres)", "Define + call your first task", "docker-compose: API + worker + Redis in one file", "Task result tracking and inspection"] },
          { title: "Day 17–18: Real-world Celery patterns",
            topics: ["Task retries + exponential backoff", "Task chaining and groups", "Periodic tasks with Celery Beat (cron-style)", "When to use Celery vs FastAPI BackgroundTasks"] },
          { title: "Day 19–20: Observability",
            topics: ["Flower dashboard — running tasks, retries, failures", "Structured logging inside tasks", "Dead-letter queue pattern (concept)", "Alerting on task failure rate (concept + one metric)"] },
          { title: "Day 21: Mini project — daily digest worker",
            topics: ["Celery Beat schedule at 09:00 daily", "Query DB → format digest → send (SMTP or Mailhog for local)", "Push to GitHub: fastapi-celery-digest"] }
        ]
      },
      {
        title: "Week 4 — System Design + Consolidation",
        tag: "Days 22–28",
        days: [
          { title: "Day 22–23: Scaling primitives",
            topics: ["Horizontal vs vertical — cost, complexity, when each wins", "Load balancer basics (L4 vs L7, sticky sessions)", "Database read replicas (and what NOT to do with them)", "Stateless service design (why sessions in Redis, not memory)"] },
          { title: "Day 24–25: Design exercise — chatbot backend",
            topics: ["Requirements (10K daily users, 3s p95 latency, $200/month budget)", "Component diagram: FastAPI + Redis (cache + rate limit) + Postgres + queue + LLM API", "Bottlenecks + mitigations (rate limits, caching, request coalescing)", "Cost + latency budget on a spreadsheet", "Write it up as SYSTEM_DESIGN.md in your capstone repo"] },
          { title: "Day 26–28: Consolidation on Blog Platform",
            topics: ["Add Redis cache to the 2 hottest endpoints (with metrics)", "Add rate limiting on the auth routes", "Add a Celery worker (send-email-on-new-comment, thumbnail generation)", "Add structured logs with correlation IDs threaded through the worker", "Update README with new architecture diagram", "Push updated fastapi-blog-platform"] }
        ]
      }
    ],
    checklist: [
      "Explain when async helps and when it hurts",
      "Use asyncio.gather + TaskGroup + wait_for correctly",
      "Handle async cancellation without leaking work",
      "Use httpx.AsyncClient with retries and timeouts",
      "Cache API responses with Redis and measure the latency win",
      "Implement rate limiting (sliding window or token bucket)",
      "Store sessions in Redis with proper logout",
      "Set up Celery + Redis + docker-compose",
      "Add a Celery Beat periodic task",
      "Draw + defend a chatbot backend architecture",
      "Publish SYSTEM_DESIGN.md in a capstone repo",
      "Extend an existing project with cache + rate limit + worker"
    ],
    repos: ["async-url-checker", "fastapi-celery-digest", "(extend fastapi-blog-platform with Redis + Celery + system design doc)"]
  },

  {
    id: 3, num: "04", title: "Cloud (AWS) + Production Deployment + Observability",
    duration: "4 weeks", hours: "2–3 hrs/day, 4–5 hrs weekends", difficulty: "Medium",
    diffClass: "difficulty-medium",
    description: "Move from 'runs on my laptop' to 'runs in production'. Deep on 5 AWS services (EC2, RDS, S3, ECS/App Runner, CloudWatch) instead of shallow on 30. Structured logs, metrics, traces, real alerting. This is what separates hobbyists from hires.",
    goals: [
      "Deploy FastAPI to AWS with a real domain + HTTPS",
      "Use RDS Postgres, S3, IAM correctly (least-privilege by default)",
      "Load secrets from SSM Parameter Store or Secrets Manager",
      "Publish structured JSON logs to CloudWatch and query them",
      "Instrument custom metrics + basic OpenTelemetry traces",
      "Set alerts on error rate and p95 latency",
      "Deploy from GitHub Actions using OIDC (no long-lived AWS keys in CI)"
    ],
    resources: [
      { name: "AWS Free Tier", type: "Tool", cost: "Free (12 months)", link: "https://aws.amazon.com/free/" },
      { name: "AWS App Runner Docs", type: "Docs", cost: "Free", link: "https://docs.aws.amazon.com/apprunner/" },
      { name: "AWS ECS Fargate Docs", type: "Docs", cost: "Free", link: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html" },
      { name: "OpenTelemetry Python", type: "Docs", cost: "Free", link: "https://opentelemetry.io/docs/languages/python/" },
      { name: "AWS Skill Builder", type: "Course", cost: "Free tier", link: "https://skillbuilder.aws/" },
      { name: "LocalStack (test AWS locally, no cost)", type: "Tool", cost: "Free tier", link: "https://www.localstack.cloud/" }
    ],
    weeks: [
      {
        title: "Week 1 — AWS Core Services",
        tag: "Days 1–7",
        days: [
          { title: "Day 1–2: Account, IAM, CLI, budget alarms",
            topics: ["Create an AWS account, set a monthly budget alarm at $10", "IAM users, roles, policies — least privilege as a religion", "Never use root; create an admin IAM user with MFA", "AWS CLI + configure profiles"] },
          { title: "Day 3–4: EC2 + networking basics",
            topics: ["VPC, subnets, security groups — the 30-minute version", "Launch a t3.micro Ubuntu instance", "Connect via SSM Session Manager (no SSH key files)", "Deploy blog-platform by hand (git pull + docker run) — feel the pain, then automate it away next week"] },
          { title: "Day 5–7: RDS + S3",
            topics: ["Provision RDS Postgres (db.t3.micro) inside your VPC", "Connect blog-platform to RDS from EC2", "S3 basics: buckets, objects, presigned URLs", "Practice: upload profile pics to S3, serve via presigned URLs", "Keep monthly cost under $10 with free-tier limits"] }
        ]
      },
      {
        title: "Week 2 — Production Deployment",
        tag: "Days 8–14",
        days: [
          { title: "Day 8–9: ECR + App Runner (or ECS Fargate)",
            topics: ["Push blog-platform image to ECR", "App Runner: 'Docker image from ECR' — one-service deploy without cluster management", "For control (or interview cred): ECS Fargate with a task definition", "Environment variables + task IAM role"] },
          { title: "Day 10–11: Real domain + HTTPS",
            topics: ["Buy a cheap domain (Namecheap ~$10/yr) or use Route 53", "ACM certificate (free)", "Attach cert via App Runner custom domain (or ALB listener for ECS)", "Your API now lives at https://api.yourname.dev — screenshot this"] },
          { title: "Day 12–14: Secrets + config management",
            topics: ["SSM Parameter Store for non-secret config (env-like)", "Secrets Manager for DB credentials + API keys", "Load them into your container via task/service role (no hardcoded secrets)", "Rotate a DB password and confirm nothing breaks", "Delete every .env file from your repo history if any leaked"] }
        ]
      },
      {
        title: "Week 3 — Observability that actually works",
        tag: "Days 15–21",
        days: [
          { title: "Day 15–16: Structured logging",
            topics: ["JSON logs from Python (structlog or logging with jsonFormatter)", "CloudWatch Logs — one log group per service", "Correlation IDs threaded from request → worker → outbound call", "CloudWatch Logs Insights query: p95 latency, top errors, slow endpoints"] },
          { title: "Day 17–18: Metrics — RED method",
            topics: ["RED = Rate (RPS), Errors (%), Duration (p50/p95)", "CloudWatch built-in metrics from App Runner / ECS", "Publish 2–3 custom business metrics (e.g. 'posts_created', 'logins_failed')", "Draw a one-screen dashboard covering all RED signals"] },
          { title: "Day 19–20: Tracing",
            topics: ["OpenTelemetry-instrument for FastAPI (one-line auto-instrument)", "Export to AWS X-Ray or Jaeger (local) — pick one", "Trace an end-to-end request: API → DB → external HTTP → response", "Read the trace, identify the slowest span"] },
          { title: "Day 21: Alerting without alert fatigue",
            topics: ["CloudWatch Alarms on error rate > 1% for 5 min, p95 > 1s for 5 min", "SNS → email or Slack webhook", "What NOT to alert on (info logs, single failures, transient blips)", "Runbook per alert: what does an on-call do?"] }
        ]
      },
      {
        title: "Week 4 — CI/CD to AWS + Consolidation",
        tag: "Days 22–28",
        days: [
          { title: "Day 22–23: Deploy from GitHub Actions",
            topics: ["OIDC: GitHub Actions assumes an AWS role — no long-lived AWS keys", "Workflow: build image → push to ECR → update App Runner / ECS service", "Rolling deploy (no downtime) and how to observe it"] },
          { title: "Day 24–25: Lambda for scheduled jobs",
            topics: ["Lambda basics (handler, runtime, layers)", "EventBridge cron rule for a nightly job", "Real use: S3 cleanup or database daily-summary export", "Lambda vs Celery vs ECS — pick with intent"] },
          { title: "Day 26–28: Consolidation — full production Blog Platform",
            topics: ["Deploy to AWS with HTTPS + real domain + secrets + logs + metrics + alerts", "Add a Lambda for nightly stats export to S3", "Cost audit — write down actual $/month in the README", "Write AWS_DEPLOYMENT.md with architecture diagram (draw.io)", "Push updated fastapi-blog-platform"] }
        ]
      }
    ],
    checklist: [
      "IAM user with MFA and a least-privilege policy",
      "Deploy FastAPI to AWS (App Runner or ECS Fargate)",
      "Connect to RDS Postgres from your app",
      "Store + serve files via S3 with presigned URLs",
      "Serve HTTPS on a real custom domain (ACM)",
      "Load secrets from SSM or Secrets Manager (no hardcoded)",
      "Publish structured JSON logs to CloudWatch",
      "Query logs with CloudWatch Insights",
      "Publish 2+ custom metrics",
      "Auto-instrument OpenTelemetry traces",
      "Set alerts on error rate + p95 latency (with runbooks)",
      "Deploy from GitHub Actions via OIDC (no static keys)",
      "Write + schedule a Lambda for a real job",
      "Publish AWS_DEPLOYMENT.md + cost breakdown"
    ],
    repos: ["fastapi-blog-platform (extended: AWS deploy + observability)", "(optional: aws-lambda-s3-cleanup)"]
  },

  {
    id: 4, num: "05", title: "ML / DL Vocabulary for Practitioners",
    duration: "4 weeks", hours: "2–3 hrs/day, 3–4 hrs weekends", difficulty: "Medium",
    diffClass: "difficulty-medium",
    description: "Compressed ML/DL for engineers who ship AI features, not researchers. Intuition, vocabulary, pre-trained model use — no CNNs from scratch, no gradient descent by hand. The goal: 'can talk to an ML engineer and read their PRs' — not 'can be one'.",
    goals: [
      "Explain supervised / unsupervised / RL in one sentence each",
      "Read train/val/test splits + confusion matrix + precision/recall correctly",
      "Train + evaluate one scikit-learn classifier end-to-end",
      "Complete the PyTorch '60 minute blitz' MNIST tutorial (yes, copy it)",
      "Serve a pre-trained HuggingFace pipeline behind a FastAPI endpoint",
      "Explain tokenization, embeddings, and self-attention conceptually",
      "Ship one small ML-adjacent feature into Blog Platform (auto-tag or summarise)"
    ],
    resources: [
      { name: "StatQuest with Josh Starmer — ML playlist", type: "YouTube", cost: "Free", link: "https://www.youtube.com/@statquest" },
      { name: "3Blue1Brown — But what is a neural network?", type: "YouTube", cost: "Free", link: "https://www.youtube.com/watch?v=aircAruvnKk" },
      { name: "Andrej Karpathy — Neural Networks: Zero to Hero (Ep 1)", type: "YouTube", cost: "Free", link: "https://www.youtube.com/watch?v=VMj-3S1tku0" },
      { name: "Jay Alammar — The Illustrated Transformer", type: "Blog", cost: "Free", link: "https://jalammar.github.io/illustrated-transformer/" },
      { name: "HuggingFace NLP Course — Chapters 1–2", type: "Course", cost: "Free", link: "https://huggingface.co/learn/nlp-course/chapter1" },
      { name: "fast.ai — Practical Deep Learning (Lesson 1)", type: "Course", cost: "Free", link: "https://course.fast.ai/" },
      { name: "scikit-learn User Guide (skim only)", type: "Docs", cost: "Free", link: "https://scikit-learn.org/stable/user_guide.html" }
    ],
    weeks: [
      {
        title: "Week 1 — Classical ML in 5 days",
        tag: "Days 1–5",
        days: [
          { title: "Day 1–2: The ML mindset",
            topics: ["Supervised vs unsupervised vs RL — one-line examples each", "Train / val / test split — why all three (and what leakage is)", "Overfitting vs underfitting — the bias-variance intuition", "'Features' and 'labels' in one sentence", "Watch: StatQuest — Machine Learning Fundamentals playlist (first 4 videos)"] },
          { title: "Day 3–4: Your first model in scikit-learn",
            topics: ["sklearn shape: fit(X, y) → predict(X) → score(X, y)", "Linear regression: predict a house price (California housing dataset)", "Logistic regression: predict spam (SMS spam dataset)", "Metrics: precision, recall, F1, ROC-AUC — draw the confusion matrix on paper", "When accuracy is misleading (imbalanced classes)"] },
          { title: "Day 5: Trees, forests, XGBoost (30-minute version)",
            topics: ["Decision tree intuition (a big if-else)", "Random forest = many trees voting", "Why XGBoost is the go-to tabular baseline (and when to reach for it)", "Watch: StatQuest — Random Forests + Gradient Boost intuition"] }
        ]
      },
      {
        title: "Week 2 — Deep Learning Vocabulary",
        tag: "Days 6–11",
        days: [
          { title: "Day 6–7: Neural networks by intuition",
            topics: ["What a 'neuron' really is (weighted sum + activation)", "What 'training' means (adjust weights to reduce loss)", "Backprop in one paragraph (chain rule going backwards)", "Watch: 3Blue1Brown 'What is a neural network' + Karpathy micrograd intro (watch, don't code)"] },
          { title: "Day 8–9: PyTorch — the 60-minute tour",
            topics: ["Tensors = NumPy arrays with GPU + autograd", "nn.Module, forward(), loss, optimizer, training loop", "Copy the official PyTorch MNIST tutorial (copying is fine — the goal is not-scared)", "Google Colab GPU (free tier) for practice", "This is NOT the skill — this is knowing enough to read the code"] },
          { title: "Day 10–11: Pre-trained HuggingFace pipelines",
            topics: ["transformers.pipeline() — sentiment / NER / summarization in 3 lines", "Wrap a pipeline behind a FastAPI endpoint (be honest: this is slow, so cache)", "Model size vs latency vs VRAM — the production trade-offs"] }
        ]
      },
      {
        title: "Week 3 — Transformers + Embeddings",
        tag: "Days 12–17",
        days: [
          { title: "Day 12–13: Tokenization + embeddings",
            topics: ["Why tokenization matters (context window, cost, quirks)", "BPE tokenization intuition — tokenise a paragraph by hand on paper", "Word vs sentence embeddings — vectors that mean things", "sentence-transformers to embed text (all-MiniLM-L6-v2 = tiny + fast)", "Cosine similarity intuition"] },
          { title: "Day 14–15: The Transformer (illustrated)",
            topics: ["Read Jay Alammar's 'Illustrated Transformer' slowly (twice)", "Self-attention: Query / Key / Value with the library-search analogy", "Multi-head attention (parallel-heads intuition)", "BERT (encoder-only) vs GPT (decoder-only) vs T5 (both) — one sentence each"] },
          { title: "Day 16–17: Semantic search mini-project",
            topics: ["Take 500 blog posts (or Wikipedia dumps)", "Embed them with sentence-transformers (all-MiniLM-L6-v2)", "Store vectors in-memory (or FAISS in-memory) — no vector DB yet", "Query: embed → cosine similarity → top-K", "Wrap in a FastAPI endpoint", "Push: semantic-search-toy"] }
        ]
      },
      {
        title: "Week 4 — Consolidation + ML in your Blog Platform",
        tag: "Days 18–24",
        days: [
          { title: "Day 18–19: HuggingFace inference API + comparison",
            topics: ["HuggingFace Inference API (hosted, cheap for practice)", "Compare with local pipeline: latency, cost, model choice", "Preview: OpenAI + Anthropic APIs come in Month 06 — start reading their docs"] },
          { title: "Day 20–21: Ship one ML feature into Blog Platform",
            topics: ["Auto-tag posts with zero-shot classification (transformers.pipeline)", "Or summarise long posts with a small T5 model", "Add a fallback if the model is slow (rule-based tags or truncation)", "Test it, cache it, ship it behind a feature flag"] },
          { title: "Day 22–24: DSA + system design review",
            topics: ["Revisit Month 03's system design doc", "Add an 'ML inference service' component + its own SLO"] }
        ]
      }
    ],
    checklist: [
      "Explain supervised / unsupervised / RL each in 1 sentence",
      "Explain train/val/test split and data leakage",
      "Explain precision, recall, F1, ROC-AUC without notes",
      "Train + evaluate a scikit-learn classifier end-to-end",
      "Explain decision trees / random forests / XGBoost briefly",
      "Explain neuron → layer → network → loss → backprop",
      "Complete the PyTorch MNIST tutorial",
      "Serve a HuggingFace pipeline behind a FastAPI endpoint",
      "Explain tokenization and why the context window matters",
      "Explain self-attention with the Q/K/V analogy",
      "One-sentence difference between BERT, GPT, T5",
      "Build a semantic search API with sentence-transformers",
      "Ship one ML feature (auto-tag or summarise) into Blog Platform"
    ],
    repos: ["ml-quickstart (sklearn + PyTorch tutorials)", "semantic-search-toy", "fastapi-blog-platform (+1 ML feature)"]
  },

  {
    id: 5, num: "06", title: "Prompt Engineering + LLM APIs + Function Calling",
    duration: "5 weeks", hours: "2–3 hrs/day, 4–5 hrs weekends", difficulty: "Medium",
    diffClass: "difficulty-medium",
    description: "The heart of the AI + Backend Developer role. Deep on OpenAI + Anthropic + Ollama APIs. Prompt engineering as a discipline (not vibes). Structured outputs via Pydantic. Function calling / tool use. Cost + latency instrumentation. This is where your interview stories start.",
    goals: [
      "Call OpenAI, Anthropic, and a local Ollama model from Python confidently",
      "Write a provider-agnostic LLM wrapper (dev on Ollama, prod on paid APIs)",
      "Apply prompt patterns: zero-shot, few-shot, chain-of-thought, system prompts",
      "Get validated structured outputs via Pydantic + Instructor",
      "Implement function calling / tool use with 3+ tools end-to-end",
      "Instrument every LLM call with model, tokens, cost, latency",
      "Ship one LLM feature into Blog Platform ('Ask My Blog') and write about it publicly",
      "Expose your Blog API as an MCP server — tools an LLM or agent can call"
    ],
    resources: [
      { name: "OpenAI API Docs", type: "Docs", cost: "Free (usage $)", link: "https://platform.openai.com/docs" },
      { name: "Anthropic API Docs", type: "Docs", cost: "Free (usage $)", link: "https://docs.anthropic.com/" },
      { name: "Ollama — local LLMs, free", type: "Tool", cost: "Free", link: "https://ollama.com/" },
      { name: "Instructor (Pydantic + LLMs)", type: "Library", cost: "Free", link: "https://python.useinstructor.com/" },
      { name: "Simon Willison — Weblog", type: "Blog", cost: "Free", link: "https://simonwillison.net/" },
      { name: "DeepLearning.AI — ChatGPT Prompt Engineering for Devs", type: "Course", cost: "Free", link: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/" },
      { name: "Anthropic — Prompt engineering guide", type: "Docs", cost: "Free", link: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview" },
      { name: "Model Context Protocol — intro + spec", type: "Docs", cost: "Free", link: "https://modelcontextprotocol.io/" },
      { name: "MCP Python SDK (FastMCP)", type: "Repo", cost: "Free", link: "https://github.com/modelcontextprotocol/python-sdk" }
    ],
    weeks: [
      {
        title: "Week 1 — LLM APIs 101",
        tag: "Days 1–7",
        days: [
          { title: "Day 1–2: OpenAI API basics",
            topics: ["Get an API key, set a hard monthly usage cap", "Evergreen note: model names + token prices change fast — treat specific models (e.g. gpt-4o-mini, claude-haiku) and $/token figures in this roadmap as examples, and check the provider's current pricing page", "Chat completions endpoint (messages, roles: system/user/assistant)", "Streaming vs non-streaming responses", "temperature, top_p, max_tokens — with intuition, not guesswork"] },
          { title: "Day 3–4: Anthropic API + local Ollama",
            topics: ["Anthropic messages API — close to OpenAI, small but real differences (system param, no 'system' role)", "Install Ollama, pull llama3 + qwen2 + mistral", "Ollama's OpenAI-compatible endpoint means most libraries 'just work'", "Now you can develop 90% of the time without touching paid credits"] },
          { title: "Day 5–7: Provider-agnostic wrapper",
            topics: ["Design an LLMClient interface: complete(messages, model) -> Response", "Backends: OpenAI, Anthropic, Ollama — swap via config", "Normalize errors, retries, timeouts across providers", "Unit tests using Ollama (fast + free)", "Push: llm-provider-wrapper"] }
        ]
      },
      {
        title: "Week 2 — Prompt Engineering + Structured Outputs",
        tag: "Days 8–14",
        days: [
          { title: "Day 8–9: Prompt engineering as a discipline",
            topics: ["Zero-shot vs few-shot examples — pick with intent", "System prompt anatomy: role, task, constraints, output format", "Chain-of-thought (when it helps, when it's overkill)", "Delimit inputs with ### or XML tags", "Version prompts like code — one file per prompt, diff them", "Watch: DeepLearning.AI Prompt Engineering for Devs"] },
          { title: "Day 10–11: JSON mode + response_format",
            topics: ["OpenAI response_format={type:'json_object'} + json_schema", "Anthropic: prompt-driven JSON (no native mode yet, so structure the prompt)", "Ollama: format='json' hint", "Always validate output with a Pydantic model — reject + retry on failure"] },
          { title: "Day 12–13: Instructor library (Pydantic + LLMs)",
            topics: ["instructor patches OpenAI/Anthropic clients", "Define a Pydantic response model → get a validated instance back", "Built-in retries with validation feedback", "Practice: extract structured data from resumes, invoices, or emails", "Compare error rates vs plain JSON mode"] },
          { title: "Day 14: Prompt eval harness (mini)",
            topics: ["Write 5 prompt variants for the same task", "Run each on 20 test cases with your wrapper", "Score with a rubric (correctness, relevance, format-compliance)", "Save results as CSV — a preview of Month 09 (evals)"] }
        ]
      },
      {
        title: "Week 3 — Function Calling + Cost/Latency Observability",
        tag: "Days 15–21",
        days: [
          { title: "Day 15–16: Function calling / tool use",
            topics: ["Define tools = functions the LLM can call (weather, calculator, DB query)", "The tool-use loop: LLM decides → you execute → send result back → LLM continues", "OpenAI function calling vs Anthropic tool_use — API comparison", "Build: a weather-lookup bot that calls a real weather API"] },
          { title: "Day 17–18: Multi-tool orchestration + guardrails",
            topics: ["Multiple tools available, LLM routes between them", "Force tool use (tool_choice) vs let it decide", "Handle tool errors gracefully (return error → LLM re-plans)", "Guardrails: input validation, tool allowlist, max steps to prevent runaway loops"] },
          { title: "Day 19–20: Cost tracking + spend caps",
            topics: ["Log every LLM call: provider, model, tokens_in, tokens_out, cost, latency", "Cost-per-user / cost-per-feature dashboard (CloudWatch or Grafana)", "Hard spend caps in code (refuse call if daily budget exceeded)", "Real anecdote practice: 'here's my $/day chart' — this is interview gold"] },
          { title: "Day 21: Latency budgets + streaming + fallbacks",
            topics: ["Measure p50 / p95 / p99 per model", "Server-Sent Events (SSE) from FastAPI — stream tokens to the client", "Time-to-first-token vs total-time", "Provider fallback: primary (gpt-4o-mini) → fallback (claude-haiku) on outage/rate limit", "Redis cache on exact prompt hits (semantic caching arrives in Month 07)"] }
        ]
      },
      {
        title: "Week 4 — Consolidation: 'Ask My Blog'",
        tag: "Days 22–28",
        days: [
          { title: "Day 22–27: Ship the feature",
            topics: ["Endpoint: POST /ask with a natural language question", "Pipeline: fetch relevant posts (keyword search now, RAG next month) → build prompt → call LLM with function calling for URL citations → stream response over SSE", "Structured output: Pydantic Answer { text, sources: [PostRef] }", "Cost tracking + Redis cache + Anthropic fallback", "Feature-flag it so you can turn it off from Settings", "CI uses Ollama (no API cost for tests)"] },
          { title: "Day 28: Publish + polish",
            topics: ["Write a 500-word blog post: 'How I added AI Q&A to my blog (with costs)'", "Publish on dev.to or Medium — your first public LLM writing", "Update fastapi-blog-platform README with a demo GIF + the blog link", "Push both projects"] }
        ]
      },
      {
        title: "Week 5 — MCP: Expose Your Blog as a Tool",
        tag: "Days 29–32",
        days: [
          { title: "Day 29: What MCP is and why it exists",
            topics: ["Model Context Protocol = a standard way to expose tools / data / prompts to any LLM app (Claude Desktop, IDEs, agents)", "MCP vs raw function calling: write the tool once, every MCP client can use it", "The three primitives: tools, resources, prompts", "Architecture: an MCP server (you build) talks to an MCP client (Claude Desktop, your future agent)"] },
          { title: "Day 30–31: Build an MCP server over your Blog API",
            topics: ["Use the official Python MCP SDK (FastMCP)", "Expose tools: search_posts(query), get_post(id), create_draft(title, body)", "Reuse your existing FastAPI service layer — MCP is a thin adapter, not a rewrite", "Test it with MCP Inspector or Claude Desktop and call your blog from an LLM", "Validate tool inputs and return clear, typed errors"] },
          { title: "Day 32: Wrap + write about it",
            topics: ["README: what MCP is, how to run the server, a demo GIF of an LLM using your blog", "Note the reuse: Month 08 agents can consume this exact MCP server as a tool", "Push: blog-mcp-server — a modern, resume-worthy artifact", "Optional post: 'I turned my blog into an MCP tool in a weekend'"] }
        ]
      }
    ],
    checklist: [
      "Call OpenAI, Anthropic, and Ollama APIs from Python",
      "Ship a provider-agnostic LLM wrapper (used in tests + prod)",
      "Apply zero-shot / few-shot / CoT / system prompts with intent",
      "Get validated structured output via Pydantic + Instructor",
      "Implement function calling / tool use with 3+ tools",
      "Add tool-use guardrails (allowlist + max steps)",
      "Log every LLM call with model, tokens, cost, latency",
      "Enforce a hard daily spend cap in code",
      "Stream responses over SSE from FastAPI",
      "Implement provider fallback (OpenAI → Anthropic)",
      "Cache LLM responses in Redis",
      "Ship one LLM-powered feature into Blog Platform",
      "Publish one public blog post about it",
      "Build an MCP server exposing your Blog API (search / get / create tools)",
      "Call your MCP server from an LLM client (MCP Inspector or Claude Desktop)"
    ],
    repos: ["llm-provider-wrapper", "fastapi-blog-platform (+ Ask My Blog feature)", "blog-mcp-server", "(first public blog post)"]
  },

  {
    id: 6, num: "07", title: "RAG From Scratch → Production",
    duration: "5 weeks", hours: "2–3 hrs/day, 4–5 hrs weekends", difficulty: "Hard",
    diffClass: "difficulty-hard",
    description: "The single most-hired-for skill in AI/Backend right now. Build RAG from scratch (no framework), then rebuild with LangChain to know both. Deliberate chunking, pgvector on Postgres you already run, hybrid search + reranker, real retrieval metrics. This month produces your headline capstone artifact.",
    goals: [
      "Build a working RAG pipeline in <200 lines of raw Python",
      "Choose chunking strategies with data, not vibes",
      "Use pgvector on the Postgres you already run (no new vector DB)",
      "Implement hybrid search (BM25 + vector) with Reciprocal Rank Fusion",
      "Add a reranker (Cohere Rerank or local bge-reranker)",
      "Measure recall@k, MRR, RAGAS scores — retrieval quality as data",
      "Rebuild once with LangChain to know both APIs",
      "Deploy a production RAG app at a real URL with metrics + evals"
    ],
    resources: [
      { name: "pgvector — official docs + examples", type: "Docs", cost: "Free", link: "https://github.com/pgvector/pgvector" },
      { name: "Anthropic — RAG cookbook", type: "Docs", cost: "Free", link: "https://docs.anthropic.com/en/docs/build-with-claude/context-windows" },
      { name: "OpenAI Cookbook — Retrieval patterns", type: "Cookbook", cost: "Free", link: "https://cookbook.openai.com/" },
      { name: "LangChain RAG guide", type: "Docs", cost: "Free", link: "https://python.langchain.com/docs/tutorials/rag/" },
      { name: "LlamaIndex — Getting Started", type: "Docs", cost: "Free", link: "https://docs.llamaindex.ai/en/stable/getting_started/" },
      { name: "Cohere Rerank docs", type: "Docs", cost: "Free tier", link: "https://docs.cohere.com/reference/rerank" },
      { name: "RAGAS — retrieval + generation evals", type: "Library", cost: "Free", link: "https://docs.ragas.io/" },
      { name: "Jerry Liu (LlamaIndex) — talks + posts", type: "Blog/Talks", cost: "Free", link: "https://twitter.com/jerryjliu0" }
    ],
    weeks: [
      {
        title: "Week 1 — RAG From Scratch",
        tag: "Days 1–7",
        days: [
          { title: "Day 1–2: The RAG mindset",
            topics: ["Why RAG (LLM knowledge cutoff + private data + citations)", "The 5 steps: Load → Chunk → Embed → Store → Retrieve+Generate", "Draw the pipeline on paper before coding it", "Naive RAG in <100 lines of raw Python (in-memory)"] },
          { title: "Day 3–4: Chunking strategies",
            topics: ["Fixed-size vs sentence-based vs recursive vs semantic chunking", "Overlap — why 10–20% is usually right", "Chunk metadata (source, page, section) — never chunk without it", "Practice: chunk 3 different corpora (PDF, Markdown, HTML) and inspect the results"] },
          { title: "Day 5–7: Embeddings + in-memory retrieval",
            topics: ["text-embedding-3-small (OpenAI paid) vs bge-small-en-v1.5 (local free)", "Cost + latency comparison — write down actual numbers", "Store vectors + metadata in-memory (numpy or a dict)", "Cosine similarity retrieval + top-K", "Push: rag-from-scratch"] }
        ]
      },
      {
        title: "Week 2 — pgvector + Hybrid Search",
        tag: "Days 8–14",
        days: [
          { title: "Day 8–9: pgvector on your existing Postgres",
            topics: ["CREATE EXTENSION vector; add a vector(384) column", "HNSW vs IVFFlat index (HNSW for reads, IVFFlat for cheap builds)", "Bulk-load 1000 chunks and query with <-> (cosine distance)", "SQLAlchemy + pgvector adapter"] },
          { title: "Day 10–11: Hybrid search",
            topics: ["Postgres tsvector + GIN index for keyword search", "Vector search via pgvector for semantic recall", "Reciprocal Rank Fusion (RRF) to combine them — 15 lines of Python", "Measure: which recall lifts more on your eval set? Write down the numbers."] },
          { title: "Day 12–14: Reranking",
            topics: ["Why rerankers matter (embedding search is fuzzy — recall high, precision low)", "Cohere Rerank API (fast, ~$1/1K queries) vs bge-reranker-base (local, free)", "Rerank top-100 → top-5 pipeline", "Measure the precision uplift before → after rerank", "Push: rag-hybrid-pgvector"] }
        ]
      },
      {
        title: "Week 3 — Retrieval Evaluation",
        tag: "Days 15–21",
        days: [
          { title: "Day 15–16: What 'good retrieval' means",
            topics: ["recall@k, precision@k, MRR, nDCG — pick the ones you need", "Build a labelled eval set: 50 questions, mark the correct chunk(s)", "Golden dataset discipline — commit it to the repo, never edit without a diff review", "Retrieval evaluation is one of the most valuable AI engineering skills"] },
          { title: "Day 17–18: Automated eval loop with RAGAS",
            topics: ["RAGAS metrics: context_precision, context_recall, faithfulness, answer_relevance", "LLM-as-judge for correctness (with all its caveats)", "Track evals in an EVALS.md updated on every commit", "Run RAGAS in CI on every PR"] },
          { title: "Day 19–21: Iterate on retrieval with data",
            topics: ["Grid over 5 chunk sizes × 3 overlaps × 3 embedding models", "Track everything in a CSV — decisions become data", "Publish results as a small table in the README", "This is the artifact that turns 'I built RAG' into 'I engineered RAG'"] }
        ]
      },
      {
        title: "Week 4 — LangChain (and LlamaIndex) rebuild",
        tag: "Days 22–28",
        days: [
          { title: "Day 22–24: Rebuild rag-from-scratch with LangChain",
            topics: ["DocumentLoader → TextSplitter → VectorStore → Retriever → RetrievalQA chain", "Compare code volume + flexibility vs your raw version", "When to reach for LangChain (glue speed) vs raw (control + debuggability)"] },
          { title: "Day 25–28: LlamaIndex crash tour",
            topics: ["Rebuild the same pipeline with LlamaIndex", "Response synthesis modes (refine, tree_summarize, compact)", "Sub-question query engine — a preview of agentic RAG", "You don't need to master both — you need to speak both fluently"] }
        ]
      },
      {
        title: "Week 5 — Production RAG Capstone",
        tag: "Days 29–35",
        days: [
          { title: "Day 29–33: rag-production-app",
            topics: ["Full stack: FastAPI + pgvector + hybrid search + reranker", "Ingestion pipeline: PDF/HTML/Markdown → chunks → pgvector (Celery worker)", "/ask endpoint with SSE streaming + citations (Pydantic Answer{text, sources})", "Cost tracking + Redis semantic cache", "Auth so it's really 'yours' (not a public toy)", "Evals dashboard: RAGAS scores per commit"] },
          { title: "Day 34–35: Deploy + document",
            topics: ["Deploy on AWS (reuse Month 04's setup)", "Real domain, real metrics, real alerts", "README with architecture + latest eval scores + demo GIF", "SYSTEM_DESIGN.md explaining trade-offs", "Push: rag-production-app — this is your headline artifact"] }
        ]
      }
    ],
    checklist: [
      "Build a working RAG from scratch in <200 lines",
      "Justify a chunking strategy with eval numbers",
      "Install and use pgvector on Postgres",
      "Choose HNSW vs IVFFlat based on your workload",
      "Implement hybrid search (BM25 + vector) with RRF",
      "Add a reranker to the top of the pipeline",
      "Build a labelled eval set of 50+ Q&A pairs",
      "Track recall@k / MRR / RAGAS scores over time",
      "Rebuild the pipeline with LangChain to know both APIs",
      "Deploy rag-production-app at a real HTTPS URL",
      "Publish RAGAS scores in the README",
      "Ingestion pipeline handles PDF + HTML + Markdown",
      "SSE streaming responses with structured citations"
    ],
    repos: ["rag-from-scratch", "rag-hybrid-pgvector", "rag-production-app ⭐"]
  },

  {
    id: 7, num: "08", title: "AI Agents + LangGraph + Real Tools",
    duration: "5 weeks", hours: "2–3 hrs/day, 4–5 hrs weekends", difficulty: "Hard",
    diffClass: "difficulty-hard",
    description: "Agents = LLMs that take actions. Build one that does something useful for YOU every single day — email triage, job scraper, PR reviewer. Tools, memory, retries, guardrails, LangGraph state graphs. Not a toy: a demo you'd screen-share in an interview.",
    goals: [
      "Understand the agent loop (Think → Act → Observe)",
      "Build an agent from scratch with no framework (extends Month 06)",
      "Use LangGraph for a real multi-step, resumable workflow",
      "Implement short-term + long-term memory correctly",
      "Add guardrails: max steps, max cost, input/output validation, tool allowlist",
      "Instrument every step with LangSmith or Langfuse traces",
      "Ship + use ONE real agent every day for the rest of the roadmap",
      "Ship a thin Next.js + TypeScript chat UI (SSE streaming) over your agent/RAG backend — your visible full-stack proof"
    ],
    resources: [
      { name: "LangGraph — official docs", type: "Docs", cost: "Free", link: "https://langchain-ai.github.io/langgraph/" },
      { name: "Anthropic — Tool use guide", type: "Docs", cost: "Free", link: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use" },
      { name: "Simon Willison — Agent posts", type: "Blog", cost: "Free", link: "https://simonwillison.net/tags/agents/" },
      { name: "OpenAI — Assistants API (know it exists)", type: "Docs", cost: "Free (usage $)", link: "https://platform.openai.com/docs/assistants/overview" },
      { name: "LangSmith — traces + evals", type: "Tool", cost: "Free tier", link: "https://smith.langchain.com/" },
      { name: "Langfuse — open-source alternative", type: "Tool", cost: "Free (self-host)", link: "https://langfuse.com/" },
      { name: "Anthropic — Building effective agents", type: "Blog", cost: "Free", link: "https://www.anthropic.com/research/building-effective-agents" },
      { name: "Next.js — App Router docs (learn the 20% you need)", type: "Docs", cost: "Free", link: "https://nextjs.org/docs/app" },
      { name: "Vercel — deploy a Next.js app", type: "Docs", cost: "Free tier", link: "https://vercel.com/docs/frameworks/nextjs" }
    ],
    weeks: [
      {
        title: "Week 1 — Agent Fundamentals",
        tag: "Days 1–7",
        days: [
          { title: "Day 1–2: What agents actually are",
            topics: ["LLM + tools + loop = agent (draw it on paper before coding)", "ReAct pattern (Reason → Act)", "Plan-and-Execute pattern (planner + executor)", "When agents are the WRONG answer (chains are enough for most jobs)"] },
          { title: "Day 3–4: Raw agent from scratch",
            topics: ["Extend your Month 06 function-calling code with a loop", "Add: chat history memory, max-step limit, error handling", "Build a Wikipedia research agent (search + fetch + summarize)", "Log every LLM call, tool call, cost, latency"] },
          { title: "Day 5–7: When it breaks (and it will)",
            topics: ["Runaway loops (max steps saves you)", "Hallucinated tool args (Pydantic validation on every tool)", "Silent failures (structured logging of every step)", "Track token cost per agent run — set hard caps"] }
        ]
      },
      {
        title: "Week 2 — LangGraph Deep Dive",
        tag: "Days 8–14",
        days: [
          { title: "Day 8–9: LangGraph state graphs",
            topics: ["StateGraph, nodes, edges, conditional edges", "State schema pattern with Pydantic / TypedDict", "compile() + invoke() + stream() — three modes, know all three"] },
          { title: "Day 10–11: Rebuild your Wikipedia agent with LangGraph",
            topics: ["Same functionality, compare line count + clarity", "Add checkpointing (SQLite or Postgres) for resumability", "Stream intermediate steps to a client (SSE)", "Handle interrupts + resume from checkpoint"] },
          { title: "Day 12–14: Multi-agent patterns",
            topics: ["Supervisor pattern (one router → specialist agents)", "Reflection loop (critic + author) for code review or writing", "Human-in-the-loop with interrupt/resume for approvals", "Practice: implement a code-review reflection loop"] }
        ]
      },
      {
        title: "Week 3 — Memory + Guardrails + Observability",
        tag: "Days 15–21",
        days: [
          { title: "Day 15–16: Memory patterns",
            topics: ["Short-term (last N turns, or token-budgeted window)", "Long-term (vector store — reuse Month 07's pgvector setup)", "Summarization memory for long conversations", "Structured memory (extract facts per turn, store as JSON)"] },
          { title: "Day 17–18: Guardrails",
            topics: ["Input validation (max length, basic prompt-injection detection)", "Output validation (Pydantic + retry-with-feedback loop)", "Tool allowlist per agent (never let a code-review agent send emails)", "Max steps + max cost + max wall-clock time per run"] },
          { title: "Day 19–21: Agent observability",
            topics: ["LangSmith or Langfuse — pick one, wire it into your agent", "Trace every step, tool call, token, cost", "Save traces on failure with reproducible input for later debugging", "Set alerts on failure rate + avg cost per run", "Prep for Month 09's evals month"] }
        ]
      },
      {
        title: "Week 4 — Ship ONE real agent (and actually use it)",
        tag: "Days 22–28",
        days: [
          { title: "Day 22–27: Pick ONE and ship it end-to-end",
            topics: ["Option A: Email triage agent (labels, priority, draft replies)", "Option B: Job scraper + fit ranker (LinkedIn/Wellfound → JSON → rank vs CV)", "Option C: GitHub PR reviewer (style/logic/security comments)", "Option D: Personal knowledge agent over your Blog Platform + notes", "Full pipeline: tools + memory + guardrails + LangGraph + traces + deployment", "Feature-flag it so you can pause it if it gets weird"] },
          { title: "Day 28: Use it daily; write about it",
            topics: ["Use it daily through Month 09 + 10 — real usage finds real bugs", "Publish a blog post: 'Building an agent I actually use every day'", "Add a demo GIF to the README", "Push: one-real-agent — your interview demo"] }
        ]
      },
      {
        title: "Week 5 — Thin Frontend: Make It Demo-able (just enough)",
        tag: "Days 29–35",
        days: [
          { title: "Day 29–30: Next.js + TypeScript crash-start",
            topics: ["Next.js App Router: pages, layouts, server vs client components — the 20% you actually need", "TypeScript basics: typing props, fetch responses, async functions (lean on your Python type-hint habit)", "One page: an input box and a response area. That's the whole app.", "NON-GOALS: no Redux/Zustand, no component library, no design system, no auth UI, no SSR tricks"] },
          { title: "Day 31–32: Wire it to your FastAPI backend",
            topics: ["Call your RAG/agent endpoint with fetch", "Consume the SSE stream from Week 2 (ReadableStream → render tokens as they arrive)", "Render Pydantic citations/sources as clickable links", "CORS on the FastAPI side (you already met CORSMiddleware in Month 02)"] },
          { title: "Day 33–34: Make it presentable (timeboxed)",
            topics: ["Tailwind OR ~60 lines of plain CSS — pick one, set a timer", "Loading / error / empty states (list them before you build)", "User + assistant chat bubbles; readable on a phone for screen-shares", "Stop when it looks clean — resist the frontend rabbit hole"] },
          { title: "Day 35: Deploy + record the demo",
            topics: ["Deploy on Vercel (free), point it at your deployed backend", "Record a 30–60s demo GIF — the thing recruiters actually click", "README: live link + GIF + a 1-diagram 'how it talks to the backend'", "Push: ai-chat-ui — your visible, full-stack proof"] }
        ]
      }
    ],
    checklist: [
      "Explain the agent loop (Think → Act → Observe) with a diagram",
      "Build an agent from scratch (no framework) with the tool-use loop",
      "Use LangGraph StateGraph for a multi-step workflow",
      "Implement checkpointing for a resumable agent",
      "Implement supervisor + reflection multi-agent patterns",
      "Handle short-term + long-term memory (with pgvector)",
      "Add input/output guardrails (max steps, max cost, tool allowlist)",
      "Wire agent to LangSmith or Langfuse traces",
      "Set alerts on failure rate + cost per run",
      "Ship ONE real agent you actually use daily",
      "Publish a blog post about building it",
      "Build a minimal Next.js + TypeScript chat UI (no state libs, no component kit)",
      "Stream SSE responses from the backend into the UI",
      "Deploy the frontend on Vercel with a live link + demo GIF"
    ],
    repos: ["wikipedia-research-agent", "one-real-agent ⭐ (interview demo)", "ai-chat-ui ⭐ (visible full-stack demo)", "(second blog post)"]
  },

  {
    id: 8, num: "09", title: "Evaluation, Observability, Cost/Latency — YOUR EDGE",
    duration: "4 weeks", hours: "2–3 hrs/day, 4–5 hrs weekends", difficulty: "Medium",
    diffClass: "difficulty-medium",
    description: "The month where testing discipline turns into an interview weapon. LLM evals (Promptfoo, DeepEval, RAGAS). Production observability (LangSmith / Langfuse). Cost + latency instrumentation as first-class citizens. Prompt regression tests gating CI. This is the skill most AI/Backend devs skip — and hiring managers can tell.",
    goals: [
      "Build eval harnesses in Promptfoo + DeepEval + RAGAS",
      "Publish a public eval report a hiring manager can click",
      "Instrument production with LangSmith or Langfuse",
      "Ship cost + latency dashboards + real alerts",
      "Add prompt regression tests to CI that fail builds on quality drop",
      "Publish an evals-in-ci-template repo (your signature artifact)"
    ],
    resources: [
      { name: "Promptfoo — YAML-driven LLM evals", type: "Tool", cost: "Free", link: "https://www.promptfoo.dev/docs/intro/" },
      { name: "DeepEval — pytest for LLMs", type: "Library", cost: "Free", link: "https://docs.confident-ai.com/" },
      { name: "RAGAS — RAG-specific evals", type: "Library", cost: "Free", link: "https://docs.ragas.io/" },
      { name: "LangSmith — hosted tracing + evals", type: "Tool", cost: "Free tier", link: "https://smith.langchain.com/" },
      { name: "Langfuse — open-source LLM observability", type: "Tool", cost: "Free (self-host)", link: "https://langfuse.com/" },
      { name: "Anthropic — Building effective evals", type: "Blog", cost: "Free", link: "https://www.anthropic.com/news/prompt-caching" },
      { name: "Chip Huyen — Evaluating LLM applications", type: "Blog", cost: "Free", link: "https://huyenchip.com/2023/05/02/rlhf.html" }
    ],
    weeks: [
      {
        title: "Week 1 — Eval Fundamentals + Promptfoo + DeepEval",
        tag: "Days 1–7",
        days: [
          { title: "Day 1–2: Why LLM evals are hard",
            topics: ["No pass/fail — only distributions of quality", "LLM-as-judge caveats (bias, verbosity, self-preference)", "The eval → improve → eval → improve loop", "Golden dataset discipline (labelled by humans first)"] },
          { title: "Day 3–4: Promptfoo — fast prompt evals",
            topics: ["YAML config: prompts, providers, tests, assertions", "Compare N prompts × M models × K test cases in one command", "Assertions: contains, regex, javascript, llm-rubric", "Run Promptfoo on your Month 06 'Ask My Blog' — get baseline numbers", "Publish results in your PR description"] },
          { title: "Day 5–7: DeepEval — pytest for LLMs",
            topics: ["pytest-style API: assert_test(test_case, metrics=[...])", "Metrics: hallucination, faithfulness, answer relevance", "Integrate into your CI on Ask My Blog + one-real-agent", "Fail CI when score drops below threshold"] }
        ]
      },
      {
        title: "Week 2 — RAG-specific Evals with RAGAS",
        tag: "Days 8–14",
        days: [
          { title: "Day 8–9: RAGAS deep",
            topics: ["context_precision, context_recall, faithfulness, answer_relevance — know each", "Build a proper eval set for rag-production-app (100+ Q&A pairs)", "Automate with LLM-generated candidates → human-reviewed final set", "Measure before/after every retrieval change"] },
          { title: "Day 10–11: Retrieval vs generation debugging",
            topics: ["Recall@k, MRR = retrieval health", "Faithfulness, hallucination rate = generation health", "Given a bad answer, decision tree: bad retrieval? bad prompt? bad model?", "Practice: intentionally break your RAG in 3 ways and diagnose each"] },
          { title: "Day 12–14: Publish your first eval report",
            topics: ["Markdown or a small static site", "Sections: methodology, eval set, models × prompts × scores, learnings", "Include 5 prompt variants and their scores", "Link it from your portfolio — this is the artifact that sets AI candidates apart"] }
        ]
      },
      {
        title: "Week 3 — Production Observability + Cost/Latency",
        tag: "Days 15–21",
        days: [
          { title: "Day 15–16: LangSmith vs Langfuse vs W&B Weave",
            topics: ["LangSmith = default in most orgs (paid, hosted)", "Langfuse = open-source self-host (free, more control)", "W&B Weave = alternative with different flavour", "Pick one and go deep; know the others exist", "Trace ingestion, filtering, run comparisons, custom evaluators"] },
          { title: "Day 17–18: Cost dashboards",
            topics: ["$/user/day, $/feature, $/model — one chart each", "Anomaly detection on cost (yesterday × 2 = page someone)", "Cost breakdown per LLM call (prompt cost + completion cost)", "Build the dashboard for rag-production-app"] },
          { title: "Day 19–21: Latency dashboards + fallbacks",
            topics: ["Time-to-first-token vs total time — measure both", "Per-provider p50/p95/p99", "Streaming impact on perceived latency", "Real fallback: primary p95 > 3s or 5xx → route to backup provider", "Instrument fallback rate as its own metric"] }
        ]
      },
      {
        title: "Week 4 — Prompt Regression in CI + Consolidation",
        tag: "Days 22–28",
        days: [
          { title: "Day 22–24: Prompt regression tests in CI",
            topics: ["Every PR that changes a prompt → CI runs full eval suite", "Post scores as a PR comment (GitHub Actions can do this)", "Fail the build if any metric drops by > X%", "Approval workflow: score-drop requires human sign-off", "This alone gets you hired at eval-first companies"] },
          { title: "Day 25–28: evals-in-ci-template repo",
            topics: ["Public repo with a reusable template", "Promptfoo + DeepEval + RAGAS integrated with GitHub Actions", "EVALS.md template with sections: test set, metrics, latest scores, history", "Example agent + example RAG with baseline evals", "Push: evals-in-ci-template ⭐", "This is your evaluation-skills signal — link it everywhere"] }
        ]
      }
    ],
    checklist: [
      "Explain why LLM evals are distribution-based, not pass/fail",
      "Build a Promptfoo eval config with 3+ assertion types",
      "Use DeepEval inside pytest",
      "Use RAGAS for RAG-specific evals",
      "Publish a public eval report (URL a hiring manager can click)",
      "Instrument production with LangSmith or Langfuse",
      "Ship a cost dashboard for one AI feature",
      "Ship a latency dashboard for one AI feature",
      "Implement provider fallback with metrics",
      "Prompt regression tests in CI that fail builds on drop",
      "Publish evals-in-ci-template as a public template repo"
    ],
    repos: ["evals-in-ci-template ⭐ (signature project)", "(extend rag-production-app + one-real-agent with EVALS.md)"]
  },

  {
    id: 9, num: "10", title: "Flagship Capstone + Portfolio + Interviews",
    duration: "6 weeks", hours: "2–3 hrs/day, 5–6 hrs weekends", difficulty: "Medium",
    diffClass: "difficulty-medium",
    description: "Final stretch. One flagship capstone that ties everything from Months 1–9 together. Polish 22+ repos into a portfolio. Resume + LinkedIn + blog series. Interview prep is SEPARATE from learning — timed, deliberate, mock-driven. Start applying at Week 4. Six weeks is enough — treat it that way.",
    goals: [
      "Ship one flagship AI/Backend capstone (RAG + agents + evals + AWS) with a thin but real UI",
      "Polish GitHub: pinned repos, clean READMEs, profile README",
      "Resume tailored + LinkedIn optimized for AI/Backend roles",
      "3 blog posts published across the month",
      "Interview-ready: Python, DSA, system design, AI concepts, behavioural",
      "Apply to 50+ jobs; complete 3+ mock interviews"
    ],
    resources: [
      { name: "Pramp.com — peer mock interviews", type: "Practice", cost: "Free", link: "https://www.pramp.com/" },
      { name: "interviewing.io — anonymous mock interviews", type: "Practice", cost: "Free tier", link: "https://interviewing.io/" },
      { name: "NeetCode 150 — interview-tuned DSA", type: "Practice", cost: "Free", link: "https://neetcode.io/practice" },
      { name: "ByteByteGo — system design videos", type: "YouTube", cost: "Free", link: "https://www.youtube.com/@ByteByteGo" },
      { name: "Chip Huyen — Designing ML Systems (selected chapters)", type: "Book", cost: "₹800 / library", link: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/" },
      { name: "GitHub Pages / Vercel — free portfolio hosting", type: "Tool", cost: "Free", link: "https://pages.github.com/" }
    ],
    weeks: [
      {
        title: "Week 1 — Flagship Capstone: Design + Build Core",
        tag: "Days 1–7",
        days: [
          { title: "Day 1–2: Scope + design doc",
            topics: ["Pick ONE domain (e.g. 'personal knowledge assistant', 'AI docs Q&A for a real SaaS')", "Write a requirements doc (Notion or Markdown)", "Architecture diagram (draw.io): FastAPI + pgvector + Redis + Celery + LLM + agent + evals + AWS + a thin Next.js UI", "NON-GOALS list — say no to feature creep in writing"] },
          { title: "Day 3–5: Core RAG + agent pipeline",
            topics: ["Ingestion pipeline reusing Month 07's work", "Retrieval: hybrid search + reranker", "Agent layer (LangGraph) for multi-turn conversations with tools", "Streaming responses + Pydantic citations", "Cost tracking + Redis semantic cache"] },
          { title: "Day 6–7: Evals baseline",
            topics: ["RAGAS eval set with 100 questions", "Baseline scores committed to EVALS.md", "This becomes your 'day 1 vs day X' narrative for interviews"] }
        ]
      },
      {
        title: "Week 2 — Flagship Capstone: Production Polish",
        tag: "Days 8–14",
        days: [
          { title: "Day 8–10: Production readiness",
            topics: ["Deploy on AWS (App Runner or ECS Fargate)", "HTTPS + real domain + secrets + structured logs + custom metrics + alerts", "CI/CD with prompt regression tests gating deploy"] },
          { title: "Day 11–12: Tests",
            topics: ["80%+ pytest coverage", "Schemathesis contract tests", "Ship a thin Next.js UI for the capstone (reuse Month 08's ai-chat-ui) — a visible demo, not just /docs", "Playwright E2E smoke test on that UI"] },
          { title: "Day 13–14: Documentation",
            topics: ["Killer README: pitch + architecture + features + eval scores + cost + demo GIF", "EVALS.md — with latest numbers", "AWS_DEPLOYMENT.md — architecture + cost", "SYSTEM_DESIGN.md — decisions + trade-offs"] }
        ]
      },
      {
        title: "Week 3 — GitHub Portfolio Polish",
        tag: "Days 15–21",
        days: [
          { title: "Day 15–17: Audit every repo",
            topics: ["Delete zombie / abandoned repos", "One-line pitch + screenshots + run-in-3-commands on every README", "Consistent .gitignore, MIT license, requirements/lockfile", "Rename any repo with 'main' or 'test' left in it"] },
          { title: "Day 18–19: Pin 6 best repos",
            topics: ["1. flagship-ai-backend-app (the capstone)", "2. rag-production-app", "3. one-real-agent", "4. evals-in-ci-template", "5. fastapi-blog-platform (deep extension throughout roadmap)", "6. llm-provider-wrapper"] },
          { title: "Day 20–21: GitHub profile README + portfolio site",
            topics: ["Profile README: 2-line pitch, 'currently building', recent posts, tech badges", "Optional: portfolio site via GitHub Pages or Vercel (Astro / plain HTML)", "Link it from LinkedIn, resume, dev.to bio"] }
        ]
      },
      {
        title: "Week 4 — Resume + LinkedIn + Apply",
        tag: "Days 22–28",
        days: [
          { title: "Day 22–23: Resume",
            topics: ["ONE page, ATS-friendly (no tables, no images, no fancy fonts)", "Projects section BEFORE experience — let your builds lead", "Numbers everywhere: 95% RAGAS faithfulness, 80% coverage, $0.02/query", "Skills line includes Next.js / TypeScript (working proficiency) — backed by your shipped UI", "Headline: 'AI + Backend Engineer | RAG · Agents · Evals'"] },
          { title: "Day 24–25: LinkedIn optimization",
            topics: ["Headline mirrors resume", "Featured section: flagship capstone + evals-in-ci-template + blog post", "Skills: FastAPI, PostgreSQL, Redis, Docker, AWS, RAG, LangGraph, Prompt Engineering, LLM Evals, pgvector, Next.js, TypeScript (working proficiency)", "About: 3 short paragraphs — your background, why AI + backend, what you build now"] },
          { title: "Day 26–27: Blog series (3 posts, publish across Weeks 4–6)",
            topics: ["Post 1: 'Becoming an AI + Backend Developer — what actually mattered'", "Post 2: 'Building production RAG with pgvector and RAGAS in CI'", "Post 3: 'Prompt regression tests in CI — how I stopped breaking prod prompts'", "Cross-post on dev.to + LinkedIn + Hashnode"] },
          { title: "Day 28: Start applying (10/day baseline)",
            topics: ["Application tracker spreadsheet (company, role, date, status, referral, notes)", "Sources: LinkedIn Jobs, Wellfound, Hacker News 'Who is hiring', YC company job pages", "Cold outreach: 3 hiring managers/day on LinkedIn with 1-line pitch + 1 link"] }
        ]
      },
      {
        title: "Week 5 — Interview Preparation (deliberate + timed)",
        tag: "Days 29–35",
        days: [
          { title: "Day 29: Python core interview questions",
            topics: ["GIL, async, decorators, generators, context managers, typing", "Practice explaining each in 2 minutes without notes", "Common gotchas (mutable default args, late binding closures)"] },
          { title: "Day 30: OS + DBMS + Networking one-pass",
            topics: ["Processes vs threads, memory, scheduling", "SQL joins, transactions, indexes, N+1", "HTTP, TCP/IP, DNS, REST, JWT, OAuth", "One flashcard per topic, not a textbook re-read"] },
          { title: "Day 31: DSA revision by pattern",
            topics: ["Re-solve your starred DSA problems grouped by pattern (arrays, sliding window, stack, trees, graphs, DP)", "Timed practice: 25 min per Medium", "Re-do 3 problems you failed cold, without hints"] },
          { title: "Day 32: System design — backend classics",
            topics: ["URL shortener, chatbot backend, notification service, rate limiter", "Framework: requirements → API → data model → components → scale → trade-offs", "Practice out loud, 45 min per problem"] },
          { title: "Day 33: System design — AI systems",
            topics: ["Design a RAG system for 10K daily users, $500/month budget", "Design a document Q&A with citations and freshness guarantees", "Design an agent platform with tools and rate limits", "Cost + latency budget on every diagram"] },
          { title: "Day 34: AI concept interview questions",
            topics: ["20 must-know: RAG basics, embeddings, tokenisation, function calling, RAG vs fine-tuning, hallucination detection, eval metrics, cost strategy", "Practice each out loud in ~90 seconds", "Common trap questions to prep: 'when would you NOT use RAG?', 'how do you know your prompt regressed?'"] },
          { title: "Day 35: First mock interview",
            topics: ["Pramp or interviewing.io", "One coding round OR one system design round — pick whichever is scarier", "Debrief: what did you miss?"] }
        ]
      },
      {
        title: "Week 6 — Apply hard, iterate, close",
        tag: "Days 36–42",
        days: [
          { title: "Day 36–42: Apply, iterate, ship",
            topics: ["10 applications/day (LinkedIn, Wellfound, HN 'Who is hiring', YC job pages)", "Second mock interview (system design if first was coding, and vice versa)", "Ship the last blog post", "Track every rejection reason in the tracker", "Join 2 AI communities (LangChain Discord, local meetups, r/MachineLearning)", "First offer at Week 8–9 is realistic — six weeks in this month is real work, not padding"] }
        ]
      }
    ],
    checklist: [
      "Flagship capstone deployed at a public URL",
      "Flagship has a thin but real UI — screen-shareable demo + GIF, not just Swagger /docs",
      "All active repos have clean READMEs",
      "6 best repos pinned on GitHub profile",
      "GitHub profile README written",
      "Portfolio site (optional but nice)",
      "Resume tailored (1 page, ATS-friendly)",
      "LinkedIn optimized (headline + featured + about)",
      "3 blog posts published across dev.to / Medium / LinkedIn",
      "Can explain each pinned project in 2 minutes",
      "Practiced 20 AI concept questions out loud",
      "Completed 2+ mock interviews",
      "Can whiteboard: RAG system, chatbot backend, agent architecture",
      "Can solve Medium LeetCode in 25 minutes",
      "Revised Python, OS, DBMS, networking fundamentals",
      "Application tracker with 50+ entries",
      "Cold-outreach to 15+ hiring managers"
    ],
    repos: ["flagship-ai-backend-app ⭐ (the one)", "(3rd blog post published)"]
  },
];

// ── Variant registry (add new roadmaps here, no schema change required) ──
export const ROADMAP_VARIANTS = {
  ai_llm:       { id: "ai_llm",       label: "AI/LLM Engineer",                    months: MONTHS_AI_LLM },
  ai_fullstack: { id: "ai_fullstack", label: "AI + Full-Stack Backend Developer", months: MONTHS_AI_FULLSTACK },
};

export function getMonthsForVariant(variantId) {
  return (ROADMAP_VARIANTS[variantId] || ROADMAP_VARIANTS.ai_llm).months;
}

export const STUDY_TIPS = [
  {
    icon: "🤖",
    title: "AI Tools — When to Use",
    content: `<table class="tips-table">
      <tr><th>Phase</th><th>AI Usage</th><th>Why</th></tr>
      <tr><td>Learning a concept for the first time</td><td><strong>OFF.</strong> Completely.</td><td>Your brain needs to struggle. Struggle = learning.</td></tr>
      <tr><td>Doing LeetCode</td><td><strong>OFF.</strong> No exceptions.</td><td>If AI solves it, YOU didn't learn. You'll fail interviews.</td></tr>
      <tr><td>Building projects (first attempt)</td><td><strong>OFF</strong> for the first try</td><td>Try for 30 min. Fail. THEN use AI to unstick yourself.</td></tr>
      <tr><td>Debugging an error</td><td><strong>ON</strong> — after 15 min</td><td>Read the error first. Google it. Then ask AI.</td></tr>
      <tr><td>Understanding a concept you tried</td><td><strong>ON</strong> — as a tutor</td><td>"Explain attention like I'm 5" is a great use.</td></tr>
      <tr><td>Writing boilerplate/config</td><td><strong>ON</strong> — it's busywork</td><td>Dockerfiles, CI/CD configs, .gitignore — AI is fine.</td></tr>
      <tr><td>Month 7+ (building RAG/agents)</td><td><strong>ON</strong> — you're using AI to build AI</td><td>At this point, using AI tools IS the skill.</td></tr>
    </table>
    <p class="tip-highlight">The rule: If you can't do it WITHOUT AI, you don't actually know it.</p>`
  },
  {
    icon: "⏱",
    title: "The 30-Minute Rule",
    content: `<ol class="tip-steps">
      <li>Read the error message (actually read it — most people don't)</li>
      <li>Try to fix it yourself for 15–30 minutes</li>
      <li>Google the exact error</li>
      <li>THEN ask AI</li>
    </ol>
    <p class="tip-highlight">This builds debugging skill — the most valuable skill an engineer has.</p>`
  },
  {
    icon: "✍️",
    title: "Handwrite Notes for Hard Concepts",
    content: `<div class="tip-columns">
      <div><strong>Type notes for:</strong> Code syntax, commands, configs</div>
      <div><strong>Handwrite notes for:</strong> Math, algorithms, architecture diagrams</div>
    </div>
    <p>Your brain retains handwritten information <strong>30–40% better</strong>.</p>
    <p>Buy a cheap notebook. Draw: data structure diagrams, neural network architectures, system design boxes & arrows, math formulas with your own annotations.</p>`
  },
  {
    icon: "🎓",
    title: "Teach What You Learn (Feynman Technique)",
    content: `<p>After learning something, <strong>explain it out loud</strong> as if teaching someone:</p>
    <ul class="topic-list">
      <li>If you can't explain it simply, you don't understand it</li>
      <li>Record yourself (even voice notes on your phone)</li>
      <li>Optional: write a short blog post on Medium/dev.to</li>
    </ul>
    <p class="tip-highlight">"Today I learned decorators. A decorator is basically..." — If you get stuck explaining → you have a gap → go back and fill it.</p>`
  },
  {
    icon: "🧠",
    title: "Active Recall > Re-reading",
    content: `<div class="tip-compare">
      <div class="tip-bad">❌ Bad: Re-watch the lecture. Re-read the notes.</div>
      <div class="tip-good">✅ Good: Close everything. Try to recall from memory.</div>
    </div>
    <p>After watching a video on FastAPI: Close the video. Open VS Code. Try to build the API from memory. Get stuck → check notes ONLY for the stuck part → continue.</p>`
  },
  {
    icon: "🔁",
    title: "Spaced Repetition for Concepts",
    content: `<div class="tip-timeline">
      <div class="tip-day">Day 1 → Learn decorators</div>
      <div class="tip-day">Day 3 → Try to write a decorator without looking</div>
      <div class="tip-day">Day 7 → Try again</div>
      <div class="tip-day">Day 14 → Try again</div>
      <div class="tip-day">Day 30 → If you can still do it → it's permanent</div>
    </div>
    <p>For LeetCode: Solve once → Redo 3 days later → Redo 1 week later → If solved in &lt;10 min → move on.</p>`
  },
  {
    icon: "🚫",
    title: "Avoid Tutorial Hell",
    content: `<div class="tip-compare">
      <div class="tip-bad">Watching tutorials = <em>feels</em> productive</div>
      <div class="tip-good">Building from scratch = <strong>IS</strong> productive</div>
    </div>
    <p><strong>The test:</strong> Can you build it without the tutorial open?</p>
    <ul class="topic-list">
      <li>If YES → move on</li>
      <li>If NO → you're in tutorial hell. Close the tutorial. Build it.</li>
    </ul>
    <p class="tip-highlight">After every tutorial section: Close it. Rebuild from scratch. Struggle. That's learning.</p>`
  },
  {
    icon: "💪",
    title: "Physical Health = Brain Performance",
    content: `<table class="tips-table">
      <tr><th>Habit</th><th>Impact on Learning</th></tr>
      <tr><td>Sleep 7–8 hrs</td><td>Memory consolidation happens during sleep.</td></tr>
      <tr><td>Exercise 30 min/day</td><td>Increases BDNF (brain growth factor).</td></tr>
      <tr><td>No screens 30 min before bed</td><td>Better sleep = better recall next day.</td></tr>
      <tr><td>Water</td><td>Dehydration = brain fog. Keep a bottle at your desk.</td></tr>
      <tr><td>Breaks every 90 min</td><td>Pomodoro (25 min work / 5 min break) or 90-min deep blocks.</td></tr>
    </table>`
  },
  {
    icon: "🏠",
    title: "Environment Setup",
    content: `<div class="tip-dos-donts">
      <div class="tip-do-col"><strong>✅ Do</strong>
        <ul>
          <li>Study in the same place daily</li>
          <li>Phone in another room</li>
          <li>Use a website blocker</li>
          <li>Lo-fi/ambient music OR silence</li>
          <li>Clear desk</li>
        </ul>
      </div>
      <div class="tip-dont-col"><strong>❌ Don't</strong>
        <ul>
          <li>Study in bed</li>
          <li>Keep phone on desk</li>
          <li>Trust your willpower</li>
          <li>Music with lyrics</li>
          <li>Cluttered space</li>
        </ul>
      </div>
    </div>`
  },
  {
    icon: "📊",
    title: "Track Your Progress Visibly",
    content: `<ul class="topic-list">
      <li><strong>GitHub green squares</strong> — you can SEE your consistency</li>
      <li><strong>LeetCode streak counter</strong> — gamifies the habit</li>
      <li><strong>Weekly journal</strong> (5 min every Sunday): What I learned, what I struggled with, next week's focus, hours studied</li>
      <li><strong>Tell someone</strong> about your goals (accountability partner)</li>
    </ul>
    <p class="tip-highlight">This app tracks your progress automatically — use the checklists and notes!</p>`
  }
];

export const TOP_3_TIPS = [
  "AI off when learning something new. AI on when applying something you already know.",
  "Build from scratch without tutorials open. Struggle is the point.",
  "Sleep properly. A rested 4-hour study session beats a tired 8-hour one."
];

// Shown in their own Tips section; each one maps to a tool in the app
// (Stuck Log, Rebuild Without Notes, Learn vs Build tracker, Weekly Solo Challenge).
export const ANTI_HELPLESSNESS_TIPS = [
  {
    icon: "🧯",
    title: "Learned Helplessness — Spot It Early",
    content: `<p>Learned helplessness is when repeated "I couldn't do it alone" moments teach your brain that <strong>effort doesn't matter</strong> — so you stop trying before you start. Tutorials and instant AI answers quietly train it: you never get the experience of getting <em>yourself</em> unstuck.</p>
    <div class="tip-compare">
      <div class="tip-bad">❌ Symptoms: "I'll just watch one more video first." · You can read code but freeze at a blank file. · You reach for AI within 2 minutes of an error. · You feel anxious coding without a tutorial playing.</div>
      <div class="tip-good">✅ Antidote: collect <strong>evidence</strong> that you can solve things alone — small, frequent, and written down.</div>
    </div>
    <p class="tip-highlight">Reframe the thought: "I can't do this" → "I haven't figured out <em>this specific part</em> yet."</p>`
  },
  {
    icon: "🛟",
    title: "Keep a Stuck Log (Problem → Tried → Solution)",
    content: `<p>Click the <strong>🛟 Stuck</strong> icon next to any topic when you hit a wall. Write three things:</p>
    <ol class="tip-steps">
      <li><strong>Problem</strong> — the exact error or what confused you</li>
      <li><strong>What I tried</strong> — every attempt, even dumb ones</li>
      <li><strong>Solution</strong> — what actually worked (leave empty while still stuck)</li>
    </ol>
    <p>Writing "what I tried" forces you to actually try before asking. Each solved entry is <strong>proof you can get unstuck</strong> — the Overview counts them.</p>
    <p class="tip-highlight">Feeling helpless? Open your Stuck Log and read the solved ones. Past-you already did hard things.</p>`
  },
  {
    icon: "🪜",
    title: "The Struggle Ladder — Hints, Not Answers",
    content: `<table class="tips-table">
      <tr><th>Time stuck</th><th>Allowed help</th></tr>
      <tr><td>0–15 min</td><td>Read the error. Print/debug. Re-read your own code.</td></tr>
      <tr><td>15–30 min</td><td>Official docs only (not a video).</td></tr>
      <tr><td>30–45 min</td><td>Search the exact error / Stack Overflow.</td></tr>
      <tr><td>45–60 min</td><td>Ask AI or a person — for a <strong>hint</strong>: "What concept am I missing?" not "fix this".</td></tr>
    </table>
    <p class="tip-highlight">Never paste code you can't explain line by line. If AI wrote it, rewrite it yourself from memory.</p>`
  },
  {
    icon: "⚖️",
    title: "The 1 : 3 Rule — Consume Less, Build More",
    content: `<p>For every <strong>1 hour</strong> of watching / reading / courses, spend <strong>3 hours</strong> building without the tutorial open. Log both in the <strong>Learn vs Build</strong> tracker on the Overview.</p>
    <div class="tip-compare">
      <div class="tip-bad">🔴 Consuming more than building → you're in tutorial hell. Stop and build something small today.</div>
      <div class="tip-good">🟢 Building ≥ 3× consuming → you're learning by doing.</div>
    </div>
    <p>Only count <em>building</em> when the tutorial is closed. Typing along with a video is consuming.</p>`
  },
  {
    icon: "🔁",
    title: "Rebuild Without Notes",
    content: `<p>Finishing a project with a tutorial proves you can <em>follow</em>. Rebuilding it from an <strong>empty folder</strong> proves you can <em>build</em>.</p>
    <ul class="topic-list">
      <li>Wait 2–3 days after finishing (spaced repetition)</li>
      <li>Empty folder, no notes, no old repo, no AI</li>
      <li>Rebuild the core flow; look things up only in official docs</li>
      <li>Tick <strong>Rebuild Without Notes</strong> on the month page only when it works</li>
    </ul>
    <p class="tip-highlight">Where you got stuck during the rebuild = exactly what you haven't learned yet. Log it.</p>`
  },
  {
    icon: "⚔️",
    title: "Weekly Solo Challenge",
    content: `<p>Once a week, build something <strong>no tutorial walks you through</strong>. The Overview picks one from your current month's checklist plus a twist.</p>
    <ul class="topic-list">
      <li>Blank file. No videos. AI for hints only, after 30 min stuck.</li>
      <li>Timebox it (≈ 2 hours). Shipping something ugly beats not starting.</li>
      <li>Write a 2-line reflection: what blocked you, what you figured out alone.</li>
    </ul>
    <p class="tip-highlight">Bad result + finished = win. Perfect plan + never started = the trap.</p>`
  },
  {
    icon: "🚨",
    title: "Tutorial-Hell Alarm Bells",
    content: `<ul class="topic-list">
      <li>Switched courses more than twice for the same topic</li>
      <li>Lots of ticked topics, very few commits</li>
      <li>"I'll start the project after this next section"</li>
      <li>Re-watching instead of re-building</li>
    </ul>
    <p class="tip-highlight">Any alarm → stop consuming for 48 hours. Only build. Then come back.</p>`
  },
  {
    icon: "🪨",
    title: "Shrink the Problem, Not Your Confidence",
    content: `<p>Helplessness grows when the task feels too big to start. Make the next step embarrassingly small:</p>
    <ul class="topic-list">
      <li>"Build auth" → "Make one endpoint return 401"</li>
      <li>"Build RAG" → "Embed 3 sentences and print the closest one"</li>
      <li>"Fix this bug" → "Reproduce it in 5 lines"</li>
    </ul>
    <p class="tip-highlight">Small wins compound into belief. Belief keeps you trying.</p>`
  }
];

// ── Study tips: shared base (STUDY_TIPS above) + a dedicated set per variant ──
// Everyone sees the universal STUDY_TIPS. Each variant ALSO gets its own list of
// profile-specific tips (rendered in a separate "Tailored to Your Track" section)
// plus its own Top-3 banner.

export const TOP_3_TIPS_AI_FULLSTACK = [
  "Test-first, break-it-first: a testing mindset is exactly what AI + Backend teams lack. Build it early.",
  "Build from scratch without tutorials open. Struggle is the point.",
  "Ship one small thing daily. A deployed 50-line API beats a perfect unfinished one."
];

// Profile-specific tips for the AI/LLM Engineer track.
export const PROFILE_TIPS_AI_LLM = [
  {
    icon: "📐",
    title: "Math Is a Tool, Not a Gatekeeper",
    content: `<p>You do not need a maths degree to build with ML. You need <strong>intuition</strong>, not proofs.</p>
      <ul class="topic-list">
        <li>Learn <em>just enough</em> linear algebra (vectors, matrices, dot products) and calculus (gradients) to picture what's happening.</li>
        <li>Prefer visual explainers (3Blue1Brown) over dense textbooks.</li>
        <li>If a topic isn't blocking your next project, defer it — come back when you actually hit it.</li>
      </ul>
      <p class="tip-highlight">Don't let a hard proof stall a whole week. Understand the shape of the idea and move.</p>`
  },
  {
    icon: "🔬",
    title: "Reproduce, Don't Just Read",
    content: `<p>Reading a paper or watching a lecture feels productive but fades fast.</p>
      <div class="tip-compare">
        <div class="tip-bad">❌ Read the Transformer paper, nod along, move on.</div>
        <div class="tip-good">✅ Implement the smallest working version (even toy-sized) from scratch.</div>
      </div>
      <p>Pick one idea (attention, embeddings, a loss function) and rebuild the minimal version until it runs.</p>`
  },
  {
    icon: "📊",
    title: "Measure Everything",
    content: `<p>In ML, a number you can defend beats a vibe. Build the habit early:</p>
      <ul class="topic-list">
        <li>Always have a <strong>baseline</strong> before you "improve" anything.</li>
        <li>Log metrics, keep an ablation table (what changed → what score).</li>
        <li>"It feels better" is not a result. "+6% on the eval set" is.</li>
      </ul>`
  },
  {
    icon: "🚀",
    title: "Escape the Notebook",
    content: `<p>Jupyter is where you explore — not where you ship.</p>
      <ul class="topic-list">
        <li>Once something works, wrap it in a function, then an API, then a container.</li>
        <li>Deploy at least one model behind a real endpoint — that's what makes you an <em>engineer</em>, not a tinkerer.</li>
      </ul>
      <p class="tip-highlight">The gap between "runs in my notebook" and "runs in production" is where the jobs are.</p>`
  }
];

// Profile-specific tips for the AI + Full-Stack Backend track.
export const PROFILE_TIPS_AI_FULLSTACK = [
  {
    icon: "🧪",
    title: "Make Testing Your Superpower",
    content: `<p>Most self-taught developers skip testing. Thinking about edge cases, reproducibility,
      and "what breaks this?" will set you apart quickly.</p>
      <ul class="topic-list">
        <li><strong>Write the pytest before the endpoint.</strong> It forces you to design the API first.</li>
        <li><strong>Write bug reports like PRs</strong> — clear repro steps, expected vs actual.</li>
        <li><strong>Contract testing (Schemathesis) + LLM evals</strong> are your edge in Months 02 and 09 — most AI devs skip them.</li>
        <li><strong>Don't re-learn what you already know.</strong> Spend your energy on what's new to you.</li>
      </ul>
      <p class="tip-highlight">Aim to be "the developer who ships code that works" — not just code that runs.</p>`
  },
  {
    icon: "🎯",
    title: "Spend Your Energy on Your Gaps",
    content: `<p>Be honest about what you already know and pour your study hours into what's actually new:</p>
      <div class="tip-columns">
        <div><strong>Skim:</strong> topics you've used at work or in past projects</div>
        <div><strong>Invest here:</strong> Python internals, async/await, SQL performance, system design, Docker/CI</div>
      </div>
      <p>Skim what you know; go slow where it's unfamiliar. That's how you finish a roadmap instead of restarting it.</p>`
  },
  {
    icon: "📦",
    title: "Ship It, Then Polish It",
    content: `<p>A deployed, imperfect project beats a perfect one on your laptop.</p>
      <ul class="topic-list">
        <li>Every repo: clean README, "run in 3 commands", a short demo GIF.</li>
        <li>Deploy early (Railway/Render/Fly) — a live URL is worth ten private repos.</li>
        <li>Recruiters click links, not clone commands. Make the link exist.</li>
      </ul>`
  },
  {
    icon: "🧭",
    title: "Evals Are Just Testing for LLMs",
    content: `<p>When you reach the AI months, good testing habits transfer 1:1:</p>
      <div class="tip-compare">
        <div class="tip-bad">Most AI devs: "the prompt looks good, ship it."</div>
        <div class="tip-good">You: build an eval set, add regression tests, gate CI on prompt changes.</div>
      </div>
      <p class="tip-highlight">Prompt regression testing is the Month 09 skill hiring managers notice.</p>`
  },
  {
    icon: "✍️",
    title: "Learn in Public",
    content: `<p>Your learning journey <em>is</em> your differentiator. Don't hide it — publish it.</p>
      <ul class="topic-list">
        <li>Blog the journey: "Becoming an AI + Backend Developer — what actually mattered".</li>
        <li>Post small wins on LinkedIn/dev.to as you build.</li>
        <li>It compounds into a portfolio, a network, and interview talking points.</li>
      </ul>`
  }
];

export const STUDY_TIPS_BY_VARIANT = {
  ai_llm:       { tips: PROFILE_TIPS_AI_LLM,       top3: TOP_3_TIPS },
  ai_fullstack: { tips: PROFILE_TIPS_AI_FULLSTACK, top3: TOP_3_TIPS_AI_FULLSTACK },
};

// Universal tips shown to every profile.
export function getSharedStudyTips() {
  return STUDY_TIPS;
}

// Tips tailored to the active roadmap variant.
export function getProfileStudyTips(variantId) {
  return (STUDY_TIPS_BY_VARIANT[variantId] || STUDY_TIPS_BY_VARIANT.ai_llm).tips;
}

export function getTop3Tips(variantId) {
  return (STUDY_TIPS_BY_VARIANT[variantId] || STUDY_TIPS_BY_VARIANT.ai_llm).top3;
}

export function getAntiHelplessnessTips() {
  return ANTI_HELPLESSNESS_TIPS;
}

// Constraints that turn a checklist skill into a "no tutorial" solo build.
export const SOLO_CHALLENGE_TWISTS = [
  "Add one feature that no tutorial showed you",
  "Write at least 3 tests before you call it done",
  "Docs only — no AI, no videos, no Stack Overflow copy-paste",
  "Start from an empty folder — no copying from your old repos",
  "Handle one ugly edge case: bad input, empty data, or a timeout",
  "Hard timebox: 90 minutes — ship whatever works",
  "Break it on purpose, then debug it back to green",
  "Finish with a 5-line README explaining how it works, from memory"
];
