# Perancangan Class Diagram - Lapor Warga

Dokumen ini menjelaskan struktur kelas dalam sistem Lapor Warga, termasuk Models, Controllers, Requests, dan Middleware.

## 1. Complete Class Diagram

```mermaid
classDiagram
    %% Models
    class User {
        +int id
        +string name
        +string email
        +string password
        +string phone
        +enum role
        +timestamp email_verified_at
        +timestamp created_at
        +timestamp updated_at
        +complaints() HasMany
        +isAdmin() bool
        +isUser() bool
    }
    
    class Complaint {
        +int id
        +int user_id
        +string ticket_number
        +string name
        +string email
        +string phone
        +string address
        +enum category
        +text description
        +string image_path
        +enum status
        +text admin_notes
        +timestamp created_at
        +timestamp updated_at
        +user() BelongsTo
        +getImageUrlAttribute() string
        +scopePending() Builder
        +scopeInProgress() Builder
        +scopeCompleted() Builder
        +scopeRejected() Builder
        +generateTicketNumber() string
    }
    
    %% Controllers
    class AuthController {
        -UserRepository $userRepository
        +register(RegisterRequest) JsonResponse
        +login(LoginRequest) JsonResponse
        +logout(Request) JsonResponse
        +me(Request) JsonResponse
    }
    
    class ComplaintController {
        -ComplaintRepository $complaintRepository
        +index(Request) JsonResponse
        +store(StoreComplaintRequest) JsonResponse
        +show(int id) JsonResponse
        +update(int id, UpdateComplaintRequest) JsonResponse
        +findByTicket(string ticket) JsonResponse
        +stats(Request) JsonResponse
    }
    
    %% Form Requests
    class RegisterRequest {
        +authorize() bool
        +rules() array
        +messages() array
    }
    
    class LoginRequest {
        +authorize() bool
        +rules() array
        +messages() array
    }
    
    class StoreComplaintRequest {
        +authorize() bool
        +rules() array
        +messages() array
    }
    
    class UpdateComplaintRequest {
        +authorize() bool
        +rules() array
        +messages() array
    }
    
    %% Middleware
    class AdminOnly {
        +handle(Request, Closure) mixed
    }
    
    %% Repositories (Optional Pattern)
    class UserRepository {
        -User $model
        +create(array data) User
        +findByEmail(string email) User
        +findById(int id) User
    }
    
    class ComplaintRepository {
        -Complaint $model
        +create(array data) Complaint
        +update(int id, array data) Complaint
        +findById(int id) Complaint
        +findByTicketNumber(string ticket) Complaint
        +getAllWithFilters(array filters) Collection
        +getStatistics() array
    }
    
    %% Relationships
    User "1" --> "*" Complaint : has many
    Complaint "*" --> "0..1" User : belongs to
    
    AuthController --> User : uses
    AuthController --> RegisterRequest : validates with
    AuthController --> LoginRequest : validates with
    AuthController --> UserRepository : depends on
    
    ComplaintController --> Complaint : uses
    ComplaintController --> StoreComplaintRequest : validates with
    ComplaintController --> UpdateComplaintRequest : validates with
    ComplaintController --> ComplaintRepository : depends on
    ComplaintController --> AdminOnly : protected by
    
    UserRepository --> User : manages
    ComplaintRepository --> Complaint : manages
```

## 2. Model Layer Details

### 2.1 User Model

```mermaid
classDiagram
    class User {
        <<Eloquent Model>>
        
        %% Properties
        -int $id
        -string $name
        -string $email
        -string $password
        -string $phone
        -string $role
        -DateTime $email_verified_at
        -DateTime $created_at
        -DateTime $updated_at
        
        %% Constants
        +const ROLE_USER = "user"
        +const ROLE_ADMIN = "admin"
        
        %% Fillable
        +array $fillable
        +array $hidden
        +array $casts
        
        %% Relationships
        +complaints() HasMany~Complaint~
        
        %% Methods
        +isAdmin() bool
        +isUser() bool
        +hasRole(string role) bool
    }
    
    class HasApiTokens {
        <<Trait>>
        +tokens() MorphMany
        +createToken(string name) NewAccessToken
        +currentAccessToken() PersonalAccessToken
    }
    
    class Authenticatable {
        <<Laravel Class>>
        +getAuthIdentifier() mixed
        +getAuthPassword() string
    }
    
    User --|> Authenticatable : extends
    User ..|> HasApiTokens : uses
```

### 2.2 Complaint Model

```mermaid
classDiagram
    class Complaint {
        <<Eloquent Model>>
        
        %% Properties
        -int $id
        -int $user_id
        -string $ticket_number
        -string $name
        -string $email
        -string $phone
        -string $address
        -string $category
        -string $description
        -string $image_path
        -string $status
        -string $admin_notes
        -DateTime $created_at
        -DateTime $updated_at
        
        %% Constants
        +const STATUS_PENDING = "pending"
        +const STATUS_IN_PROGRESS = "in_progress"
        +const STATUS_COMPLETED = "completed"
        +const STATUS_REJECTED = "rejected"
        
        +const CATEGORY_JALAN_RUSAK = "jalan_rusak"
        +const CATEGORY_SAMPAH = "sampah"
        +const CATEGORY_PENERANGAN = "penerangan"
        +const CATEGORY_SALURAN_AIR = "saluran_air"
        +const CATEGORY_FASILITAS_UMUM = "fasilitas_umum"
        +const CATEGORY_LAINNYA = "lainnya"
        
        %% Fillable
        +array $fillable
        +array $casts
        +array $appends
        
        %% Relationships
        +user() BelongsTo~User~
        
        %% Accessors
        +getImageUrlAttribute() string
        +getCategoryLabelAttribute() string
        +getStatusLabelAttribute() string
        
        %% Scopes
        +scopePending(Builder query) Builder
        +scopeInProgress(Builder query) Builder
        +scopeCompleted(Builder query) Builder
        +scopeRejected(Builder query) Builder
        +scopeByCategory(Builder query, string category) Builder
        
        %% Static Methods
        +static generateTicketNumber() string
        
        %% Boot Method
        #static boot() void
    }
    
    class Model {
        <<Laravel Class>>
        +save() bool
        +update(array attributes) bool
        +delete() bool
    }
    
    Complaint --|> Model : extends
```

## 3. Controller Layer

### 3.1 AuthController

```mermaid
classDiagram
    class AuthController {
        <<API Controller>>
        
        -UserRepository $userRepository
        
        +__construct(UserRepository repository)
        +register(RegisterRequest request) JsonResponse
        +login(LoginRequest request) JsonResponse
        +logout(Request request) JsonResponse
        +me(Request request) JsonResponse
        
        -createUserToken(User user) string
    }
    
    class Controller {
        <<Laravel Base>>
    }
    
    class RegisterRequest {
        +rules() array
    }
    
    class LoginRequest {
        +rules() array
    }
    
    AuthController --|> Controller : extends
    AuthController --> RegisterRequest : uses
    AuthController --> LoginRequest : uses
    AuthController --> User : creates/manages
```

### 3.2 ComplaintController

```mermaid
classDiagram
    class ComplaintController {
        <<API Controller>>
        
        -ComplaintRepository $complaintRepository
        
        +__construct(ComplaintRepository repository)
        +index(Request request) JsonResponse
        +store(StoreComplaintRequest request) JsonResponse
        +show(int id) JsonResponse
        +update(int id, UpdateComplaintRequest request) JsonResponse
        +destroy(int id) JsonResponse
        +findByTicket(string ticketNumber) JsonResponse
        +stats(Request request) JsonResponse
        
        -handleImageUpload(UploadedFile file) string
        -deleteImage(string path) bool
    }
    
    class Controller {
        <<Laravel Base>>
    }
    
    class StoreComplaintRequest {
        +rules() array
    }
    
    class UpdateComplaintRequest {
        +rules() array
    }
    
    ComplaintController --|> Controller : extends
    ComplaintController --> StoreComplaintRequest : uses
    ComplaintController --> UpdateComplaintRequest : uses
    ComplaintController --> Complaint : manages
```

## 4. Request Validation Layer

### 4.1 Form Requests

```mermaid
classDiagram
    class FormRequest {
        <<Laravel Class>>
        +authorize() bool
        +rules() array
        +messages() array
        +attributes() array
    }
    
    class RegisterRequest {
        +authorize() bool
        +rules() array
        +messages() array
    }
    
    class LoginRequest {
        +authorize() bool
        +rules() array
    }
    
    class StoreComplaintRequest {
        +authorize() bool
        +rules() array
        +messages() array
        +attributes() array
    }
    
    class UpdateComplaintRequest {
        +authorize() bool
        +rules() array
        +messages() array
    }
    
    RegisterRequest --|> FormRequest : extends
    LoginRequest --|> FormRequest : extends
    StoreComplaintRequest --|> FormRequest : extends
    UpdateComplaintRequest --|> FormRequest : extends
```

### 4.2 Validation Rules Detail

```mermaid
classDiagram
    class StoreComplaintRequest {
        +authorize() bool
        +rules() array
        
        -nameRules: required, string, max:255
        -emailRules: required, email
        -phoneRules: required, string
        -addressRules: required, string
        -categoryRules: required, in:categories
        -descriptionRules: required, string, min:20
        -imageRules: nullable, image, max:5120
    }
    
    class UpdateComplaintRequest {
        +authorize() bool
        +rules() array
        
        -statusRules: required, in:statuses
        -adminNotesRules: nullable, string
        
        +userIsAdmin() bool
    }
```

## 5. Middleware Layer

### 5.1 AdminOnly Middleware

```mermaid
classDiagram
    class AdminOnly {
        <<Middleware>>
        
        +handle(Request request, Closure next) mixed
        
        -checkAdminRole(User user) bool
        -unauthorizedResponse() JsonResponse
    }
    
    class Middleware {
        <<Interface>>
        +handle(Request, Closure) mixed
    }
    
    AdminOnly ..|> Middleware : implements
    AdminOnly --> User : checks role
```

## 6. Repository Pattern (Optional)

### 6.1 Repository Classes

```mermaid
classDiagram
    class RepositoryInterface {
        <<Interface>>
        +create(array data) Model
        +update(int id, array data) Model
        +find(int id) Model
        +all() Collection
        +delete(int id) bool
    }
    
    class UserRepository {
        -User $model
        
        +__construct(User model)
        +create(array data) User
        +findByEmail(string email) User
        +findById(int id) User
        +updateProfile(int id, array data) User
    }
    
    class ComplaintRepository {
        -Complaint $model
        
        +__construct(Complaint model)
        +create(array data) Complaint
        +update(int id, array data) Complaint
        +findById(int id) Complaint
        +findByTicketNumber(string ticket) Complaint
        +getAllWithFilters(array filters) Collection
        +getStatistics() array
        +getPendingComplaints() Collection
        +getComplaintsByStatus(string status) Collection
    }
    
    UserRepository ..|> RepositoryInterface : implements
    ComplaintRepository ..|> RepositoryInterface : implements
    UserRepository --> User : manages
    ComplaintRepository --> Complaint : manages
```

## 7. Service Layer (Optional)

### 7.1 Service Classes

```mermaid
classDiagram
    class ComplaintService {
        -ComplaintRepository $repository
        -FileStorageService $storage
        -NotificationService $notification
        
        +__construct(...)
        +createComplaint(array data, UploadedFile image) Complaint
        +updateStatus(int id, string status, string notes) Complaint
        +deleteComplaint(int id) bool
        
        -generateTicketNumber() string
        -storeImage(UploadedFile file) string
        -notifyUser(Complaint complaint) void
    }
    
    class FileStorageService {
        +store(UploadedFile file, string path) string
        +delete(string path) bool
        +url(string path) string
    }
    
    class NotificationService {
        +sendComplaintCreated(Complaint complaint) void
        +sendStatusUpdated(Complaint complaint) void
    }
    
    ComplaintService --> ComplaintRepository : uses
    ComplaintService --> FileStorageService : uses
    ComplaintService --> NotificationService : uses
```

## 8. Resource/Transformer Layer

### 8.1 API Resources

```mermaid
classDiagram
    class JsonResource {
        <<Laravel Class>>
        +toArray(Request request) array
    }
    
    class UserResource {
        +toArray(Request request) array
        
        -id: int
        -name: string
        -email: string
        -phone: string
        -role: string
        -created_at: string
    }
    
    class ComplaintResource {
        +toArray(Request request) array
        
        -id: int
        -ticket_number: string
        -name: string
        -email: string
        -phone: string
        -address: string
        -category: string
        -category_label: string
        -description: string
        -image_url: string
        -status: string
        -status_label: string
        -admin_notes: string
        -created_at: string
        -updated_at: string
        -user: UserResource
    }
    
    class ComplaintCollection {
        +toArray(Request request) array
        
        -data: array
        -meta: object
    }
    
    UserResource --|> JsonResource : extends
    ComplaintResource --|> JsonResource : extends
    ComplaintCollection --|> JsonResource : extends
    ComplaintResource --> UserResource : includes
```

## 9. Complete System Class Diagram

```mermaid
classDiagram
    %% Frontend Classes
    class ApiService {
        -axios: AxiosInstance
        -baseURL: string
        -token: string
        +setToken(token: string)
        +get(url: string)
        +post(url: string, data: any)
        +put(url: string, data: any)
        +delete(url: string)
    }
    
    class AuthService {
        +login(email: string, password: string)
        +register(data: object)
        +logout()
        +getCurrentUser()
        +isAuthenticated(): boolean
        +isAdmin(): boolean
    }
    
    class ComplaintService {
        +createComplaint(data: object)
        +getComplaints()
        +getComplaintByTicket(ticket: string)
        +updateComplaint(id: number, data: object)
        +getStats()
    }
    
    %% Backend Models
    class User {
        +id: number
        +name: string
        +email: string
        +role: string
        +complaints(): HasMany
        +isAdmin(): boolean
    }
    
    class Complaint {
        +id: number
        +ticket_number: string
        +status: string
        +user(): BelongsTo
        +generateTicketNumber(): string
    }
    
    %% Backend Controllers
    class AuthController {
        +register()
        +login()
        +logout()
        +me()
    }
    
    class ComplaintController {
        +index()
        +store()
        +show()
        +update()
        +findByTicket()
        +stats()
    }
    
    %% Relationships
    ApiService <-- AuthService : uses
    ApiService <-- ComplaintService : uses
    AuthController --> User : manages
    ComplaintController --> Complaint : manages
    User "1" --> "*" Complaint : has many
```

## Summary

Class diagram ini menggambarkan:

1. **Model Layer**: User dan Complaint models dengan properties, methods, dan relationships
2. **Controller Layer**: AuthController dan ComplaintController untuk handling HTTP requests
3. **Request Layer**: Form validation classes untuk setiap operation
4. **Middleware Layer**: AdminOnly untuk role-based access control
5. **Repository Pattern**: Optional abstraction layer untuk data access
6. **Service Layer**: Optional business logic separation
7. **Resource Layer**: API response transformation
8. **Frontend Integration**: Service classes untuk API communication

Struktur ini mengikuti best practices Laravel dan SOLID principles untuk maintainability dan scalability.
