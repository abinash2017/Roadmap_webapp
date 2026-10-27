/* ============================================
   TOPIC LINKS — curated resource links per topic
   Key: "monthId_weekIdx_dayIdx_topicIdx"
   Value: array of { type, label, url }
   type: "video" | "doc" | "problem"
   ============================================ */

export const TOPIC_LINKS = {

  // ══════════════════════════════════════════════════
  // MONTH 0 — Python Foundations + Basic Backend
  // ══════════════════════════════════════════════════

  // ── Week 0: Python Core Deep Dive ──

  // Day 0: Data Structures & Memory
  "0_0_0_0": [ // Mutable vs Immutable types
    { type: "doc", label: "RealPython", url: "https://realpython.com/python-mutable-vs-immutable-types/" },
    { type: "doc", label: "Python Docs", url: "https://docs.python.org/3/reference/datamodel.html" }
  ],
  "0_0_0_1": [ // list / tuple / set / dict — when to use each
    { type: "doc", label: "RealPython", url: "https://realpython.com/python-data-structures/" },
    { type: "doc", label: "Python Docs", url: "https://docs.python.org/3/tutorial/datastructures.html" }
  ],
  "0_0_0_2": [ // Big-O basics
    { type: "doc", label: "Big-O Cheatsheet", url: "https://www.bigocheatsheet.com/" },
    { type: "doc", label: "RealPython", url: "https://realpython.com/sorting-algorithms-python/#measuring-efficiency-with-big-o-notation" }
  ],
  "0_0_0_3": [ // Hash tables and why dict lookup is O(1)
    { type: "doc", label: "RealPython", url: "https://realpython.com/python-hash-table/" },
    { type: "doc", label: "Python Docs", url: "https://docs.python.org/3/tutorial/datastructures.html#dictionaries" }
  ],
  "0_0_0_4": [ // LeetCode: Two Sum, Contains Duplicate, Valid Anagram
    { type: "problem", label: "Two Sum #1", url: "https://leetcode.com/problems/two-sum/" },
    { type: "problem", label: "Contains Duplicate #217", url: "https://leetcode.com/problems/contains-duplicate/" },
    { type: "problem", label: "Valid Anagram #242", url: "https://leetcode.com/problems/valid-anagram/" }
  ],

  // Day 1: Object-Oriented Programming
  "0_0_1_0": [ // Classes, __init__, self, instance variables
    { type: "doc", label: "RealPython OOP", url: "https://realpython.com/python3-object-oriented-programming/" },
    { type: "doc", label: "Python Docs", url: "https://docs.python.org/3/tutorial/classes.html" }
  ],
  "0_0_1_1": [ // Inheritance, super(), polymorphism
    { type: "doc", label: "RealPython", url: "https://realpython.com/inheritance-composition-python/" },
    { type: "doc", label: "Python super()", url: "https://docs.python.org/3/library/functions.html#super" }
  ],
  "0_0_1_2": [ // Magic methods: __str__, __repr__, __len__
    { type: "doc", label: "RealPython", url: "https://realpython.com/python-magic-methods/" },
    { type: "doc", label: "Python Data Model", url: "https://docs.python.org/3/reference/datamodel.html#special-method-names" }
  ],
  "0_0_1_3": [ // @classmethod, @staticmethod
    { type: "doc", label: "RealPython", url: "https://realpython.com/instance-class-and-static-methods-demystified/" },
    { type: "doc", label: "Python Docs", url: "https://docs.python.org/3/library/functions.html#classmethod" }
  ],
  "0_0_1_4": [ // Build: Bank Account System
    { type: "doc", label: "RealPython OOP", url: "https://realpython.com/python3-object-oriented-programming/" }
  ],
  "0_0_1_5": [ // LeetCode: Valid Parentheses (#20)
    { type: "problem", label: "Valid Parentheses #20", url: "https://leetcode.com/problems/valid-parentheses/" }
  ],

  // Day 2: Decorators, Generators, Advanced
  "0_0_2_0": [ // Decorators
    { type: "doc", label: "RealPython", url: "https://realpython.com/primer-on-python-decorators/" },
    { type: "doc", label: "Python Docs", url: "https://docs.python.org/3/glossary.html#term-decorator" }
  ],
  "0_0_2_1": [ // Generators and yield
    { type: "doc", label: "RealPython", url: "https://realpython.com/introduction-to-python-generators/" },
    { type: "doc", label: "Python Docs", url: "https://docs.python.org/3/howto/functional.html#generators" }
  ],
  "0_0_2_2": [ // Context managers
    { type: "doc", label: "RealPython", url: "https://realpython.com/python-with-statement/" },
    { type: "doc", label: "Python Docs", url: "https://docs.python.org/3/reference/compound_stmts.html#the-with-statement" }
  ],
  "0_0_2_3": [ // Lambda, comprehensions, *args/**kwargs
    { type: "doc", label: "RealPython Lambda", url: "https://realpython.com/python-lambda/" },
    { type: "doc", label: "RealPython Comprehensions", url: "https://realpython.com/list-comprehension-python/" },
    { type: "doc", label: "RealPython args/kwargs", url: "https://realpython.com/python-kwargs-and-args/" }
  ],
  "0_0_2_4": [ // Build: logging, retry, timer decorators
    { type: "doc", label: "RealPython Decorators", url: "https://realpython.com/primer-on-python-decorators/" }
  ],
  "0_0_2_5": [ // LeetCode: Fibonacci Number (#509)
    { type: "problem", label: "Fibonacci Number #509", url: "https://leetcode.com/problems/fibonacci-number/" }
  ],

  // Day 3: CLI Expense Tracker
  "0_0_3_0": [ // OOP + decorators + generators combined
    { type: "doc", label: "RealPython OOP", url: "https://realpython.com/python3-object-oriented-programming/" }
  ],
  "0_0_3_1": [ // JSON persistence
    { type: "doc", label: "RealPython JSON", url: "https://realpython.com/python-json/" },
    { type: "doc", label: "Python json module", url: "https://docs.python.org/3/library/json.html" }
  ],
  "0_0_3_2": [ // Category filtering, monthly summaries
    { type: "doc", label: "Python Docs", url: "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions" }
  ],
  "0_0_3_3": [ // Push to GitHub
    { type: "doc", label: "GitHub Quickstart", url: "https://docs.github.com/en/get-started/quickstart/create-a-repo" }
  ],

  // ── Week 1: FastAPI & REST API Basics ──

  // Day 0: HTTP + First FastAPI App
  "0_1_0_0": [ // HTTP protocol, methods
    { type: "doc", label: "MDN HTTP Overview", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" },
    { type: "doc", label: "MDN HTTP Methods", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods" }
  ],
  "0_1_0_1": [ // Status codes
    { type: "doc", label: "MDN Status Codes", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" }
  ],
  "0_1_0_2": [ // FastAPI setup, path params, query params
    { type: "doc", label: "FastAPI First Steps", url: "https://fastapi.tiangolo.com/tutorial/first-steps/" },
    { type: "doc", label: "FastAPI Path Params", url: "https://fastapi.tiangolo.com/tutorial/path-params/" },
    { type: "doc", label: "FastAPI Query Params", url: "https://fastapi.tiangolo.com/tutorial/query-params/" }
  ],
  "0_1_0_3": [ // Swagger UI auto-docs
    { type: "doc", label: "FastAPI Docs", url: "https://fastapi.tiangolo.com/tutorial/" }
  ],

  // Day 1: Pydantic Models + CRUD
  "0_1_1_0": [ // Pydantic validation, type hints
    { type: "doc", label: "Pydantic Models", url: "https://docs.pydantic.dev/latest/concepts/models/" },
    { type: "doc", label: "FastAPI Body", url: "https://fastapi.tiangolo.com/tutorial/body/" }
  ],
  "0_1_1_1": [ // Request/response models
    { type: "doc", label: "FastAPI Response Model", url: "https://fastapi.tiangolo.com/tutorial/response-model/" },
    { type: "doc", label: "Pydantic Fields", url: "https://docs.pydantic.dev/latest/concepts/fields/" }
  ],
  "0_1_1_2": [ // Build: Task Manager API
    { type: "doc", label: "FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/" }
  ],
  "0_1_1_3": [ // CRUD endpoints with filtering
    { type: "doc", label: "FastAPI Query Params", url: "https://fastapi.tiangolo.com/tutorial/query-params/" }
  ],

  // Day 2: PostgreSQL + SQLAlchemy
  "0_1_2_0": [ // SQL basics
    { type: "doc", label: "W3Schools SQL", url: "https://www.w3schools.com/sql/" },
    { type: "doc", label: "PostgreSQL Tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" }
  ],
  "0_1_2_1": [ // PostgreSQL setup
    { type: "doc", label: "PostgreSQL Downloads", url: "https://www.postgresql.org/download/" },
    { type: "doc", label: "pgAdmin Docs", url: "https://www.pgadmin.org/docs/" }
  ],
  "0_1_2_2": [ // SQLAlchemy ORM
    { type: "doc", label: "SQLAlchemy Tutorial", url: "https://docs.sqlalchemy.org/en/20/tutorial/" },
    { type: "doc", label: "FastAPI SQL DBs", url: "https://fastapi.tiangolo.com/tutorial/sql-databases/" }
  ],
  "0_1_2_3": [ // Connect API to database
    { type: "doc", label: "FastAPI SQL DBs", url: "https://fastapi.tiangolo.com/tutorial/sql-databases/" }
  ],

  // Day 3: Polish + Push
  "0_1_3_0": [ // Error handling (HTTPException)
    { type: "doc", label: "FastAPI Errors", url: "https://fastapi.tiangolo.com/tutorial/handling-errors/" }
  ],
  "0_1_3_1": [ // requirements.txt, .gitignore, README
    { type: "doc", label: "pip Requirements", url: "https://pip.pypa.io/en/stable/user_guide/#requirements-files" },
    { type: "doc", label: "GitHub .gitignore", url: "https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files" }
  ],
  "0_1_3_2": [ // Push to GitHub
    { type: "doc", label: "GitHub Create Repo", url: "https://docs.github.com/en/get-started/quickstart/create-a-repo" }
  ],

  // ── Week 2: Authentication + Async ──

  // Day 0: JWT Authentication
  "0_2_0_0": [ // JWT tokens
    { type: "doc", label: "JWT Introduction", url: "https://jwt.io/introduction" },
    { type: "video", label: "Web Dev Simplified", url: "https://www.youtube.com/watch?v=7Q17ubqLfaM" }
  ],
  "0_2_0_1": [ // Password hashing with bcrypt
    { type: "doc", label: "passlib Docs", url: "https://passlib.readthedocs.io/en/stable/" },
    { type: "doc", label: "OWASP Password Storage", url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" }
  ],
  "0_2_0_2": [ // Register/login endpoints
    { type: "doc", label: "FastAPI JWT Auth", url: "https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/" }
  ],
  "0_2_0_3": [ // Protected routes
    { type: "doc", label: "FastAPI Security", url: "https://fastapi.tiangolo.com/tutorial/security/" }
  ],

  // Day 1: Async Programming
  "0_2_1_0": [ // sync vs async, async/await
    { type: "doc", label: "RealPython Async", url: "https://realpython.com/async-io-python/" },
    { type: "doc", label: "Python asyncio", url: "https://docs.python.org/3/library/asyncio.html" }
  ],
  "0_2_1_1": [ // asyncio basics
    { type: "doc", label: "Python asyncio Tasks", url: "https://docs.python.org/3/library/asyncio-task.html" }
  ],
  "0_2_1_2": [ // Refactor to async def
    { type: "doc", label: "FastAPI Async", url: "https://fastapi.tiangolo.com/async/" }
  ],
  "0_2_1_3": [ // Background tasks
    { type: "doc", label: "FastAPI Background Tasks", url: "https://fastapi.tiangolo.com/tutorial/background-tasks/" }
  ],

  // Day 2: Error Handling + Project Structure
  "0_2_2_0": [ // Custom exceptions, global handlers
    { type: "doc", label: "FastAPI Error Handling", url: "https://fastapi.tiangolo.com/tutorial/handling-errors/" },
    { type: "doc", label: "Python Exceptions", url: "https://docs.python.org/3/tutorial/errors.html" }
  ],
  "0_2_2_1": [ // Python logging module
    { type: "doc", label: "Python Logging HOWTO", url: "https://docs.python.org/3/howto/logging.html" },
    { type: "doc", label: "RealPython Logging", url: "https://realpython.com/python-logging/" }
  ],
  "0_2_2_2": [ // Clean folder structure
    { type: "doc", label: "FastAPI Bigger Apps", url: "https://fastapi.tiangolo.com/tutorial/bigger-applications/" }
  ],
  "0_2_2_3": [ // Environment variables
    { type: "doc", label: "FastAPI Settings", url: "https://fastapi.tiangolo.com/advanced/settings/" },
    { type: "doc", label: "python-dotenv", url: "https://pypi.org/project/python-dotenv/" }
  ],

  // Day 3: Week 3 Polish
  "0_2_3_0": [ // Complete Task Manager
    { type: "doc", label: "FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/" }
  ],
  "0_2_3_1": [ // Push polished version
    { type: "doc", label: "GitHub Pushing", url: "https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository" }
  ],

  // ── Week 3: Docker + Testing ──

  // Day 0: Docker Basics
  "0_3_0_0": [ // Containers vs VMs
    { type: "doc", label: "Docker Overview", url: "https://docs.docker.com/get-started/docker-overview/" },
    { type: "video", label: "TechWorld Nana", url: "https://www.youtube.com/watch?v=3c-iBn73dDE" }
  ],
  "0_3_0_1": [ // Dockerfile syntax
    { type: "doc", label: "Dockerfile Reference", url: "https://docs.docker.com/reference/dockerfile/" },
    { type: "doc", label: "Docker Get Started", url: "https://docs.docker.com/get-started/" }
  ],
  "0_3_0_2": [ // Docker Compose
    { type: "doc", label: "Docker Compose", url: "https://docs.docker.com/compose/" },
    { type: "doc", label: "Compose Quickstart", url: "https://docs.docker.com/compose/gettingstarted/" }
  ],
  "0_3_0_3": [ // Dockerize Task Manager
    { type: "doc", label: "FastAPI Docker", url: "https://fastapi.tiangolo.com/deployment/docker/" }
  ],

  // Day 1: Testing with Pytest
  "0_3_1_0": [ // pytest basics
    { type: "doc", label: "pytest Getting Started", url: "https://docs.pytest.org/en/stable/getting-started.html" },
    { type: "doc", label: "RealPython pytest", url: "https://realpython.com/pytest-python-testing/" }
  ],
  "0_3_1_1": [ // TestClient
    { type: "doc", label: "FastAPI Testing", url: "https://fastapi.tiangolo.com/tutorial/testing/" }
  ],
  "0_3_1_2": [ // Test auth flows
    { type: "doc", label: "FastAPI Testing", url: "https://fastapi.tiangolo.com/tutorial/testing/" }
  ],
  "0_3_1_3": [ // pytest --cov
    { type: "doc", label: "pytest-cov", url: "https://pytest-cov.readthedocs.io/en/latest/" }
  ],

  // Day 2: Deploy + Catch-up
  "0_3_2_0": [ // Deploy to Render
    { type: "doc", label: "Render FastAPI", url: "https://docs.render.com/deploy-fastapi" }
  ],
  "0_3_2_1": [ // PostgreSQL on Render
    { type: "doc", label: "Render Databases", url: "https://docs.render.com/databases" }
  ],

  // ── Week 4: Consolidation ──

  // Day 0: Blog Platform API
  "0_4_0_0": [ // Build from scratch
    { type: "doc", label: "FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/" }
  ],
  "0_4_0_1": [ // JWT auth, CRUD posts
    { type: "doc", label: "FastAPI JWT", url: "https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/" }
  ],
  "0_4_0_2": [ // Search, pagination, Docker
    { type: "doc", label: "FastAPI Query Params", url: "https://fastapi.tiangolo.com/tutorial/query-params/" }
  ],
  "0_4_0_3": [ // Tests (at least 10)
    { type: "doc", label: "FastAPI Testing", url: "https://fastapi.tiangolo.com/tutorial/testing/" }
  ],


  // ══════════════════════════════════════════════════
  // MONTH 1 — Advanced Backend + Deployment
  // ══════════════════════════════════════════════════

  // ── Week 0: Python Foundations Wrap-up ──

  // Day 0: Blog Platform API (continued)
  "1_0_0_0": [ // Build from scratch
    { type: "doc", label: "FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/" }
  ],
  "1_0_0_1": [ // JWT auth, CRUD posts
    { type: "doc", label: "FastAPI JWT", url: "https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/" }
  ],

  // Day 1: Deploy + Review
  "1_0_1_0": [ // Deploy Blog Platform on Render
    { type: "doc", label: "Render FastAPI Deploy", url: "https://docs.render.com/deploy-fastapi" }
  ],
  "1_0_1_1": [ // Write portfolio-worthy README
    { type: "doc", label: "GitHub About READMEs", url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes" },
    { type: "doc", label: "Make a README", url: "https://www.makeareadme.com/" }
  ],
  "1_0_1_3": [ // Push to GitHub
    { type: "doc", label: "GitHub Push", url: "https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository" }
  ],

  // ── Week 1: Advanced FastAPI Patterns ──

  // Day 0: Middleware, CORS, Rate Limiting
  "1_1_0_0": [ // Middleware concepts, CORS setup
    { type: "doc", label: "FastAPI Middleware", url: "https://fastapi.tiangolo.com/tutorial/middleware/" },
    { type: "doc", label: "FastAPI CORS", url: "https://fastapi.tiangolo.com/tutorial/cors/" }
  ],
  "1_1_0_1": [ // Rate limiting, request ID tracking
    { type: "doc", label: "SlowAPI (Rate Limiting)", url: "https://pypi.org/project/slowapi/" },
    { type: "doc", label: "FastAPI Middleware", url: "https://fastapi.tiangolo.com/tutorial/middleware/" }
  ],
  "1_1_0_2": [ // Global exception handlers
    { type: "doc", label: "FastAPI Error Handling", url: "https://fastapi.tiangolo.com/tutorial/handling-errors/" }
  ],

  // Day 1: File Uploads + WebSockets
  "1_1_1_0": [ // File upload endpoints
    { type: "doc", label: "FastAPI File Upload", url: "https://fastapi.tiangolo.com/tutorial/request-files/" }
  ],
  "1_1_1_1": [ // WebSocket basics
    { type: "doc", label: "FastAPI WebSockets", url: "https://fastapi.tiangolo.com/advanced/websockets/" },
    { type: "doc", label: "MDN WebSocket API", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" }
  ],
  "1_1_1_2": [ // Background tasks
    { type: "doc", label: "FastAPI Background Tasks", url: "https://fastapi.tiangolo.com/tutorial/background-tasks/" }
  ],

  // Day 2: API Design Best Practices
  "1_1_2_0": [ // Pagination patterns
    { type: "doc", label: "FastAPI Query Params", url: "https://fastapi.tiangolo.com/tutorial/query-params/" },
    { type: "doc", label: "REST API Pagination", url: "https://www.moesif.com/blog/technical/api-design/REST-API-Design-Filtering-Sorting-and-Pagination/" }
  ],
  "1_1_2_1": [ // Filtering and sorting
    { type: "doc", label: "REST API Filtering", url: "https://www.moesif.com/blog/technical/api-design/REST-API-Design-Filtering-Sorting-and-Pagination/" }
  ],
  "1_1_2_2": [ // API versioning
    { type: "doc", label: "FastAPI Routing", url: "https://fastapi.tiangolo.com/tutorial/bigger-applications/" }
  ],
  "1_1_2_3": [ // OpenAPI documentation polish
    { type: "doc", label: "FastAPI Metadata", url: "https://fastapi.tiangolo.com/tutorial/metadata/" }
  ],

  // ── Week 2: Testing Mastery + CI/CD ──

  // Day 0: Comprehensive Testing
  "1_2_0_0": [ // Unit tests, integration tests, e2e tests
    { type: "doc", label: "RealPython pytest", url: "https://realpython.com/pytest-python-testing/" },
    { type: "doc", label: "pytest Docs", url: "https://docs.pytest.org/en/stable/" }
  ],
  "1_2_0_1": [ // Fixtures, conftest.py, parametrize
    { type: "doc", label: "pytest Fixtures", url: "https://docs.pytest.org/en/stable/how-to/fixtures.html" },
    { type: "doc", label: "pytest Parametrize", url: "https://docs.pytest.org/en/stable/how-to/parametrize.html" }
  ],
  "1_2_0_2": [ // Mocking external services
    { type: "doc", label: "unittest.mock", url: "https://docs.python.org/3/library/unittest.mock.html" },
    { type: "doc", label: "RealPython Mock", url: "https://realpython.com/python-mock-library/" }
  ],
  "1_2_0_3": [ // 80%+ code coverage
    { type: "doc", label: "pytest-cov", url: "https://pytest-cov.readthedocs.io/en/latest/" }
  ],

  // Day 1: CI/CD with GitHub Actions
  "1_2_1_0": [ // GitHub Actions workflow files
    { type: "doc", label: "GitHub Actions Quickstart", url: "https://docs.github.com/en/actions/quickstart" },
    { type: "doc", label: "Actions Workflow Syntax", url: "https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions" }
  ],
  "1_2_1_1": [ // Auto-run tests on push
    { type: "doc", label: "Build & Test Python", url: "https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-python" }
  ],
  "1_2_1_2": [ // Code quality: black, ruff, mypy
    { type: "doc", label: "Black Formatter", url: "https://black.readthedocs.io/en/stable/" },
    { type: "doc", label: "Ruff Linter", url: "https://docs.astral.sh/ruff/" },
    { type: "doc", label: "mypy Docs", url: "https://mypy.readthedocs.io/en/stable/" }
  ],
  "1_2_1_3": [ // Auto-deploy to Render
    { type: "doc", label: "Render Deploy Hooks", url: "https://docs.render.com/deploy-hooks" }
  ],

  // ── Week 3: System Design + Caching ──

  // Day 0: System Design Basics
  "1_3_0_0": [ // Client-server architecture
    { type: "doc", label: "MDN Client-Server", url: "https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Client-Server_overview" }
  ],
  "1_3_0_1": [ // Load balancing, horizontal scaling
    { type: "video", label: "ByteByteGo", url: "https://www.youtube.com/watch?v=K0Ta65OqQkY" },
    { type: "doc", label: "AWS Load Balancing", url: "https://aws.amazon.com/what-is/load-balancing/" }
  ],
  "1_3_0_2": [ // Database indexing, N+1 problem
    { type: "doc", label: "PostgreSQL Indexes", url: "https://www.postgresql.org/docs/current/indexes.html" },
    { type: "doc", label: "SQLAlchemy Performance", url: "https://docs.sqlalchemy.org/en/20/faq/performance.html" }
  ],
  "1_3_0_3": [ // Caching strategies (Redis intro)
    { type: "doc", label: "Redis Getting Started", url: "https://redis.io/docs/getting-started/" },
    { type: "doc", label: "AWS Caching", url: "https://aws.amazon.com/caching/" }
  ],

  // Day 1: Redis + Advanced DB Patterns
  "1_3_1_0": [ // Redis setup
    { type: "doc", label: "Redis Getting Started", url: "https://redis.io/docs/getting-started/" },
    { type: "doc", label: "Redis Commands", url: "https://redis.io/commands/" }
  ],
  "1_3_1_1": [ // Caching API responses with Redis
    { type: "doc", label: "redis-py Docs", url: "https://redis-py.readthedocs.io/en/stable/" }
  ],
  "1_3_1_2": [ // Database migrations with Alembic
    { type: "doc", label: "Alembic Tutorial", url: "https://alembic.sqlalchemy.org/en/latest/tutorial.html" }
  ],
  "1_3_1_3": [ // Connection pooling
    { type: "doc", label: "SQLAlchemy Pooling", url: "https://docs.sqlalchemy.org/en/20/core/pooling.html" }
  ],

  // ── Week 4: Capstone Project ──

  // Day 0: Collaborative Notes API
  "1_4_0_0": [ // Real-time WebSockets
    { type: "doc", label: "FastAPI WebSockets", url: "https://fastapi.tiangolo.com/advanced/websockets/" }
  ],
  "1_4_0_1": [ // User roles and permissions
    { type: "doc", label: "FastAPI Security", url: "https://fastapi.tiangolo.com/tutorial/security/" },
    { type: "doc", label: "FastAPI Dependencies", url: "https://fastapi.tiangolo.com/tutorial/dependencies/" }
  ],
  "1_4_0_2": [ // Full test suite, CI/CD
    { type: "doc", label: "GitHub Actions Python", url: "https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-python" }
  ],
  "1_4_0_3": [ // Redis caching layer
    { type: "doc", label: "redis-py Docs", url: "https://redis-py.readthedocs.io/en/stable/" }
  ],

  // Day 1: Deploy + Polish
  "1_4_1_0": [ // Dockerized deployment
    { type: "doc", label: "Docker Compose", url: "https://docs.docker.com/compose/" },
    { type: "doc", label: "FastAPI Docker", url: "https://fastapi.tiangolo.com/deployment/docker/" }
  ],
  "1_4_1_1": [ // Portfolio-worthy README
    { type: "doc", label: "Make a README", url: "https://www.makeareadme.com/" }
  ],
  "1_4_1_2": [ // Push to GitHub
    { type: "doc", label: "GitHub Push", url: "https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository" }
  ],


  // ══════════════════════════════════════════════════
  // MONTH 2 — Math Basics + ML Foundations
  // ══════════════════════════════════════════════════

  // ── Week 0: Linear Algebra for ML ──

  // Day 0: Vectors & Matrices
  "2_0_0_0": [ // Vectors, matrices, operations with NumPy
    { type: "doc", label: "NumPy Quickstart", url: "https://numpy.org/doc/stable/user/quickstart.html" },
    { type: "video", label: "3Blue1Brown Vectors", url: "https://www.youtube.com/watch?v=fNk_zzaMoSs" }
  ],
  "2_0_0_1": [ // Dot product, matrix multiplication
    { type: "video", label: "3Blue1Brown Dot Product", url: "https://www.youtube.com/watch?v=LyGKycYT2v0" },
    { type: "doc", label: "NumPy matmul", url: "https://numpy.org/doc/stable/reference/generated/numpy.matmul.html" }
  ],
  "2_0_0_2": [ // 3Blue1Brown: Essence of Linear Algebra (videos 1–4)
    { type: "video", label: "Essence of Linear Algebra", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" }
  ],

  // Day 1: Transforms & Eigenvalues
  "2_0_1_0": [ // Linear transformations
    { type: "video", label: "3Blue1Brown Linear Transforms", url: "https://www.youtube.com/watch?v=kYB8IZa5AuE" },
    { type: "doc", label: "Khan Academy Linear Transforms", url: "https://www.khanacademy.org/math/linear-algebra/matrix-transformations" }
  ],
  "2_0_1_1": [ // Determinants, inverse matrices
    { type: "video", label: "3Blue1Brown Determinant", url: "https://www.youtube.com/watch?v=Ip3X9LOh2dk" },
    { type: "doc", label: "NumPy linalg", url: "https://numpy.org/doc/stable/reference/routines.linalg.html" }
  ],
  "2_0_1_2": [ // Eigenvalues/eigenvectors
    { type: "video", label: "3Blue1Brown Eigenvectors", url: "https://www.youtube.com/watch?v=PFDu9oVAE-g" },
    { type: "doc", label: "StatQuest PCA", url: "https://www.youtube.com/watch?v=FgakZw6K1QQ" }
  ],
  "2_0_1_3": [ // 3Blue1Brown: Essence of Linear Algebra (videos 5–10)
    { type: "video", label: "Essence of Linear Algebra", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" }
  ],

  // Day 2: NumPy Practice
  "2_0_2_0": [ // Broadcasting, vectorized operations
    { type: "doc", label: "NumPy Broadcasting", url: "https://numpy.org/doc/stable/user/basics.broadcasting.html" }
  ],
  "2_0_2_1": [ // Matrix operations in NumPy
    { type: "doc", label: "NumPy for MATLAB Users", url: "https://numpy.org/doc/stable/user/numpy-for-matlab-users.html" }
  ],
  "2_0_2_2": [ // Mini-project: solve system of equations
    { type: "doc", label: "NumPy linalg.solve", url: "https://numpy.org/doc/stable/reference/generated/numpy.linalg.solve.html" }
  ],

  // ── Week 1: Calculus & Probability for ML ──

  // Day 0: Calculus Intuition
  "2_1_0_0": [ // What is a derivative
    { type: "video", label: "3Blue1Brown Derivatives", url: "https://www.youtube.com/watch?v=9vKqVkMQHKk" },
    { type: "doc", label: "Khan Academy Derivatives", url: "https://www.khanacademy.org/math/calculus-1/cs1-derivatives-definition-and-basic-rules" }
  ],
  "2_1_0_1": [ // Gradient descent
    { type: "video", label: "3Blue1Brown Gradient Descent", url: "https://www.youtube.com/watch?v=IHZwWFHWa-w" },
    { type: "doc", label: "ML Glossary Gradient Descent", url: "https://ml-cheatsheet.readthedocs.io/en/latest/gradient_descent.html" }
  ],
  "2_1_0_2": [ // Partial derivatives
    { type: "video", label: "Khan Academy Partials", url: "https://www.youtube.com/watch?v=AXqhWeUEtQU" }
  ],
  "2_1_0_3": [ // 3Blue1Brown: Essence of Calculus
    { type: "video", label: "Essence of Calculus", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr" }
  ],

  // Day 1: Calculus in ML Context
  "2_1_1_0": [ // Chain rule (backpropagation)
    { type: "video", label: "3Blue1Brown Backprop", url: "https://www.youtube.com/watch?v=Ilg3gGewQ5U" },
    { type: "doc", label: "ML Glossary Backprop", url: "https://ml-cheatsheet.readthedocs.io/en/latest/backpropagation.html" }
  ],
  "2_1_1_1": [ // Cost functions and optimization
    { type: "doc", label: "ML Glossary Loss Functions", url: "https://ml-cheatsheet.readthedocs.io/en/latest/loss_functions.html" },
    { type: "video", label: "StatQuest Cost Functions", url: "https://www.youtube.com/watch?v=sDv4f4s2SB8" }
  ],
  "2_1_1_2": [ // Implement gradient descent from scratch
    { type: "doc", label: "ML Glossary Gradient Descent", url: "https://ml-cheatsheet.readthedocs.io/en/latest/gradient_descent.html" }
  ],
  "2_1_1_3": [ // Visualize loss landscape
    { type: "video", label: "3Blue1Brown Neural Networks", url: "https://www.youtube.com/watch?v=aircAruvnKk" }
  ],

  // Day 2: Probability & Statistics
  "2_1_2_0": [ // Mean, median, standard deviation, variance
    { type: "doc", label: "Khan Academy Stats", url: "https://www.khanacademy.org/math/statistics-probability" },
    { type: "video", label: "StatQuest Histogram/Mean", url: "https://www.youtube.com/watch?v=qBigTkBLU6g" }
  ],
  "2_1_2_1": [ // Normal distribution, Bayes' theorem
    { type: "video", label: "3Blue1Brown Bayes", url: "https://www.youtube.com/watch?v=HZGCoVF3YvM" },
    { type: "video", label: "StatQuest Normal Dist", url: "https://www.youtube.com/watch?v=rzFX5NWojp0" }
  ],
  "2_1_2_2": [ // Correlation vs causation
    { type: "doc", label: "Khan Academy Correlation", url: "https://www.khanacademy.org/math/statistics-probability/describing-relationships-quantitative-data" }
  ],
  "2_1_2_3": [ // Hypothesis testing basics
    { type: "video", label: "StatQuest P-values", url: "https://www.youtube.com/watch?v=vemZtEM63GY" },
    { type: "doc", label: "Khan Academy Hypothesis", url: "https://www.khanacademy.org/math/statistics-probability/significance-tests-one-sample" }
  ],
  "2_1_2_4": [ // StatQuest videos on probability
    { type: "video", label: "StatQuest Probability", url: "https://www.youtube.com/watch?v=uzkc-qNVoOk" }
  ],

  // ── Week 2: First ML Models ──

  // Day 0: ML Concepts + Linear Regression
  "2_2_0_0": [ // Supervised vs unsupervised learning
    { type: "video", label: "StatQuest ML Overview", url: "https://www.youtube.com/watch?v=Gv9_4yMHFhI" },
    { type: "doc", label: "sklearn Supervised", url: "https://scikit-learn.org/stable/supervised_learning.html" }
  ],
  "2_2_0_1": [ // Train/test split, overfitting/underfitting
    { type: "doc", label: "sklearn Train Test Split", url: "https://scikit-learn.org/stable/modules/cross_validation.html" },
    { type: "video", label: "StatQuest Train/Test", url: "https://www.youtube.com/watch?v=fSytzGwwBVw" }
  ],
  "2_2_0_2": [ // Linear regression from scratch
    { type: "video", label: "StatQuest Linear Regression", url: "https://www.youtube.com/watch?v=PaFPbb66DxQ" },
    { type: "doc", label: "ML Glossary Linear Reg", url: "https://ml-cheatsheet.readthedocs.io/en/latest/linear_regression.html" }
  ],
  "2_2_0_3": [ // scikit-learn: House price prediction
    { type: "doc", label: "sklearn LinearRegression", url: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html" },
    { type: "doc", label: "Kaggle Housing Tutorial", url: "https://www.kaggle.com/learn/intro-to-machine-learning" }
  ],

  // Day 1: Logistic Regression
  "2_2_1_0": [ // Classification vs regression
    { type: "video", label: "StatQuest Classification", url: "https://www.youtube.com/watch?v=vN5cNN2-HWE" }
  ],
  "2_2_1_1": [ // Sigmoid function, decision boundary
    { type: "video", label: "StatQuest Logistic Reg", url: "https://www.youtube.com/watch?v=yIYKR4sgzI8" },
    { type: "doc", label: "ML Glossary Logistic Reg", url: "https://ml-cheatsheet.readthedocs.io/en/latest/logistic_regression.html" }
  ],
  "2_2_1_2": [ // Build: Spam classifier
    { type: "doc", label: "sklearn LogisticRegression", url: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html" }
  ],
  "2_2_1_3": [ // Metrics: accuracy, precision, recall, F1
    { type: "video", label: "StatQuest Sensitivity/Specificity", url: "https://www.youtube.com/watch?v=vP06aMoz4v8" },
    { type: "doc", label: "sklearn Metrics", url: "https://scikit-learn.org/stable/modules/model_evaluation.html" }
  ],

  // Day 2: Evaluation Deep Dive
  "2_2_2_0": [ // Confusion matrix, ROC curve, AUC
    { type: "video", label: "StatQuest ROC & AUC", url: "https://www.youtube.com/watch?v=4jRBRDbJemM" },
    { type: "doc", label: "sklearn ROC Curve", url: "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_curve.html" }
  ],
  "2_2_2_1": [ // Cross-validation (k-fold)
    { type: "video", label: "StatQuest Cross-Validation", url: "https://www.youtube.com/watch?v=fSytzGwwBVw" },
    { type: "doc", label: "sklearn Cross Validation", url: "https://scikit-learn.org/stable/modules/cross_validation.html" }
  ],
  "2_2_2_2": [ // When accuracy is misleading
    { type: "video", label: "StatQuest Precision/Recall", url: "https://www.youtube.com/watch?v=vP06aMoz4v8" }
  ],
  "2_2_2_3": [ // Andrew Ng ML course materials
    { type: "doc", label: "Coursera ML Specialization", url: "https://www.coursera.org/specializations/machine-learning-introduction" }
  ],

  // ── Week 3: Tree-Based Models ──

  // Day 0: Decision Trees + Random Forests
  "2_3_0_0": [ // Decision tree intuition
    { type: "video", label: "StatQuest Decision Trees", url: "https://www.youtube.com/watch?v=_L39rN6gz7Y" },
    { type: "doc", label: "sklearn Decision Trees", url: "https://scikit-learn.org/stable/modules/tree.html" }
  ],
  "2_3_0_1": [ // Random Forest
    { type: "video", label: "StatQuest Random Forests", url: "https://www.youtube.com/watch?v=J4Wdy0Wc_xQ" },
    { type: "doc", label: "sklearn RandomForest", url: "https://scikit-learn.org/stable/modules/ensemble.html#forests-of-randomized-trees" }
  ],
  "2_3_0_2": [ // Feature importance
    { type: "doc", label: "sklearn Feature Importance", url: "https://scikit-learn.org/stable/auto_examples/ensemble/plot_forest_importances.html" }
  ],
  "2_3_0_3": [ // StatQuest: Decision Trees, Random Forests
    { type: "video", label: "StatQuest RF Part 2", url: "https://www.youtube.com/watch?v=sQ870aTKqiM" }
  ],

  // Day 1: Bias-Variance + Practice
  "2_3_1_0": [ // Bias-variance tradeoff
    { type: "video", label: "StatQuest Bias-Variance", url: "https://www.youtube.com/watch?v=EuBBz3bI-aA" }
  ],
  "2_3_1_1": [ // Overfitting vs underfitting solutions
    { type: "doc", label: "sklearn Overfitting", url: "https://scikit-learn.org/stable/auto_examples/model_selection/plot_underfitting_overfitting.html" }
  ],
  "2_3_1_2": [ // Regularization basics
    { type: "video", label: "StatQuest Regularization", url: "https://www.youtube.com/watch?v=Q81RR3yKn30" },
    { type: "doc", label: "sklearn Ridge/Lasso", url: "https://scikit-learn.org/stable/modules/linear_model.html#ridge-regression-and-classification" }
  ],
  "2_3_1_3": [ // Kaggle dataset practice
    { type: "doc", label: "Kaggle Datasets", url: "https://www.kaggle.com/datasets" },
    { type: "doc", label: "Kaggle Learn", url: "https://www.kaggle.com/learn" }
  ],

  // ── Week 4: End-to-End ML Project ──

  // Day 0: Pandas Mastery + EDA
  "2_4_0_0": [ // DataFrame operations, groupby, merge
    { type: "doc", label: "Pandas Getting Started", url: "https://pandas.pydata.org/docs/getting_started/index.html" },
    { type: "doc", label: "Pandas GroupBy", url: "https://pandas.pydata.org/docs/user_guide/groupby.html" }
  ],
  "2_4_0_1": [ // Data cleaning: missing values, outliers
    { type: "doc", label: "Pandas Missing Data", url: "https://pandas.pydata.org/docs/user_guide/missing_data.html" },
    { type: "doc", label: "Kaggle Data Cleaning", url: "https://www.kaggle.com/learn/data-cleaning" }
  ],
  "2_4_0_2": [ // Visualization: matplotlib, seaborn
    { type: "doc", label: "Matplotlib Tutorials", url: "https://matplotlib.org/stable/tutorials/index.html" },
    { type: "doc", label: "Seaborn Tutorial", url: "https://seaborn.pydata.org/tutorial.html" }
  ],
  "2_4_0_3": [ // Exploratory Data Analysis workflow
    { type: "doc", label: "Kaggle EDA Micro-Course", url: "https://www.kaggle.com/learn/data-visualization" }
  ],

  // Day 1: Churn Prediction Project
  "2_4_1_0": [ // Full pipeline: data → clean → train → evaluate
    { type: "doc", label: "sklearn Pipeline", url: "https://scikit-learn.org/stable/modules/compose.html" },
    { type: "doc", label: "Kaggle Intro to ML", url: "https://www.kaggle.com/learn/intro-to-machine-learning" }
  ],
  "2_4_1_1": [ // Multiple model comparison
    { type: "doc", label: "sklearn Model Selection", url: "https://scikit-learn.org/stable/model_selection.html" }
  ],
  "2_4_1_2": [ // Serve model via FastAPI endpoint
    { type: "doc", label: "FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/" }
  ],
  "2_4_1_3": [ // Push to GitHub: ml-churn-prediction
    { type: "doc", label: "GitHub Push", url: "https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository" }
  ],

  // ── Week 5: Buffer & Catch-up ──

  // Day 0: Review + Catch-up
  "2_5_0_0": [ // Revisit any weak areas
    { type: "doc", label: "Kaggle Learn", url: "https://www.kaggle.com/learn" }
  ],
  "2_5_0_1": [ // Extra Kaggle practice
    { type: "doc", label: "Kaggle Competitions", url: "https://www.kaggle.com/competitions" }
  ],
  "2_5_0_2": [ // Start Andrew Ng Course 2
    { type: "doc", label: "Coursera ML Specialization", url: "https://www.coursera.org/specializations/machine-learning-introduction" }
  ],


  // ══════════════════════════════════════════════════
  // MONTH 3 — ML Engineering + MLOps
  // ══════════════════════════════════════════════════

  // ── Week 0: Math & ML Wrap-up ──

  // Day 0: Review + Catch-up (continued)
  "3_0_0_0": [ // Revisit any weak areas
    { type: "doc", label: "Kaggle Learn", url: "https://www.kaggle.com/learn" }
  ],
  "3_0_0_1": [ // Extra Kaggle practice
    { type: "doc", label: "Kaggle Competitions", url: "https://www.kaggle.com/competitions" }
  ],
  "3_0_0_2": [ // Start Andrew Ng Course 2
    { type: "doc", label: "Coursera ML Specialization", url: "https://www.coursera.org/specializations/machine-learning-introduction" }
  ],

  // ── Week 1: Model Tuning + Advanced Models ──

  // Day 0: Hyperparameter Tuning
  "3_1_0_0": [ // Parameters vs hyperparameters
    { type: "video", label: "StatQuest Hyperparameters", url: "https://www.youtube.com/watch?v=Kk7bywMIjBc" },
    { type: "doc", label: "sklearn Tuning", url: "https://scikit-learn.org/stable/modules/grid_search.html" }
  ],
  "3_1_0_1": [ // Grid Search, Random Search
    { type: "doc", label: "sklearn GridSearchCV", url: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GridSearchCV.html" },
    { type: "doc", label: "sklearn RandomizedSearchCV", url: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.RandomizedSearchCV.html" }
  ],
  "3_1_0_2": [ // Cross-validation + search together
    { type: "doc", label: "sklearn Cross Validation", url: "https://scikit-learn.org/stable/modules/cross_validation.html" }
  ],
  "3_1_0_3": [ // Diminishing returns
    { type: "video", label: "StatQuest Cross-Validation", url: "https://www.youtube.com/watch?v=fSytzGwwBVw" }
  ],

  // Day 1: XGBoost + LightGBM
  "3_1_1_0": [ // Gradient boosting concept
    { type: "video", label: "StatQuest Gradient Boost", url: "https://www.youtube.com/watch?v=3CC4N4z3GJc" },
    { type: "doc", label: "sklearn Gradient Boosting", url: "https://scikit-learn.org/stable/modules/ensemble.html#gradient-tree-boosting" }
  ],
  "3_1_1_1": [ // XGBoost training and tuning
    { type: "doc", label: "XGBoost Docs", url: "https://xgboost.readthedocs.io/en/stable/" },
    { type: "video", label: "StatQuest XGBoost", url: "https://www.youtube.com/watch?v=OtD8wVaFm6E" }
  ],
  "3_1_1_2": [ // LightGBM
    { type: "doc", label: "LightGBM Docs", url: "https://lightgbm.readthedocs.io/en/latest/" },
    { type: "doc", label: "LightGBM Quick Start", url: "https://lightgbm.readthedocs.io/en/latest/Quick-Start.html" }
  ],
  "3_1_1_3": [ // Compare: RF vs XGBoost vs LightGBM
    { type: "video", label: "StatQuest AdaBoost", url: "https://www.youtube.com/watch?v=LsK-xG1cLYA" }
  ],

  // Day 2: Feature Engineering
  "3_1_2_0": [ // Creating new features from existing data
    { type: "doc", label: "Kaggle Feature Engineering", url: "https://www.kaggle.com/learn/feature-engineering" },
    { type: "video", label: "Feature Engineering Tips", url: "https://www.youtube.com/watch?v=6WDFfaYtN6s" }
  ],
  "3_1_2_1": [ // Encoding categoricals
    { type: "doc", label: "sklearn Preprocessing", url: "https://scikit-learn.org/stable/modules/preprocessing.html#encoding-categorical-features" },
    { type: "doc", label: "Kaggle Feature Engineering", url: "https://www.kaggle.com/learn/feature-engineering" }
  ],
  "3_1_2_2": [ // Feature selection methods
    { type: "doc", label: "sklearn Feature Selection", url: "https://scikit-learn.org/stable/modules/feature_selection.html" }
  ],
  "3_1_2_3": [ // Kaggle competition entry
    { type: "doc", label: "Kaggle Getting Started", url: "https://www.kaggle.com/competitions?hostSegmentIdFilter=5" }
  ],

  // ── Week 2: Pipelines + Experiment Tracking ──

  // Day 0: sklearn Pipelines + ETL
  "3_2_0_0": [ // sklearn Pipeline and ColumnTransformer
    { type: "doc", label: "sklearn Pipeline", url: "https://scikit-learn.org/stable/modules/compose.html" },
    { type: "doc", label: "sklearn ColumnTransformer", url: "https://scikit-learn.org/stable/modules/generated/sklearn.compose.ColumnTransformer.html" }
  ],
  "3_2_0_1": [ // Preprocessing + model in one pipeline
    { type: "doc", label: "sklearn Pipeline Examples", url: "https://scikit-learn.org/stable/auto_examples/compose/plot_column_transformer_mixed_types.html" }
  ],
  "3_2_0_2": [ // Saving/loading pipelines with joblib
    { type: "doc", label: "sklearn Persistence", url: "https://scikit-learn.org/stable/model_persistence.html" },
    { type: "doc", label: "joblib Docs", url: "https://joblib.readthedocs.io/en/stable/" }
  ],

  // Day 1: MLflow
  "3_2_1_0": [ // MLflow setup, experiment tracking
    { type: "doc", label: "MLflow Quickstart", url: "https://mlflow.org/docs/latest/getting-started/index.html" },
    { type: "video", label: "MLflow Tutorial", url: "https://www.youtube.com/watch?v=qdcHHrsXA48" }
  ],
  "3_2_1_1": [ // Log parameters, metrics, artifacts
    { type: "doc", label: "MLflow Tracking", url: "https://mlflow.org/docs/latest/tracking.html" }
  ],
  "3_2_1_2": [ // Model registry
    { type: "doc", label: "MLflow Model Registry", url: "https://mlflow.org/docs/latest/model-registry.html" }
  ],
  "3_2_1_3": [ // Compare experiment runs in MLflow UI
    { type: "doc", label: "MLflow Tracking UI", url: "https://mlflow.org/docs/latest/tracking.html#tracking-ui" }
  ],

  // ── Week 3: Model Serving + Monitoring ──

  // Day 0: Model API + Docker
  "3_3_0_0": [ // Serve sklearn model with FastAPI
    { type: "doc", label: "FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/" },
    { type: "video", label: "ML Model Deployment", url: "https://www.youtube.com/watch?v=h5wLuVDr0oc" }
  ],
  "3_3_0_1": [ // Load model in endpoint, predict
    { type: "doc", label: "sklearn Persistence", url: "https://scikit-learn.org/stable/model_persistence.html" }
  ],
  "3_3_0_2": [ // Dockerize the model API
    { type: "doc", label: "FastAPI Docker", url: "https://fastapi.tiangolo.com/deployment/docker/" },
    { type: "doc", label: "Docker Get Started", url: "https://docs.docker.com/get-started/" }
  ],
  "3_3_0_3": [ // Health check and versioning endpoints
    { type: "doc", label: "FastAPI Metadata", url: "https://fastapi.tiangolo.com/tutorial/metadata/" }
  ],

  // Day 1: Monitoring Basics
  "3_3_1_0": [ // Data drift detection concepts
    { type: "doc", label: "Evidently AI", url: "https://docs.evidentlyai.com/" },
    { type: "video", label: "Data Drift Explained", url: "https://www.youtube.com/watch?v=K9sIiEJamZM" }
  ],
  "3_3_1_1": [ // Model performance monitoring
    { type: "doc", label: "Made With ML Monitoring", url: "https://madewithml.com/courses/mlops/monitoring/" }
  ],
  "3_3_1_2": [ // Logging predictions for auditing
    { type: "doc", label: "Python Logging HOWTO", url: "https://docs.python.org/3/howto/logging.html" }
  ],
  "3_3_1_3": [ // When to retrain
    { type: "doc", label: "Made With ML MLOps", url: "https://madewithml.com/courses/mlops/" }
  ],

  // ── Week 4: Complete ML System ──

  // Day 0: Churn ML System Capstone
  "3_4_0_0": [ // Full project: data → pipeline → train → MLflow → API → Docker
    { type: "doc", label: "Made With ML MLOps", url: "https://madewithml.com/courses/mlops/" },
    { type: "doc", label: "MLflow Quickstart", url: "https://mlflow.org/docs/latest/getting-started/index.html" }
  ],
  "3_4_0_1": [ // Clean project structure
    { type: "doc", label: "Cookiecutter Data Science", url: "https://drivendata.github.io/cookiecutter-data-science/" }
  ],
  "3_4_0_2": [ // CI/CD for ML model
    { type: "doc", label: "GitHub Actions Python", url: "https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-python" }
  ],
  "3_4_0_3": [ // Push to GitHub: churn-ml-system
    { type: "doc", label: "GitHub Push", url: "https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository" }
  ],


  // ══════════════════════════════════════════════════
  // MONTH 4 — Deep Learning (CNN + RNN)
  // ══════════════════════════════════════════════════

  // ── Week 0: Neural Network Fundamentals ──

  // Day 0: NN From Scratch + PyTorch Basics
  "4_0_0_0": [ // Perceptron, activation functions
    { type: "video", label: "3Blue1Brown Neural Networks Ch1", url: "https://www.youtube.com/watch?v=aircAruvnKk" },
    { type: "doc", label: "PyTorch nn Module", url: "https://pytorch.org/docs/stable/nn.html" }
  ],
  "4_0_0_1": [ // Forward pass, loss function, backpropagation
    { type: "video", label: "3Blue1Brown Backprop", url: "https://www.youtube.com/watch?v=Ilg3gGewQ5U" },
    { type: "doc", label: "ML Glossary Backprop", url: "https://ml-cheatsheet.readthedocs.io/en/latest/backpropagation.html" }
  ],
  "4_0_0_2": [ // Build a simple NN with NumPy only
    { type: "video", label: "3Blue1Brown Gradient Descent", url: "https://www.youtube.com/watch?v=IHZwWFHWa-w" },
    { type: "doc", label: "NumPy Quickstart", url: "https://numpy.org/doc/stable/user/quickstart.html" }
  ],
  "4_0_0_3": [ // PyTorch tensors, autograd, nn.Module
    { type: "doc", label: "PyTorch 60-Min Blitz", url: "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html" },
    { type: "doc", label: "PyTorch Autograd", url: "https://pytorch.org/tutorials/beginner/blitz/autograd_tutorial.html" }
  ],
  "4_0_0_4": [ // Training loop: forward → loss → backward → update
    { type: "doc", label: "PyTorch Training a Classifier", url: "https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html" }
  ],

  // Day 1: PyTorch Deep Dive
  "4_0_1_0": [ // Datasets, DataLoaders, transforms
    { type: "doc", label: "PyTorch Data Tutorial", url: "https://pytorch.org/tutorials/beginner/basics/data_tutorial.html" },
    { type: "doc", label: "PyTorch Transforms", url: "https://pytorch.org/vision/stable/transforms.html" }
  ],
  "4_0_1_1": [ // Optimizers (SGD, Adam)
    { type: "doc", label: "PyTorch Optim", url: "https://pytorch.org/docs/stable/optim.html" },
    { type: "video", label: "StatQuest Adam Optimizer", url: "https://www.youtube.com/watch?v=MD2fYip6QUQ" }
  ],
  "4_0_1_2": [ // Learning rate schedulers
    { type: "doc", label: "PyTorch LR Scheduler", url: "https://pytorch.org/docs/stable/optim.html#how-to-adjust-learning-rate" }
  ],
  "4_0_1_3": [ // Train MNIST digit classifier
    { type: "doc", label: "PyTorch MNIST Example", url: "https://github.com/pytorch/examples/tree/main/mnist" },
    { type: "video", label: "Daniel Bourke PyTorch", url: "https://www.youtube.com/watch?v=Z_ikDlimN6A" }
  ],
  "4_0_1_4": [ // Google Colab GPU setup
    { type: "doc", label: "Google Colab", url: "https://colab.research.google.com/" },
    { type: "doc", label: "Colab GPU Guide", url: "https://research.google.com/colaboratory/faq.html" }
  ],

  // ── Week 1: CNNs ──

  // Day 0: CNN Theory + Build
  "4_1_0_0": [ // Convolution operation, filters, feature maps
    { type: "video", label: "3Blue1Brown Convolutions", url: "https://www.youtube.com/watch?v=KuXjwB4LzSA" },
    { type: "doc", label: "CS231n CNNs", url: "https://cs231n.github.io/convolutional-networks/" }
  ],
  "4_1_0_1": [ // Pooling, stride, padding
    { type: "doc", label: "CS231n CNNs", url: "https://cs231n.github.io/convolutional-networks/" },
    { type: "doc", label: "PyTorch Conv2d", url: "https://pytorch.org/docs/stable/generated/torch.nn.Conv2d.html" }
  ],
  "4_1_0_2": [ // AlexNet → VGG → ResNet evolution
    { type: "doc", label: "Papers With Code", url: "https://paperswithcode.com/methods/category/convolutional-neural-networks" },
    { type: "video", label: "Yannic Kilcher ResNet", url: "https://www.youtube.com/watch?v=GWt6Fu05voI" }
  ],
  "4_1_0_3": [ // Build CNN for CIFAR-10
    { type: "doc", label: "PyTorch CIFAR-10 Tutorial", url: "https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html" }
  ],

  // Day 1: Transfer Learning
  "4_1_1_0": [ // Pre-trained models (ResNet, EfficientNet)
    { type: "doc", label: "PyTorch TorchVision Models", url: "https://pytorch.org/vision/stable/models.html" },
    { type: "doc", label: "Transfer Learning Tutorial", url: "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html" }
  ],
  "4_1_1_1": [ // Fine-tuning vs feature extraction
    { type: "doc", label: "PyTorch Transfer Learning", url: "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html" },
    { type: "video", label: "fast.ai Transfer Learning", url: "https://www.youtube.com/watch?v=8SF_h3xF3cE" }
  ],
  "4_1_1_2": [ // Data augmentation techniques
    { type: "doc", label: "PyTorch Transforms", url: "https://pytorch.org/vision/stable/transforms.html" },
    { type: "doc", label: "Albumentations Docs", url: "https://albumentations.ai/docs/" }
  ],
  "4_1_1_3": [ // Build: Image classifier with transfer learning
    { type: "doc", label: "PyTorch Transfer Learning", url: "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html" }
  ],

  // ── Week 2: RNNs and Sequence Models ──

  // Day 0: RNN + LSTM Theory
  "4_2_0_0": [ // Sequential data, time steps
    { type: "video", label: "StatQuest RNN", url: "https://www.youtube.com/watch?v=AsNTP8Kwu80" },
    { type: "doc", label: "Colah LSTM Blog", url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/" }
  ],
  "4_2_0_1": [ // Vanishing gradient problem
    { type: "video", label: "StatQuest Vanishing Gradients", url: "https://www.youtube.com/watch?v=qhXZsFVxGKo" }
  ],
  "4_2_0_2": [ // LSTM: forget, input, output gates
    { type: "doc", label: "Colah Understanding LSTMs", url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/" },
    { type: "video", label: "StatQuest LSTM", url: "https://www.youtube.com/watch?v=YCzL96nL7j0" }
  ],
  "4_2_0_3": [ // GRU (simplified LSTM)
    { type: "doc", label: "PyTorch GRU", url: "https://pytorch.org/docs/stable/generated/torch.nn.GRU.html" }
  ],

  // Day 1: Sequence Projects
  "4_2_1_0": [ // Sentiment analysis on IMDB
    { type: "doc", label: "PyTorch Text Tutorial", url: "https://pytorch.org/tutorials/beginner/text_sentiment_ngrams_tutorial.html" },
    { type: "doc", label: "HuggingFace IMDB Dataset", url: "https://huggingface.co/datasets/imdb" }
  ],
  "4_2_1_1": [ // Next word predictor (character-level)
    { type: "doc", label: "PyTorch Char RNN", url: "https://pytorch.org/tutorials/intermediate/char_rnn_generation_tutorial.html" }
  ],
  "4_2_1_2": [ // Embeddings for text
    { type: "doc", label: "PyTorch Embedding", url: "https://pytorch.org/docs/stable/generated/torch.nn.Embedding.html" },
    { type: "video", label: "Word2Vec Explained", url: "https://www.youtube.com/watch?v=viZrOnJclY0" }
  ],
  "4_2_1_3": [ // Compare RNN vs LSTM performance
    { type: "doc", label: "Colah LSTMs", url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/" }
  ],

  // ── Week 3: DL Model Deployment ──

  // Day 0: Serve DL Model with FastAPI
  "4_3_0_0": [ // Save/load PyTorch models
    { type: "doc", label: "PyTorch Saving Models", url: "https://pytorch.org/tutorials/beginner/saving_loading_models.html" }
  ],
  "4_3_0_1": [ // Build prediction API endpoint
    { type: "doc", label: "FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/" }
  ],
  "4_3_0_2": [ // Handle image upload → classify → respond
    { type: "doc", label: "FastAPI File Upload", url: "https://fastapi.tiangolo.com/tutorial/request-files/" }
  ],
  "4_3_0_3": [ // Dockerize and deploy
    { type: "doc", label: "FastAPI Docker", url: "https://fastapi.tiangolo.com/deployment/docker/" }
  ],
  "4_3_0_4": [ // Push to GitHub
    { type: "doc", label: "GitHub Push", url: "https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository" }
  ],

  // ── Week 4: Buffer + Community ──

  // Day 0: Review + Networking
  "4_4_0_0": [ // Revisit weak areas
    { type: "doc", label: "fast.ai Course", url: "https://course.fast.ai/" }
  ],
  "4_4_0_1": [ // Extra Kaggle competitions
    { type: "doc", label: "Kaggle Competitions", url: "https://www.kaggle.com/competitions" }
  ],
  "4_4_0_2": [ // Join AI/ML Discord communities
    { type: "doc", label: "Weights & Biases Community", url: "https://wandb.ai/site/community" }
  ],


  // ══════════════════════════════════════════════════
  // MONTH 5 — NLP + Transformers
  // ══════════════════════════════════════════════════

  // ── Week 0: Deep Learning Wrap-up ──

  // Day 0: Review + Catch-up
  "5_0_0_0": [ // Revisit weak areas (backprop, LSTM)
    { type: "doc", label: "fast.ai Course", url: "https://course.fast.ai/" }
  ],
  "5_0_0_1": [ // Extra Kaggle competitions
    { type: "doc", label: "Kaggle Competitions", url: "https://www.kaggle.com/competitions" }
  ],
  "5_0_0_2": [ // fast.ai additional lessons
    { type: "doc", label: "fast.ai Part 2", url: "https://course.fast.ai/Lessons/part2.html" }
  ],

  // ── Week 1: Tokenization + Attention Mechanism ──

  // Day 0: Tokenization + Text Representation
  "5_1_0_0": [ // Word-level, subword (BPE, WordPiece), character-level
    { type: "doc", label: "HuggingFace Tokenizers", url: "https://huggingface.co/learn/nlp-course/chapter6/1" },
    { type: "video", label: "Let's build GPT tokenizer", url: "https://www.youtube.com/watch?v=zduSFxRajkE" }
  ],
  "5_1_0_1": [ // HuggingFace tokenizers library
    { type: "doc", label: "HuggingFace Tokenizers Docs", url: "https://huggingface.co/docs/tokenizers/" },
    { type: "doc", label: "HuggingFace NLP Course Ch6", url: "https://huggingface.co/learn/nlp-course/chapter6/1" }
  ],
  "5_1_0_2": [ // Word embeddings (Word2Vec concept)
    { type: "video", label: "Word2Vec StatQuest", url: "https://www.youtube.com/watch?v=viZrOnJclY0" },
    { type: "doc", label: "Jay Alammar Word2Vec", url: "https://jalammar.github.io/illustrated-word2vec/" }
  ],
  "5_1_0_3": [ // Why tokenization matters for LLMs
    { type: "video", label: "Karpathy Tokenizer", url: "https://www.youtube.com/watch?v=zduSFxRajkE" }
  ],

  // Day 1: Attention Mechanism
  "5_1_1_0": [ // Self-attention intuition
    { type: "video", label: "3Blue1Brown Attention", url: "https://www.youtube.com/watch?v=eMlx5fFNoYc" },
    { type: "doc", label: "Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/" }
  ],
  "5_1_1_1": [ // Query, Key, Value matrices
    { type: "doc", label: "Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/" },
    { type: "video", label: "3Blue1Brown Attention", url: "https://www.youtube.com/watch?v=eMlx5fFNoYc" }
  ],
  "5_1_1_2": [ // Scaled dot-product attention
    { type: "doc", label: "Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" },
    { type: "doc", label: "Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/" }
  ],
  "5_1_1_3": [ // Multi-head attention
    { type: "video", label: "3Blue1Brown Attention", url: "https://www.youtube.com/watch?v=eMlx5fFNoYc" },
    { type: "doc", label: "Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" }
  ],
  "5_1_1_4": [ // Read: The Illustrated Transformer
    { type: "doc", label: "Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/" }
  ],

  // ── Week 2: Transformer Architecture + HuggingFace ──

  // Day 0: Full Transformer Architecture
  "5_2_0_0": [ // Encoder-decoder structure
    { type: "doc", label: "Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/" },
    { type: "video", label: "Andrej Karpathy GPT", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY" }
  ],
  "5_2_0_1": [ // Positional encoding
    { type: "doc", label: "Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/" },
    { type: "video", label: "3Blue1Brown Attention", url: "https://www.youtube.com/watch?v=eMlx5fFNoYc" }
  ],
  "5_2_0_2": [ // Layer normalization, feed-forward layers
    { type: "doc", label: "PyTorch LayerNorm", url: "https://pytorch.org/docs/stable/generated/torch.nn.LayerNorm.html" }
  ],
  "5_2_0_3": [ // BERT (encoder-only) vs GPT (decoder-only)
    { type: "doc", label: "Illustrated BERT", url: "https://jalammar.github.io/illustrated-bert/" },
    { type: "doc", label: "Illustrated GPT-2", url: "https://jalammar.github.io/illustrated-gpt2/" },
    { type: "video", label: "3Blue1Brown Attention", url: "https://www.youtube.com/watch?v=eMlx5fFNoYc" }
  ],

  // Day 1: HuggingFace Pipelines + BERT
  "5_2_1_0": [ // Pipeline API for 7+ NLP tasks
    { type: "doc", label: "HuggingFace Pipelines", url: "https://huggingface.co/docs/transformers/main_classes/pipelines" },
    { type: "doc", label: "HuggingFace NLP Course", url: "https://huggingface.co/learn/nlp-course/chapter1/1" }
  ],
  "5_2_1_1": [ // Fine-tune BERT for sentiment
    { type: "doc", label: "HuggingFace Fine-tune", url: "https://huggingface.co/learn/nlp-course/chapter3/1" },
    { type: "doc", label: "HuggingFace Trainer", url: "https://huggingface.co/docs/transformers/main_classes/trainer" }
  ],
  "5_2_1_2": [ // Trainer API, evaluation metrics
    { type: "doc", label: "HuggingFace Trainer", url: "https://huggingface.co/docs/transformers/main_classes/trainer" },
    { type: "doc", label: "HuggingFace Evaluate", url: "https://huggingface.co/docs/evaluate/" }
  ],
  "5_2_1_3": [ // Named Entity Recognition (NER)
    { type: "doc", label: "HuggingFace NER", url: "https://huggingface.co/learn/nlp-course/chapter7/2" },
    { type: "doc", label: "spaCy NER Guide", url: "https://spacy.io/usage/linguistic-features#named-entities" }
  ],

  // ── Week 3: Embeddings + Vector Search ──

  // Day 0: Sentence Embeddings
  "5_3_0_0": [ // Sentence-transformers library
    { type: "doc", label: "Sentence-Transformers Docs", url: "https://www.sbert.net/" },
    { type: "doc", label: "HuggingFace Sentence Similarity", url: "https://huggingface.co/tasks/sentence-similarity" }
  ],
  "5_3_0_1": [ // Generate embeddings for any text
    { type: "doc", label: "SBERT Usage", url: "https://www.sbert.net/docs/quickstart.html" }
  ],
  "5_3_0_2": [ // Cosine similarity for matching
    { type: "doc", label: "sklearn Cosine Similarity", url: "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html" },
    { type: "doc", label: "SBERT Semantic Search", url: "https://www.sbert.net/examples/applications/semantic-search/README.html" }
  ],
  "5_3_0_3": [ // Compare embedding models
    { type: "doc", label: "MTEB Leaderboard", url: "https://huggingface.co/spaces/mteb/leaderboard" }
  ],

  // Day 1: FAISS + Semantic Search
  "5_3_1_0": [ // FAISS vector index setup
    { type: "doc", label: "FAISS Getting Started", url: "https://github.com/facebookresearch/faiss/wiki/Getting-started" },
    { type: "doc", label: "FAISS Tutorial", url: "https://github.com/facebookresearch/faiss/wiki" }
  ],
  "5_3_1_1": [ // Build: Semantic search API
    { type: "doc", label: "SBERT Semantic Search", url: "https://www.sbert.net/examples/applications/semantic-search/README.html" }
  ],
  "5_3_1_2": [ // Embed documents → index → query → rank
    { type: "doc", label: "FAISS Wiki", url: "https://github.com/facebookresearch/faiss/wiki" }
  ],
  "5_3_1_3": [ // FastAPI endpoint for search
    { type: "doc", label: "FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/" }
  ],

  // ── Week 4: Document Intelligence System ──

  // Day 0: Capstone Project
  "5_4_0_0": [ // Combine: classify + NER + search + summarize
    { type: "doc", label: "HuggingFace Pipelines", url: "https://huggingface.co/docs/transformers/main_classes/pipelines" }
  ],
  "5_4_0_1": [ // Multi-model pipeline
    { type: "doc", label: "HuggingFace Pipelines", url: "https://huggingface.co/docs/transformers/main_classes/pipelines" }
  ],
  "5_4_0_2": [ // FastAPI with all endpoints
    { type: "doc", label: "FastAPI Bigger Apps", url: "https://fastapi.tiangolo.com/tutorial/bigger-applications/" }
  ],
  "5_4_0_3": [ // Push to GitHub: document-intelligence
    { type: "doc", label: "GitHub Push", url: "https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository" }
  ],


  // ══════════════════════════════════════════════════
  // MONTH 6 — LLM APIs + RAG Systems
  // ══════════════════════════════════════════════════

  // ── Week 0: NLP + Transformers Wrap-up ──

  // Day 0: Review + Preview
  "6_0_0_0": [ // Solidify transformer understanding
    { type: "doc", label: "Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/" }
  ],
  "6_0_0_1": [ // Preview RAG concepts
    { type: "video", label: "RAG Explained", url: "https://www.youtube.com/watch?v=T-D1OfcDW1M" }
  ],

  // ── Week 1: LLM APIs + Prompt Engineering ──

  // Day 0: OpenAI API + Basics
  "6_1_0_0": [ // API setup, chat completions
    { type: "doc", label: "OpenAI API Quickstart", url: "https://platform.openai.com/docs/quickstart" },
    { type: "doc", label: "OpenAI Chat API", url: "https://platform.openai.com/docs/guides/text-generation" }
  ],
  "6_1_0_1": [ // Streaming responses, multi-turn
    { type: "doc", label: "OpenAI Streaming", url: "https://platform.openai.com/docs/api-reference/streaming" },
    { type: "doc", label: "OpenAI Chat API", url: "https://platform.openai.com/docs/guides/text-generation" }
  ],
  "6_1_0_2": [ // Temperature, max_tokens, system prompts
    { type: "doc", label: "OpenAI API Reference", url: "https://platform.openai.com/docs/api-reference/chat/create" }
  ],
  "6_1_0_3": [ // Ollama for free local LLMs
    { type: "doc", label: "Ollama Docs", url: "https://ollama.com/" },
    { type: "doc", label: "Ollama GitHub", url: "https://github.com/ollama/ollama" }
  ],

  // Day 1: Prompt Engineering
  "6_1_1_0": [ // Zero-shot, few-shot, chain-of-thought
    { type: "doc", label: "Prompt Engineering Guide", url: "https://www.promptingguide.ai/" },
    { type: "doc", label: "OpenAI Prompt Engineering", url: "https://platform.openai.com/docs/guides/prompt-engineering" }
  ],
  "6_1_1_1": [ // System prompts for persona/constraints
    { type: "doc", label: "OpenAI Prompt Engineering", url: "https://platform.openai.com/docs/guides/prompt-engineering" }
  ],
  "6_1_1_2": [ // Output formatting (JSON mode)
    { type: "doc", label: "OpenAI JSON Mode", url: "https://platform.openai.com/docs/guides/text-generation#json-mode" }
  ],
  "6_1_1_3": [ // Prompt templates and best practices
    { type: "doc", label: "Prompt Engineering Guide", url: "https://www.promptingguide.ai/" },
    { type: "video", label: "DeepLearning.AI Prompt Eng", url: "https://www.youtube.com/watch?v=_ZvnD96BbJI" }
  ],

  // ── Week 2: RAG From Scratch + LangChain ──

  // Day 0: Build RAG Without Frameworks
  "6_2_0_0": [ // Load → chunk → embed → store → retrieve → generate
    { type: "video", label: "RAG From Scratch (LangChain)", url: "https://www.youtube.com/watch?v=sVcwVQRHIc8" },
    { type: "doc", label: "Prompt Engineering Guide RAG", url: "https://www.promptingguide.ai/research/rag" }
  ],
  "6_2_0_1": [ // Text splitting strategies
    { type: "doc", label: "LangChain Text Splitters", url: "https://python.langchain.com/docs/how_to/#text-splitters" },
    { type: "doc", label: "Chunking Strategies", url: "https://www.pinecone.io/learn/chunking-strategies/" }
  ],
  "6_2_0_2": [ // ChromaDB vector store
    { type: "doc", label: "ChromaDB Getting Started", url: "https://docs.trychroma.com/getting-started" },
    { type: "doc", label: "ChromaDB Docs", url: "https://docs.trychroma.com/" }
  ],
  "6_2_0_3": [ // Build complete RAG pipeline in plain Python
    { type: "doc", label: "OpenAI Embeddings", url: "https://platform.openai.com/docs/guides/embeddings" }
  ],

  // Day 1: LangChain RAG
  "6_2_1_0": [ // LangChain document loaders, text splitters
    { type: "doc", label: "LangChain Doc Loaders", url: "https://python.langchain.com/docs/how_to/#document-loaders" },
    { type: "doc", label: "LangChain Text Splitters", url: "https://python.langchain.com/docs/how_to/#text-splitters" }
  ],
  "6_2_1_1": [ // LangChain retrievers and chains
    { type: "doc", label: "LangChain Retrievers", url: "https://python.langchain.com/docs/how_to/#retrievers" },
    { type: "doc", label: "LangChain RAG Tutorial", url: "https://python.langchain.com/docs/tutorials/rag/" }
  ],
  "6_2_1_2": [ // Conversational RAG with memory
    { type: "doc", label: "LangChain Chat History", url: "https://python.langchain.com/docs/how_to/chatbots_memory/" },
    { type: "doc", label: "LangChain Conversational RAG", url: "https://python.langchain.com/docs/tutorials/qa_chat_history/" }
  ],
  "6_2_1_3": [ // Compare: vanilla vs LangChain approach
    { type: "doc", label: "LangChain RAG Tutorial", url: "https://python.langchain.com/docs/tutorials/rag/" }
  ],

  // ── Week 3: PDF Chatbot Project ──

  // Day 0: Build PDF Chatbot
  "6_3_0_0": [ // Upload PDF → parse → chunk → embed → index
    { type: "doc", label: "PyPDF2 Docs", url: "https://pypdf2.readthedocs.io/en/stable/" },
    { type: "doc", label: "LangChain PDF Loader", url: "https://python.langchain.com/docs/how_to/document_loader_pdf/" }
  ],
  "6_3_0_1": [ // Chat endpoint with conversation history
    { type: "doc", label: "LangChain Chat History", url: "https://python.langchain.com/docs/how_to/chatbots_memory/" }
  ],
  "6_3_0_2": [ // Streaming responses (SSE)
    { type: "doc", label: "FastAPI StreamingResponse", url: "https://fastapi.tiangolo.com/advanced/custom-response/#streamingresponse" },
    { type: "doc", label: "MDN Server-Sent Events", url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events" }
  ],
  "6_3_0_3": [ // FastAPI + ChromaDB + OpenAI/Ollama
    { type: "doc", label: "ChromaDB Docs", url: "https://docs.trychroma.com/" },
    { type: "doc", label: "FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/" }
  ],
  "6_3_0_4": [ // Push to GitHub: pdf-chatbot-rag
    { type: "doc", label: "GitHub Push", url: "https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository" }
  ],

  // ── Week 4: Production RAG Features ──

  // Day 0: Production Polish + Job Prep Start
  "6_4_0_0": [ // Redis caching for repeated queries
    { type: "doc", label: "redis-py Docs", url: "https://redis-py.readthedocs.io/en/stable/" },
    { type: "doc", label: "Redis Getting Started", url: "https://redis.io/docs/getting-started/" }
  ],
  "6_4_0_1": [ // Hybrid search (semantic + keyword)
    { type: "doc", label: "Pinecone Hybrid Search", url: "https://www.pinecone.io/learn/hybrid-search-intro/" },
    { type: "doc", label: "ChromaDB Where Filters", url: "https://docs.trychroma.com/guides#filtering-by-metadata" }
  ],
  "6_4_0_2": [ // Docker Compose (API + ChromaDB + Redis)
    { type: "doc", label: "Docker Compose", url: "https://docs.docker.com/compose/" }
  ],
  "6_4_0_3": [ // Deploy and test production RAG
    { type: "doc", label: "Render Deploy", url: "https://docs.render.com/deploy-fastapi" }
  ],


  // ══════════════════════════════════════════════════
  // MONTH 7 — Production RAG + DevOps for AI
  // ══════════════════════════════════════════════════

  // ── Week 0: Advanced Docker ──

  // Day 0: Multi-Stage Builds + Compose
  "7_0_0_0": [ // Multi-stage Docker builds
    { type: "doc", label: "Docker Multi-Stage", url: "https://docs.docker.com/build/building/multi-stage/" },
    { type: "video", label: "TechWorld Nana Docker", url: "https://www.youtube.com/watch?v=3c-iBn73dDE" }
  ],
  "7_0_0_1": [ // Docker Compose for full AI stack
    { type: "doc", label: "Docker Compose", url: "https://docs.docker.com/compose/" },
    { type: "doc", label: "Compose File Reference", url: "https://docs.docker.com/compose/compose-file/" }
  ],
  "7_0_0_2": [ // postgres + redis + chromadb + nginx + API
    { type: "doc", label: "Compose Networking", url: "https://docs.docker.com/compose/networking/" }
  ],
  "7_0_0_3": [ // Health checks, restart policies
    { type: "doc", label: "Docker Healthcheck", url: "https://docs.docker.com/reference/dockerfile/#healthcheck" },
    { type: "doc", label: "Compose Deploy", url: "https://docs.docker.com/compose/compose-file/deploy/" }
  ],

  // Day 1: Container Optimization
  "7_0_1_0": [ // .dockerignore best practices
    { type: "doc", label: "Docker .dockerignore", url: "https://docs.docker.com/reference/dockerfile/#dockerignore-file" }
  ],
  "7_0_1_1": [ // Layer caching strategies
    { type: "doc", label: "Docker Build Cache", url: "https://docs.docker.com/build/cache/" }
  ],
  "7_0_1_2": [ // Security: non-root user, secrets
    { type: "doc", label: "Docker Security", url: "https://docs.docker.com/engine/security/" },
    { type: "doc", label: "Docker Secrets", url: "https://docs.docker.com/compose/use-secrets/" }
  ],

  // ── Week 1: CI/CD Deep Dive ──

  // Day 0: GitHub Actions for AI
  "7_1_0_0": [ // Multi-job pipeline
    { type: "doc", label: "GitHub Actions Jobs", url: "https://docs.github.com/en/actions/using-jobs" },
    { type: "doc", label: "Actions Workflow Syntax", url: "https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions" }
  ],
  "7_1_0_1": [ // Model performance CI
    { type: "doc", label: "GitHub Actions Python", url: "https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-python" }
  ],
  "7_1_0_2": [ // Secrets management for API keys
    { type: "doc", label: "GitHub Encrypted Secrets", url: "https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions" }
  ],
  "7_1_0_3": [ // Docker image build + push in CI
    { type: "doc", label: "GitHub Docker Build Push", url: "https://docs.github.com/en/actions/publishing-packages/publishing-docker-images" }
  ],
  "7_1_0_4": [ // Auto-deploy on merge to main
    { type: "doc", label: "Actions Events", url: "https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows" }
  ],

  // ── Week 2: System Design for AI ──

  // Day 0: Scaling AI Systems
  "7_2_0_0": [ // Horizontal vs vertical scaling
    { type: "video", label: "ByteByteGo Scaling", url: "https://www.youtube.com/watch?v=K0Ta65OqQkY" },
    { type: "doc", label: "AWS Scaling", url: "https://aws.amazon.com/what-is/load-balancing/" }
  ],
  "7_2_0_1": [ // Async processing with queues
    { type: "doc", label: "RabbitMQ Tutorials", url: "https://www.rabbitmq.com/tutorials" },
    { type: "doc", label: "Celery Getting Started", url: "https://docs.celeryq.dev/en/stable/getting-started/introduction.html" }
  ],
  "7_2_0_2": [ // Rate limiting LLM API calls
    { type: "doc", label: "OpenAI Rate Limits", url: "https://platform.openai.com/docs/guides/rate-limits" }
  ],
  "7_2_0_3": [ // Cost optimization strategies
    { type: "doc", label: "OpenAI Pricing", url: "https://openai.com/pricing" }
  ],

  // Day 1: Monitoring + Alerting
  "7_2_1_0": [ // RAG quality metrics tracking
    { type: "doc", label: "RAGAS Docs", url: "https://docs.ragas.io/" },
    { type: "doc", label: "LangSmith Docs", url: "https://docs.smith.langchain.com/" }
  ],
  "7_2_1_1": [ // Request logging and analytics
    { type: "doc", label: "Python Logging HOWTO", url: "https://docs.python.org/3/howto/logging.html" }
  ],
  "7_2_1_2": [ // Alerting on quality drop
    { type: "doc", label: "LangSmith Monitoring", url: "https://docs.smith.langchain.com/" }
  ],
  "7_2_1_3": [ // System design document writing
    { type: "video", label: "ByteByteGo System Design", url: "https://www.youtube.com/watch?v=i7twT3x5yv8" }
  ],

  // ── Week 3: Polish + Start Job Hunt ──

  // Day 0: Portfolio Polish + Apply
  "7_3_0_0": [ // Polish all repos with great READMEs
    { type: "doc", label: "Make a README", url: "https://www.makeareadme.com/" }
  ],
  "7_3_0_1": [ // System design document for capstone
    { type: "video", label: "ByteByteGo System Design", url: "https://www.youtube.com/watch?v=i7twT3x5yv8" }
  ],
  "7_3_0_2": [ // Update resume and LinkedIn
    { type: "doc", label: "Harvard Resume Guide", url: "https://hwpi.harvard.edu/files/ocs/files/hes-resume-cover-letter-guide.pdf" }
  ],


  // ══════════════════════════════════════════════════
  // MONTH 8 — AI Agents + Fine-tuning + Evaluation
  // ══════════════════════════════════════════════════

  // ── Week 0: AI Evaluation ──

  // Day 0: Understanding AI Quality
  "8_0_0_0": [ // Why AI evaluation is hard
    { type: "doc", label: "RAGAS Concepts", url: "https://docs.ragas.io/en/latest/concepts/" },
    { type: "video", label: "DeepLearning.AI Eval RAG", url: "https://www.youtube.com/watch?v=ahnGLM-RC1Y" }
  ],
  "8_0_0_1": [ // Metrics: correctness, faithfulness, relevance
    { type: "doc", label: "RAGAS Metrics", url: "https://docs.ragas.io/en/latest/concepts/metrics/" },
    { type: "doc", label: "LangSmith Evaluation", url: "https://docs.smith.langchain.com/evaluation" }
  ],
  "8_0_0_2": [ // LLM-as-Judge pattern
    { type: "doc", label: "LangChain LLM-as-Judge", url: "https://docs.smith.langchain.com/evaluation/how_to_guides/llm_as_judge" },
    { type: "doc", label: "OpenAI Evals", url: "https://github.com/openai/evals" }
  ],
  "8_0_0_3": [ // Automated vs human evaluation
    { type: "doc", label: "RAGAS Docs", url: "https://docs.ragas.io/" }
  ],

  // Day 1: Build Evaluation Framework
  "8_0_1_0": [ // RAGEvaluator class
    { type: "doc", label: "RAGAS Quick Start", url: "https://docs.ragas.io/en/latest/getstarted/" },
    { type: "doc", label: "LangSmith Custom Eval", url: "https://docs.smith.langchain.com/evaluation" }
  ],
  "8_0_1_1": [ // Evaluate dataset with aggregate metrics
    { type: "doc", label: "RAGAS Evaluate", url: "https://docs.ragas.io/en/latest/getstarted/rag_evaluation/" }
  ],
  "8_0_1_2": [ // Pass rate and failure analysis
    { type: "doc", label: "LangSmith Tracing", url: "https://docs.smith.langchain.com/tracing" }
  ],

  // Day 2: RAGAS Framework
  "8_0_2_0": [ // RAGAS metrics for RAG evaluation
    { type: "doc", label: "RAGAS Metrics", url: "https://docs.ragas.io/en/latest/concepts/metrics/" }
  ],
  "8_0_2_1": [ // Create evaluation datasets
    { type: "doc", label: "RAGAS Test Set Gen", url: "https://docs.ragas.io/en/latest/getstarted/testset_generation/" }
  ],
  "8_0_2_2": [ // Automated evaluation pipelines
    { type: "doc", label: "RAGAS Evaluate", url: "https://docs.ragas.io/en/latest/getstarted/rag_evaluation/" }
  ],

  // Day 3: AI Test Case Generator
  "8_0_3_0": [ // Auto-generate test cases for AI systems
    { type: "doc", label: "RAGAS Test Set Gen", url: "https://docs.ragas.io/en/latest/getstarted/testset_generation/" },
    { type: "doc", label: "OpenAI Evals", url: "https://github.com/openai/evals" }
  ],
  "8_0_3_1": [ // Normal, edge, adversarial, ambiguous cases
    { type: "doc", label: "Prompt Injection Guide", url: "https://www.promptingguide.ai/prompts/adversarial-prompting" }
  ],
  "8_0_3_2": [ // Push to GitHub: ai-evaluation-framework
    { type: "doc", label: "GitHub Push", url: "https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository" }
  ],

  // ── Week 1: AI Agents ──

  // Day 0: Agent Concepts
  "8_1_0_0": [ // What is an AI agent
    { type: "video", label: "DeepLearning.AI Agents", url: "https://www.youtube.com/watch?v=sal78ACtGTc" },
    { type: "doc", label: "LangGraph Concepts", url: "https://langchain-ai.github.io/langgraph/concepts/" }
  ],
  "8_1_0_1": [ // Tool calling / function calling
    { type: "doc", label: "OpenAI Function Calling", url: "https://platform.openai.com/docs/guides/function-calling" },
    { type: "doc", label: "LangChain Tools", url: "https://python.langchain.com/docs/how_to/#tools" }
  ],
  "8_1_0_2": [ // Agent loop: Think → Act → Observe → Repeat
    { type: "doc", label: "LangGraph Quick Start", url: "https://langchain-ai.github.io/langgraph/tutorials/introduction/" },
    { type: "doc", label: "ReAct Paper", url: "https://arxiv.org/abs/2210.03629" }
  ],
  "8_1_0_3": [ // ReAct, plan-and-execute patterns
    { type: "doc", label: "ReAct Paper", url: "https://arxiv.org/abs/2210.03629" },
    { type: "doc", label: "LangGraph Plan & Execute", url: "https://langchain-ai.github.io/langgraph/tutorials/plan-and-execute/plan-and-execute/" }
  ],

  // Day 1: Build Agent with Tool Calling
  "8_1_1_0": [ // OpenAI function calling API
    { type: "doc", label: "OpenAI Function Calling", url: "https://platform.openai.com/docs/guides/function-calling" }
  ],
  "8_1_1_1": [ // Define tools (search, calculate, DB query)
    { type: "doc", label: "LangChain Custom Tools", url: "https://python.langchain.com/docs/how_to/custom_tools/" }
  ],
  "8_1_1_2": [ // Agent loop implementation
    { type: "doc", label: "LangGraph Agent Tutorial", url: "https://langchain-ai.github.io/langgraph/tutorials/introduction/" }
  ],
  "8_1_1_3": [ // Multi-tool reasoning
    { type: "doc", label: "OpenAI Parallel Function Calls", url: "https://platform.openai.com/docs/guides/function-calling" }
  ],

  // Day 2: LangChain Agents + LangGraph
  "8_1_2_0": [ // LangGraph state graph for workflows
    { type: "doc", label: "LangGraph Concepts", url: "https://langchain-ai.github.io/langgraph/concepts/" },
    { type: "doc", label: "LangGraph Quick Start", url: "https://langchain-ai.github.io/langgraph/tutorials/introduction/" }
  ],
  "8_1_2_1": [ // Multi-step agent pipelines
    { type: "doc", label: "LangGraph Multi-Agent", url: "https://langchain-ai.github.io/langgraph/tutorials/multi_agent/multi-agent-collaboration/" }
  ],
  "8_1_2_2": [ // Agent API endpoint
    { type: "doc", label: "LangServe Docs", url: "https://python.langchain.com/docs/langserve/" }
  ],
  "8_1_2_3": [ // Push to GitHub: ai-agent-system
    { type: "doc", label: "GitHub Push", url: "https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository" }
  ],

  // ── Week 2: Fine-tuning LLMs ──

  // Day 0: Fine-tuning Theory
  "8_2_0_0": [ // Why fine-tune
    { type: "video", label: "DeepLearning.AI Fine-tuning", url: "https://www.youtube.com/watch?v=eC6Hd1hFvos" },
    { type: "doc", label: "HuggingFace Fine-tune Guide", url: "https://huggingface.co/docs/transformers/training" }
  ],
  "8_2_0_1": [ // LoRA: add small trainable matrices
    { type: "doc", label: "HuggingFace PEFT LoRA", url: "https://huggingface.co/docs/peft/conceptual_guides/lora" },
    { type: "doc", label: "LoRA Paper", url: "https://arxiv.org/abs/2106.09685" }
  ],
  "8_2_0_2": [ // QLoRA: quantized LoRA
    { type: "doc", label: "QLoRA Paper", url: "https://arxiv.org/abs/2305.14314" },
    { type: "doc", label: "BitsAndBytes", url: "https://huggingface.co/docs/bitsandbytes/" }
  ],
  "8_2_0_3": [ // RAG vs fine-tuning: when to use which
    { type: "doc", label: "OpenAI Fine-tuning Guide", url: "https://platform.openai.com/docs/guides/fine-tuning" }
  ],

  // Day 1: Fine-tune with LoRA
  "8_2_1_0": [ // HuggingFace PEFT + TRL libraries
    { type: "doc", label: "HuggingFace PEFT", url: "https://huggingface.co/docs/peft" },
    { type: "doc", label: "TRL (Transformer RL)", url: "https://huggingface.co/docs/trl/" }
  ],
  "8_2_1_1": [ // BitsAndBytes 4-bit quantization
    { type: "doc", label: "BitsAndBytes Docs", url: "https://huggingface.co/docs/bitsandbytes/" },
    { type: "doc", label: "HuggingFace Quantization", url: "https://huggingface.co/docs/transformers/quantization" }
  ],
  "8_2_1_2": [ // Training data preparation
    { type: "doc", label: "HuggingFace Datasets", url: "https://huggingface.co/docs/datasets/" }
  ],
  "8_2_1_3": [ // Fine-tune on Google Colab
    { type: "doc", label: "Google Colab", url: "https://colab.research.google.com/" }
  ],

  // Day 2: Evaluate Fine-tuned Model
  "8_2_2_0": [ // Compare base vs fine-tuned model
    { type: "doc", label: "HuggingFace Evaluate", url: "https://huggingface.co/docs/evaluate/" }
  ],
  "8_2_2_1": [ // Measure task-specific accuracy
    { type: "doc", label: "HuggingFace Evaluate", url: "https://huggingface.co/docs/evaluate/" }
  ],
  "8_2_2_2": [ // Check for regressions
    { type: "doc", label: "LM Evaluation Harness", url: "https://github.com/EleutherAI/lm-evaluation-harness" }
  ],
  "8_2_2_3": [ // Push to GitHub: fine-tuned-llm
    { type: "doc", label: "GitHub Push", url: "https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository" }
  ],

  // ── Week 3: AI QA Platform Capstone ──

  // Day 0: AI QA Platform Capstone
  "8_3_0_0": [ // Auto-generate test cases for AI systems
    { type: "doc", label: "RAGAS Test Set Gen", url: "https://docs.ragas.io/en/latest/getstarted/testset_generation/" }
  ],
  "8_3_0_1": [ // Run evaluations against any RAG endpoint
    { type: "doc", label: "RAGAS Evaluate", url: "https://docs.ragas.io/en/latest/getstarted/rag_evaluation/" }
  ],
  "8_3_0_2": [ // Hallucination detection endpoint
    { type: "doc", label: "RAGAS Faithfulness", url: "https://docs.ragas.io/en/latest/concepts/metrics/" },
    { type: "doc", label: "Vectara HHEM", url: "https://huggingface.co/vectara/hallucination_evaluation_model" }
  ],
  "8_3_0_3": [ // Evaluation reports and dashboards
    { type: "doc", label: "LangSmith Docs", url: "https://docs.smith.langchain.com/" }
  ],
  "8_3_0_4": [ // Docker deployment + CI/CD
    { type: "doc", label: "Docker Compose", url: "https://docs.docker.com/compose/" },
    { type: "doc", label: "GitHub Actions", url: "https://docs.github.com/en/actions" }
  ],
  "8_3_0_5": [ // Push to GitHub: ai-qa-platform
    { type: "doc", label: "GitHub Push", url: "https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository" }
  ],

  // ── Week 4: Buffer + Advanced ──

  // Day 0: Catch-up + Explore
  "8_4_0_0": [ // CrewAI multi-agent systems
    { type: "doc", label: "CrewAI Docs", url: "https://docs.crewai.com/" },
    { type: "doc", label: "CrewAI GitHub", url: "https://github.com/crewAIInc/crewAI" }
  ],
  "8_4_0_1": [ // LLM safety and alignment
    { type: "doc", label: "Anthropic Safety Research", url: "https://www.anthropic.com/research" },
    { type: "doc", label: "OpenAI Safety", url: "https://openai.com/safety" }
  ],
  "8_4_0_2": [ // Practice explaining concepts
    { type: "doc", label: "dev.to", url: "https://dev.to/" }
  ],
  "8_4_0_3": [ // LeetCode: graphs, design problems
    { type: "problem", label: "NeetCode Graph Problems", url: "https://neetcode.io/practice?subpage=practice&tab=coreSkills&topic=Graphs" },
    { type: "problem", label: "LeetCode Graph Tag", url: "https://leetcode.com/tag/graph/" }
  ],


  // ══════════════════════════════════════════════════
  // MONTH 9 — Portfolio, Capstone & Job Prep
  // ══════════════════════════════════════════════════

  // ── Week 0: AI Agents Wrap-up ──

  // Day 0: Catch-up + Explore (continued)
  "9_0_0_0": [ // CrewAI multi-agent systems
    { type: "doc", label: "CrewAI Docs", url: "https://docs.crewai.com/" }
  ],
  "9_0_0_1": [ // LLM safety and alignment
    { type: "doc", label: "Anthropic Safety", url: "https://www.anthropic.com/research" }
  ],
  "9_0_0_2": [ // Practice explaining concepts
    { type: "doc", label: "dev.to", url: "https://dev.to/" }
  ],
  "9_0_0_3": [ // LeetCode: graphs, design problems
    { type: "problem", label: "NeetCode Graphs", url: "https://neetcode.io/practice?subpage=practice&tab=coreSkills&topic=Graphs" }
  ],

  // ── Week 1: Flagship Capstone ──

  // Day 0: Core Build
  "9_1_0_0": [ // Enterprise AI Platform
    { type: "doc", label: "FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/" },
    { type: "doc", label: "LangChain RAG Tutorial", url: "https://python.langchain.com/docs/tutorials/rag/" }
  ],
  "9_1_0_1": [ // JWT auth, document upload, multi-tenant
    { type: "doc", label: "FastAPI JWT", url: "https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/" },
    { type: "doc", label: "FastAPI File Upload", url: "https://fastapi.tiangolo.com/tutorial/request-files/" }
  ],
  "9_1_0_2": [ // RAG pipeline with hybrid search
    { type: "doc", label: "Pinecone Hybrid Search", url: "https://www.pinecone.io/learn/hybrid-search-intro/" }
  ],
  "9_1_0_3": [ // AI agent with tool calling
    { type: "doc", label: "LangGraph Agent", url: "https://langchain-ai.github.io/langgraph/tutorials/introduction/" }
  ],

  // Day 1: Features + Quality
  "9_1_1_0": [ // Quality monitoring dashboard
    { type: "doc", label: "LangSmith Monitoring", url: "https://docs.smith.langchain.com/" }
  ],
  "9_1_1_1": [ // Redis caching, rate limiting
    { type: "doc", label: "redis-py Docs", url: "https://redis-py.readthedocs.io/en/stable/" },
    { type: "doc", label: "SlowAPI Rate Limiting", url: "https://pypi.org/project/slowapi/" }
  ],
  "9_1_1_2": [ // Tests (80%+ coverage)
    { type: "doc", label: "pytest-cov", url: "https://pytest-cov.readthedocs.io/en/latest/" },
    { type: "doc", label: "FastAPI Testing", url: "https://fastapi.tiangolo.com/tutorial/testing/" }
  ],
  "9_1_1_3": [ // CI/CD pipeline
    { type: "doc", label: "GitHub Actions", url: "https://docs.github.com/en/actions" }
  ],

  // Day 2: Deploy + Document
  "9_1_2_0": [ // Docker Compose full stack
    { type: "doc", label: "Docker Compose", url: "https://docs.docker.com/compose/" }
  ],
  "9_1_2_1": [ // Stellar README + API docs + architecture
    { type: "doc", label: "Make a README", url: "https://www.makeareadme.com/" },
    { type: "doc", label: "FastAPI Metadata", url: "https://fastapi.tiangolo.com/tutorial/metadata/" }
  ],
  "9_1_2_2": [ // Record demo (GIF/video)
    { type: "doc", label: "Loom (Screen Record)", url: "https://www.loom.com/" }
  ],
  "9_1_2_3": [ // Push to GitHub: enterprise-ai-platform
    { type: "doc", label: "GitHub Push", url: "https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository" }
  ],

  // ── Week 2: GitHub Portfolio Polish ──

  // Day 0: Audit All Repos
  "9_2_0_0": [ // Clean READMEs for every repo
    { type: "doc", label: "Make a README", url: "https://www.makeareadme.com/" }
  ],
  "9_2_0_1": [ // Remove debug code, fix .gitignore
    { type: "doc", label: "GitHub .gitignore", url: "https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files" },
    { type: "doc", label: "gitignore.io", url: "https://www.toptal.com/developers/gitignore" }
  ],
  "9_2_0_2": [ // Consistent naming, MIT license
    { type: "doc", label: "Choose a License", url: "https://choosealicense.com/" }
  ],
  "9_2_0_3": [ // Pin 6 best repos on profile
    { type: "doc", label: "GitHub Pin Repos", url: "https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/pinning-items-to-your-profile" }
  ],

  // Day 1: Profile + Website
  "9_2_1_0": [ // GitHub profile README
    { type: "doc", label: "GitHub Profile README", url: "https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme" },
    { type: "doc", label: "Awesome GitHub Profile", url: "https://github.com/abhisheknaiidu/awesome-github-profile-readme" }
  ],
  "9_2_1_1": [ // Optional: portfolio website (GitHub Pages)
    { type: "doc", label: "GitHub Pages", url: "https://pages.github.com/" },
    { type: "doc", label: "Vercel Deploy", url: "https://vercel.com/docs/getting-started-with-vercel" }
  ],
  "9_2_1_2": [ // Blog posts (2–3 on Medium/dev.to)
    { type: "doc", label: "dev.to", url: "https://dev.to/" },
    { type: "doc", label: "Medium", url: "https://medium.com/" }
  ],

  // ── Week 3: Resume + LinkedIn + Strategy ──

  // Day 0: Resume
  "9_3_0_0": [ // One page, AI-focused
    { type: "doc", label: "Harvard Resume Guide", url: "https://hwpi.harvard.edu/files/ocs/files/hes-resume-cover-letter-guide.pdf" }
  ],
  "9_3_0_1": [ // Projects section > Experience section
    { type: "doc", label: "Harvard Resume Guide", url: "https://hwpi.harvard.edu/files/ocs/files/hes-resume-cover-letter-guide.pdf" }
  ],
  "9_3_0_2": [ // Numbers everywhere
    { type: "doc", label: "Resume Guide", url: "https://www.makeareadme.com/" }
  ],
  "9_3_0_3": [ // ATS-friendly format
    { type: "doc", label: "Jobscan ATS Guide", url: "https://www.jobscan.co/blog/ats-resume/" }
  ],

  // Day 1: LinkedIn Optimization
  "9_3_1_0": [ // Headline: AI/LLM Developer
    { type: "doc", label: "LinkedIn Profile Tips", url: "https://www.linkedin.com/help/linkedin/answer/a542440" }
  ],
  "9_3_1_1": [ // Featured: capstone project, AI QA platform
    { type: "doc", label: "LinkedIn Featured Section", url: "https://www.linkedin.com/help/linkedin/answer/a704756" }
  ],
  "9_3_1_2": [ // Skills: LLM, RAG, AI Evaluation
    { type: "doc", label: "LinkedIn Skills", url: "https://www.linkedin.com/help/linkedin/answer/a549047" }
  ],

  // Day 2: Job Strategy
  "9_3_2_0": [ // Target: 10 applications/day
    { type: "doc", label: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs/" }
  ],
  "9_3_2_1": [ // LinkedIn Jobs, Wellfound, Hacker News
    { type: "doc", label: "Wellfound (AngelList)", url: "https://wellfound.com/" },
    { type: "doc", label: "HN: Who is Hiring?", url: "https://news.ycombinator.com/item?id=39562986" }
  ],
  "9_3_2_2": [ // Cold outreach templates
    { type: "doc", label: "LinkedIn Help", url: "https://www.linkedin.com/help/linkedin/answer/a546363" }
  ],

  // ── Week 4: Interview Preparation ──

  // Day 0: System Design for AI
  "9_4_0_0": [ // Design a Document Q&A system
    { type: "video", label: "ByteByteGo System Design", url: "https://www.youtube.com/watch?v=i7twT3x5yv8" }
  ],
  "9_4_0_1": [ // Design a chatbot with memory
    { type: "video", label: "ByteByteGo System Design", url: "https://www.youtube.com/watch?v=i7twT3x5yv8" }
  ],
  "9_4_0_2": [ // Framework: requirements → design → deep dive → quality → scale
    { type: "doc", label: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" }
  ],

  // Day 1: AI Concept Questions
  "9_4_1_0": [ // 20 must-know AI interview questions
    { type: "doc", label: "ML Interview FAQ", url: "https://github.com/andrewekhalel/MLQuestions" }
  ],
  "9_4_1_1": [ // RAG, transformers, attention, embeddings
    { type: "doc", label: "Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/" }
  ],
  "9_4_1_2": [ // Hallucination, evaluation, fine-tuning
    { type: "doc", label: "RAGAS Docs", url: "https://docs.ragas.io/" }
  ],

  // Day 2: DSA + Mock Interviews
  "9_4_2_0": [ // Focus patterns: arrays, hash maps, trees, graphs
    { type: "doc", label: "NeetCode Roadmap", url: "https://neetcode.io/roadmap" },
    { type: "problem", label: "NeetCode 150", url: "https://neetcode.io/practice" }
  ],
  "9_4_2_1": [ // Target: Medium in < 25 min
    { type: "problem", label: "LeetCode Medium", url: "https://leetcode.com/problemset/?difficulty=MEDIUM" }
  ],
  "9_4_2_2": [ // 2+ mock interviews (Pramp, friends)
    { type: "doc", label: "Pramp", url: "https://www.pramp.com/" },
    { type: "doc", label: "Interviewing.io", url: "https://interviewing.io/" }
  ],

  // ── Week 5: Launch Job Hunt ──

  // Day 0: Apply + Continue Learning
  "9_5_0_0": [ // Apply to 10+ jobs per day
    { type: "doc", label: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs/" },
    { type: "doc", label: "Wellfound", url: "https://wellfound.com/" }
  ],
  "9_5_0_1": [ // 1 blog post per week
    { type: "doc", label: "dev.to", url: "https://dev.to/" }
  ],
  "9_5_0_2": [ // 2–3 LeetCode per day
    { type: "problem", label: "NeetCode Practice", url: "https://neetcode.io/practice" },
    { type: "problem", label: "LeetCode Daily", url: "https://leetcode.com/problemset/" }
  ],
  "9_5_0_3": [ // Join AI communities
    { type: "doc", label: "MLOps Community", url: "https://mlops.community/" },
    { type: "doc", label: "Weights & Biases Community", url: "https://wandb.ai/site/community" }
  ],
  "9_5_0_4": [ // Open-source contributions
    { type: "doc", label: "First Contributions", url: "https://github.com/firstcontributions/first-contributions" },
    { type: "doc", label: "Good First Issues", url: "https://goodfirstissue.dev/" }
  ],
  "9_5_0_5": [ // Reach out on LinkedIn
    { type: "doc", label: "LinkedIn Help", url: "https://www.linkedin.com/help/linkedin/answer/a546363" }
  ]
};

/** Look up links for a specific topic */
export function getTopicLinks(monthId, weekIdx, dayIdx, topicIdx) {
  return TOPIC_LINKS[`${monthId}_${weekIdx}_${dayIdx}_${topicIdx}`] || [];
}
