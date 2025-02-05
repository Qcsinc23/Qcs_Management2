# Backend Documentation

## Backend Architecture
- **Database & Storage**: Supabase (PostgreSQL database and storage)
- **Authentication**: Clerk (user management and role-based access control)
- **API Design**: RESTful APIs with Supabase's auto-generated endpoints
- **Real-Time Features**: Supabase Realtime for live updates
- **Third-Party Integrations**:
  - Google Maps API for routing and real-time tracking
  - Stripe for payment processing
  - Twilio for SMS notifications
  - SendGrid for email notifications

## Database Schema
### Tables
1. **Users**:
   - `id` (UUID, Primary Key)
   - `email` (String, Unique)
   - `role` (String, Enum: `admin`, `event_planner`, `logistics_coordinator`, `inventory_manager`, `retail_customer`)
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

2. **Events**:
   - `id` (UUID, Primary Key)
   - `name` (String)
   - `date` (Timestamp)
   - `location` (String)
   - `status` (String, Enum: `upcoming`, `ongoing`, `completed`, `canceled`)
   - `created_by` (UUID, Foreign Key → Users.id)
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

3. **Inventory**:
   - `id` (UUID, Primary Key)
   - `name` (String)
   - `description` (String)
   - `quantity` (Integer)
   - `status` (String, Enum: `available`, `reserved`, `out_of_stock`)
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

4. **Tasks**:
   - `id` (UUID, Primary Key)
   - `name` (String)
   - `description` (String)
   - `assigned_to` (UUID, Foreign Key → Users.id)
   - `status` (String, Enum: `not_started`, `in_progress`, `completed`)
   - `due_date` (Timestamp)
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

5. **Deliveries**:
   - `id` (UUID, Primary Key)
   - `pickup_address` (String)
   - `delivery_address` (String)
   - `status` (String, Enum: `preparing`, `out_for_delivery`, `arriving_soon`, `delivered`)
   - `driver_id` (UUID, Foreign Key → Users.id)
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

6. **Payments**:
   - `id` (UUID, Primary Key)
   - `amount` (Float)
   - `status` (String, Enum: `pending`, `completed`, `failed`)
   - `user_id` (UUID, Foreign Key → Users.id)
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

7. **Notifications**:
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key → Users.id)
   - `message` (String)
   - `type` (String, Enum: `sms`, `email`, `push`)
   - `status` (String, Enum: `sent`, `failed`)
   - `created_at` (Timestamp)

## API Endpoints
### Users
- `GET /users`: Fetch all users (admin only)
- `GET /users/:id`: Fetch a specific user by ID
- `POST /users`: Create a new user (admin only)
- `PATCH /users/:id`: Update a user's details (admin only)
- `DELETE /users/:id`: Delete a user (admin only)

### Events
- `GET /events`: Fetch all events
- `GET /events/:id`: Fetch a specific event by ID
- `POST /events`: Create a new event
- `PATCH /events/:id`: Update an event's details
- `DELETE /events/:id`: Delete an event

### Inventory
- `GET /inventory`: Fetch all inventory items
- `GET /inventory/:id`: Fetch a specific inventory item by ID
- `POST /inventory`: Create a new inventory item
- `PATCH /inventory/:id`: Update an inventory item's details
- `DELETE /inventory/:id`: Delete an inventory item

### Tasks
- `GET /tasks`: Fetch all tasks
- `GET /tasks/:id`: Fetch a specific task by ID
- `POST /tasks`: Create a new task
- `PATCH /tasks/:id`: Update a task's details
- `DELETE /tasks/:id`: Delete a task

### Deliveries
- `GET /deliveries`: Fetch all deliveries
- `GET /deliveries/:id`: Fetch a specific delivery by ID
- `POST /deliveries`: Create a new delivery
- `PATCH /deliveries/:id`: Update a delivery's details
- `DELETE /deliveries/:id`: Delete a delivery

### Payments
- `GET /payments`: Fetch all payments
- `GET /payments/:id`: Fetch a specific payment by ID
- `POST /payments`: Process a payment via Stripe
- `PATCH /payments/:id`: Update a payment's status
- `DELETE /payments/:id`: Delete a payment (admin only)

### Notifications
- `GET /notifications`: Fetch all notifications
- `GET /notifications/:id`: Fetch a specific notification by ID
- `POST /notifications`: Create a new notification
- `PATCH /notifications/:id`: Update a notification's details
- `DELETE /notifications/:id`: Delete a notification

## Authentication and Authorization
- **Authentication**:
  - Clerk handles user authentication (login, signup, password reset)
  - JWT tokens used for session management
- **Authorization**:
  - Role-based access control (RBAC) restricts access to specific endpoints
  - Example: Only `admin` users can create or delete users

## Security Considerations
- **Data Encryption**:
  - Supabase encrypts data at rest and in transit
- **Input Validation**:
  - Validate all user inputs to prevent SQL injection and XSS attacks
- **Rate Limiting**:
  - Implement rate limiting on API endpoints to prevent abuse

## Performance Optimization
- **Database Indexing**:
  - Index frequently queried fields (e.g., `email` in `Users`, `status` in `Deliveries`)
- **Caching**:
  - Use Supabase's caching mechanisms for frequently accessed data
- **Minification and Compression**:
  - Minify and compress API responses for faster loading

## Third-Party Libraries

### 1. Authentication and User Management
- **Library**: **Clerk**
  - **Purpose**: Handle user authentication, role-based access control (RBAC), and user management.
  - **Key Features**:
    - Secure login and signup flows.
    - Multi-factor authentication (MFA) support.
    - Role-based permissions for corporate and retail users.
  - **Integration**:
    - Use Clerk's React SDK for seamless integration with the frontend.
    - Store user roles and permissions in Clerk's dashboard.

### 2. Database and Backend Services
- **Library**: **Supabase**
  - **Purpose**: Provide a scalable backend with PostgreSQL database, real-time capabilities, and storage.
  - **Key Features**:
    - Auto-generated RESTful APIs for database tables.
    - Real-time updates using Supabase Realtime.
    - File storage for proof of delivery (POD) photos.
  - **Integration**:
    - Use Supabase's JavaScript client for frontend-backend communication.
    - Set up row-level security (RLS) for data access control.

### 3. Payment Processing
- **Library**: **Stripe**
  - **Purpose**: Handle payments for retail customers.
  - **Key Features**:
    - Accept credit/debit cards, mobile wallets, and PayPal.
    - Process split payments for shared deliveries.
    - Generate PDF receipts for completed transactions.
  - **Integration**:
    - Use Stripe's React SDK for the payment form.
    - Set up webhooks for payment status updates.

### 4. Mapping and Routing
- **Library**: **Google Maps API**
  - **Purpose**: Provide real-time routing and delivery tracking.
  - **Key Features**:
    - Display live location of delivery drivers.
    - Optimize delivery routes using traffic data.
    - Calculate estimated time of arrival (ETA).
  - **Integration**:
    - Use Google Maps JavaScript API for map rendering.
    - Integrate Directions API and Distance Matrix API for route planning.

### 5. Notifications
- **Library**: **Twilio**
  - **Purpose**: Send SMS notifications to users.
  - **Key Features**:
    - Notify users about delivery status updates.
    - Send one-time passwords (OTPs) for MFA.
  - **Integration**:
    - Use Twilio's API for sending SMS messages
