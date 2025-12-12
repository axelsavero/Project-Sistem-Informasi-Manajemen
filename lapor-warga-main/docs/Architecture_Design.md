# Perancangan Arsitektur Sistem Lapor Warga

## 1. Gambaran Umum Sistem

**Lapor Warga** adalah aplikasi sistem pengaduan masyarakat yang memungkinkan warga untuk melaporkan berbagai masalah infrastruktur dan layanan publik. Sistem ini menggunakan arsitektur **Client-Server** dengan pemisahan jelas antara front-end dan back-end.

## 2. Arsitektur Sistem

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Front-End<br/>Vite + TypeScript]
        A1[User Interface]
        A2[Admin Dashboard]
    end
    
    subgraph "Network Layer"
        B[HTTP/HTTPS<br/>REST API]
        B1[CORS Configuration]
    end
    
    subgraph "Application Layer"
        C[Laravel Back-End]
        C1[API Controllers]
        C2[Authentication<br/>Laravel Sanctum]
        C3[Middleware]
        C4[Business Logic]
    end
    
    subgraph "Data Layer"
        D[MySQL Database]
        D1[Users Table]
        D2[Complaints Table]
    end
    
    subgraph "Storage Layer"
        E[File Storage]
        E1[Public Storage<br/>Images/Photos]
    end
    
    A1 --> B
    A2 --> B
    B --> C1
    C1 --> C2
    C1 --> C3
    C3 --> C4
    C4 --> D
    C4 --> E
    
    style A fill:#61dafb,stroke:#333,stroke-width:2px
    style C fill:#ff2d20,stroke:#333,stroke-width:2px
    style D fill:#4479a1,stroke:#333,stroke-width:2px
    style E fill:#f39c12,stroke:#333,stroke-width:2px
```

## 3. Technology Stack

### 3.1 Front-End
| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| Framework | React | 18.x |
| Build Tool | Vite | Latest |
| Language | TypeScript | 5.x |
| UI Library | shadcn-ui | Latest |
| Styling | Tailwind CSS | 3.x |
| HTTP Client | Axios | 1.x |
| Routing | React Router | 6.x |
| State Management | React Query | Latest |

### 3.2 Back-End
| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| Framework | Laravel | 10.x |
| Language | PHP | 8.1+ |
| Database | MySQL | 8.0+ |
| Authentication | Laravel Sanctum | 3.x |
| API Style | RESTful | - |
| Validation | Form Requests | Built-in |

## 4. Arsitektur Aplikasi

### 4.1 Model-View-Controller (MVC) Pattern

```mermaid
graph LR
    A[Client Request] --> B[Router]
    B --> C[Controller]
    C --> D[Model]
    D --> E[(Database)]
    D --> C
    C --> F[JSON Response]
    F --> A
    
    style C fill:#ff6b6b,stroke:#333,stroke-width:2px
    style D fill:#4ecdc4,stroke:#333,stroke-width:2px
    style E fill:#95e1d3,stroke:#333,stroke-width:2px
```

### 4.2 Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Sanctum
    participant Database
    
    Client->>API: POST /api/login (email, password)
    API->>Database: Verify credentials
    Database-->>API: User data
    API->>Sanctum: Generate token
    Sanctum-->>API: Access token
    API-->>Client: {token, user}
    
    Note over Client: Store token in localStorage
    
    Client->>API: GET /api/complaints (with token)
    API->>Sanctum: Verify token
    Sanctum-->>API: User authenticated
    API->>Database: Fetch complaints
    Database-->>API: Complaint data
    API-->>Client: {complaints}
```

## 5. Komponen Sistem

### 5.1 Client-Side Components

```mermaid
graph TB
    subgraph "React Application"
        A[App.tsx]
        B[Authentication Provider]
        C[Router]
        
        subgraph "Pages"
            D[Home/Index]
            E[Lapor/Submit]
            F[Tracking]
            G[Admin Dashboard]
            H[Login]
        end
        
        subgraph "API Layer"
            I[api.ts]
            J[auth.ts]
            K[complaint-store.ts]
        end
        
        A --> B
        B --> C
        C --> D
        C --> E
        C --> F
        C --> G
        C --> H
        
        E --> I
        F --> I
        G --> I
        H --> J
        I --> K
    end
    
    style A fill:#61dafb,stroke:#333,stroke-width:2px
    style I fill:#f39c12,stroke:#333,stroke-width:2px
```

### 5.2 Server-Side Components

```mermaid
graph TB
    subgraph "Laravel Application"
        A[routes/api.php]
        
        subgraph "Controllers"
            B[AuthController]
            C[ComplaintController]
        end
        
        subgraph "Middleware"
            D[Sanctum Auth]
            E[AdminOnly]
        end
        
        subgraph "Models"
            F[User Model]
            G[Complaint Model]
        end
        
        subgraph "Requests"
            H[StoreComplaintRequest]
            I[UpdateComplaintRequest]
        end
        
        A --> D
        A --> E
        D --> B
        D --> C
        E --> C
        
        B --> F
        C --> G
        C --> H
        C --> I
    end
    
    style A fill:#ff2d20,stroke:#333,stroke-width:2px
    style F fill:#4ecdc4,stroke:#333,stroke-width:2px
    style G fill:#4ecdc4,stroke:#333,stroke-width:2px
```

## 6. Deployment Architecture

### 6.1 Development Environment

```mermaid
graph LR
    subgraph "Developer Machine"
        A[React Dev Server<br/>localhost:5173]
        B[Laravel Dev Server<br/>localhost:8000]
        C[MySQL Server<br/>localhost:3306]
        
        A -->|API Requests| B
        B -->|SQL Queries| C
    end
    
    style A fill:#61dafb,stroke:#333,stroke-width:2px
    style B fill:#ff2d20,stroke:#333,stroke-width:2px
    style C fill:#4479a1,stroke:#333,stroke-width:2px
```

### 6.2 Production Environment (Recommended)

```mermaid
graph TB
    subgraph "Client Side"
        A[User Browser]
    end
    
    subgraph "Web Server"
        B[Nginx/Apache]
        C[Static Files<br/>React Build]
        D[Laravel Application]
    end
    
    subgraph "Application Server"
        E[PHP-FPM]
    end
    
    subgraph "Database Server"
        F[(MySQL Database)]
    end
    
    subgraph "Storage"
        G[Public Storage<br/>Uploaded Images]
    end
    
    A -->|HTTPS| B
    B --> C
    B -->|/api/*| D
    D --> E
    E --> F
    E --> G
    
    style A fill:#95e1d3,stroke:#333,stroke-width:2px
    style B fill:#f39c12,stroke:#333,stroke-width:2px
    style D fill:#ff2d20,stroke:#333,stroke-width:2px
    style F fill:#4479a1,stroke:#333,stroke-width:2px
```

## 7. Security Architecture

### 7.1 Authentication & Authorization

```mermaid
graph TB
    A[User Login Request]
    B{Valid Credentials?}
    C[Generate Sanctum Token]
    D[Return Error]
    E[Store Token in Client]
    F[Include Token in API Requests]
    G{Valid Token?}
    H{Has Permission?}
    I[Process Request]
    J[Return 401 Unauthorized]
    K[Return 403 Forbidden]
    
    A --> B
    B -->|Yes| C
    B -->|No| D
    C --> E
    E --> F
    F --> G
    G -->|Yes| H
    G -->|No| J
    H -->|Yes| I
    H -->|No| K
    
    style C fill:#52c41a,stroke:#333,stroke-width:2px
    style D fill:#ff4d4f,stroke:#333,stroke-width:2px
    style J fill:#ff4d4f,stroke:#333,stroke-width:2px
    style K fill:#ff4d4f,stroke:#333,stroke-width:2px
```

### 7.2 Security Layers

| Layer | Mechanism | Purpose |
|-------|-----------|---------|
| **Transport** | HTTPS/TLS | Encrypt data in transit |
| **Authentication** | Laravel Sanctum | Verify user identity |
| **Authorization** | Role-based (User/Admin) | Control access to resources |
| **Input Validation** | Form Requests | Prevent injection attacks |
| **CORS** | Laravel CORS Middleware | Control cross-origin requests |
| **File Upload** | Type & size validation | Prevent malicious uploads |
| **SQL Injection** | Eloquent ORM | Parameterized queries |

## 8. Data Flow Architecture

### 8.1 Complaint Submission Flow

```mermaid
flowchart TD
    A[User fills form] --> B[Client-side validation]
    B -->|Invalid| C[Show errors]
    B -->|Valid| D[Prepare FormData]
    D --> E[POST /api/complaints]
    E --> F[Server validation]
    F -->|Invalid| G[Return 422 errors]
    F -->|Valid| H[Generate ticket number]
    H --> I[Store in database]
    I --> J[Upload image if present]
    J --> K[Return complaint data]
    K --> L[Show success + ticket]
    
    style A fill:#61dafb,stroke:#333,stroke-width:2px
    style E fill:#f39c12,stroke:#333,stroke-width:2px
    style I fill:#4479a1,stroke:#333,stroke-width:2px
    style L fill:#52c41a,stroke:#333,stroke-width:2px
```

### 8.2 Admin Dashboard Flow

```mermaid
flowchart TD
    A[Admin login] --> B[Verify credentials]
    B -->|Invalid| C[Return error]
    B -->|Valid| D{Is Admin role?}
    D -->|No| E[Return 403 Forbidden]
    D -->|Yes| F[Generate token]
    F --> G[Access dashboard]
    G --> H[GET /api/complaints]
    H --> I[Fetch all complaints]
    I --> J[Return with stats]
    J --> K[Display in table]
    K --> L[Admin updates status]
    L --> M[PUT /api/complaints/:id]
    M --> N[Update database]
    N --> O[Return updated data]
    O --> P[Refresh dashboard]
    
    style A fill:#61dafb,stroke:#333,stroke-width:2px
    style H fill:#f39c12,stroke:#333,stroke-width:2px
    style I fill:#4479a1,stroke:#333,stroke-width:2px
    style P fill:#52c41a,stroke:#333,stroke-width:2px
```

## 9. Scalability Considerations

### 9.1 Horizontal Scaling Options

- **Load Balancer**: Distribute requests across multiple Laravel instances
- **Database Replication**: Master-slave configuration for read scaling
- **CDN**: Serve static assets and uploaded images
- **Caching**: Redis/Memcached for session and query caching

### 9.2 Performance Optimization

- **Database Indexing**: Index on `ticket_number`, `status`, `created_at`
- **API Response Caching**: Cache complaint statistics
- **Eager Loading**: Prevent N+1 queries in relationships
- **Image Optimization**: Compress uploaded images
- **Pagination**: Limit results for large datasets

## 10. Monitoring & Logging

### 10.1 Application Monitoring

- **Laravel Log**: Store errors and important events
- **API Request Logging**: Track API usage and errors
- **Database Query Monitoring**: Identify slow queries
- **User Activity Logs**: Audit trail for admin actions

### 10.2 Key Metrics

- Complaint submission rate
- Average response time
- Status update frequency
- Admin activity logs
- Error rates by endpoint

## 11. Backup & Recovery

### 11.1 Backup Strategy

- **Database Backup**: Daily automated MySQL dumps
- **File Storage Backup**: Periodic backup of uploaded images
- **Configuration Backup**: Version control for .env and configs

### 11.2 Recovery Plan

- Database restore from latest backup
- Image recovery from storage backup
- Application redeployment from Git repository
