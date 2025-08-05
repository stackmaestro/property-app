# 🏢 Multifamily Property Management App

A comprehensive property management application designed for multifamily property developers and managers. This app helps determine ideal tenant profiles and provides intelligent amenity suggestions based on property location, demographics, and market analysis.


### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd multifamily-property-app
```

2. **Install dependencies**
```bash
cd frontend
npm install

cd backend
npm install
```

3. **PostgreSQL Database Setup**

**Install PostgreSQL** (if not already installed)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Windows: Download from https://www.postgresql.org/download/windows/
```

**Create Database and User**
```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Or on macOS/Windows
psql -U postgres
```

**Execute Database Setup Commands**
```sql
CREATE DATABASE your_db_name;
CREATE USER your_user_name WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE your_db_name TO your_user_name;
```

**Test Database Connection**
```bash
psql -h localhost -U property_app_user -d property_management_db
```

4. **Environment Variables**
## Backend Env
```bash
DATABASE_URL=postgresql://property_app_user:your_secure_password@your-db-host:your_custom_pot_number/property_management_db
PORT=your_custom_backend_port_number
FRONTEND_URL=http://localhost:3000 #or deployed frontend url
NODE_ENV=local #or production
```
## Frontend Env
```bash
VITE_API_URL=http://localhost:3001/trpc #or deployed backend api url
```

5. **Start Development Servers**
```bash
cd backend
npm run dev

cd frontend 
npm run dev
```

