# Project Name

This README provides instructions for setting up and running the project.

## Prerequisites

- Node.js installed on your machine
- MongoDB Atlas account

## Installation

1. Clone the repository:
   ```
    git clone https://github.com/smraddhi18/DailyExpense.git
   cd DailyExpense
   ```

2. Install dependencies:
   ```
   node i
   ```

## Configuration

1. Create a `.env` file in the root directory of the project.

2. Add your MongoDB Atlas connection string to the `.env` file:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   ```

### Setting up MongoDB Atlas

1. Sign in to your MongoDB Atlas account or create a new one at https://www.mongodb.com/cloud/atlas

2. Create a new cluster:
   - Click on "Build a Cluster"
   - Choose your preferred cloud provider and region
   - Select the cluster tier (you can use the free tier for testing)
   - Give your cluster a name
   - Click "Create Cluster"

3. Once your cluster is created, click on "Connect"

4. Choose "Connect your application"

5. Copy the connection string and replace `<password>` with your database user's password

6. Paste this connection string into your `.env` file as shown in the Configuration section above

## Running the Application

To start the application, run:

```
npm start
```

The application should now be running and connected to your MongoDB Atlas cluster.